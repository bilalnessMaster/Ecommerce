import { redis } from "../lib/redis.js";
import Product from "../models/Product.js";
import cloudinary from "../lib/cloudinary.js";
async function updateFeaturedProducts(pd) {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (featuredProducts) {
      await redis.set("featured_products", JSON.stringify(featuredProducts));
    }
  } catch {}
}
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.log("error occured in getAllProduct" + error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getAllFeatured = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_Products");
    if (featuredProducts) return res.status(200).json(featuredProducts);

    // if not in redis then get from database which is mongoDB
    // .lean() is used to convert mongoDB object to javascript object
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) return res.status(404).json({ message: "featured products not found" });
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    return res.status(200).json({featuredProducts});
  } catch (error) {
    console.log("error occured in getAllProduct" + error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
export const createRoute = async (req, res) => {
  const { name, description, price, category, image } = req.body;

   
  try {
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
    });
    res.json({message : "created successfully"})
  } catch (error) {
    console.log("error occured in createRoute" + error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const deleteRoute = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "product not found" });
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("image deleted from cloudinary");
      } catch (error) {
        console.log(
          "error occured in process of deleting image from cloudinary" + error
        );
        res.status(500).json({ message: "server error", error: error.message });
      }
    }
  } catch (error) {
    console.log("error occured in deleteRoute" + error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
export const getrecommendation = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          description: 1,
          category: 1,
          price: 1,
        },
      },
    ]);
    return res.json({ products });
  } catch (error) {
    console.log("error occured in getrecommendation" + error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
export const getcaterogyRoute = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category: category });
    return res.json({ products });
  } catch (error) {
    console.log("error occured in getcaterogyRoute" + error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
export const toggelFeaturesProductRoute = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProducts(updatedProduct);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.log("error occured in toggelFeaturesProductRoute" + error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
