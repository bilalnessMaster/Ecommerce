import React, { useEffect } from "react";
import CatergoryItem from "../components/CatergoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];
const HomePage = () => {
  const { fetchFeaturedProducts, products } = useProductStore();
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="container mx-auto py-5">
      <div className="text-center text-3xl">
        <div className="w-full h-[600px] mb-6 relative  ">
          <img  className="w-full h-full object-cover opacity-80" src="https://images.unsplash.com/photo-1567365607350-aa8ebcd4e0da?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-white">
            <h1>Explore Our Categories</h1>
            <p className="text-lg text-gray-200 mb-3">
              Discover the latest trends in eco-friendly fashion
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
          {categories.map((category) => {
            return <CatergoryItem key={category.name} category={category} />;
          })}
        </div>
      </div>
      <div>
        <FeaturedProducts featuredProducts={products} />
      </div>
    </div>
  );
};

export default HomePage;
