import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import ProductsTab from "../components/ProductsTab";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  recommendation: [],
  setProducts: (Produtcs) => set({ products: Produtcs }),
  createProduct: async (Produtcs) => {
    set({ loading: true });
    try {
      const { data } = await axios.post("/products", Produtcs);

      set({ loading: false });
      set((prevState) => ({ loading: false, products: data?.products }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
      set({ loading: false });
    }
  },
  getAllProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/products");

      set((prevState) => ({ loading: false, products: [...data.products] }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "something went wrong");
    }
  },
  DeleteProduct: async (id) => {
    set({ loading: true });
    try {
      const { data } = await axios.delete(`/products/${id}`);
      set((prevState) => ({
        loading: false,
        products: prevState.products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "something went wrong");
    }
  },
  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const { data } = await axios.patch(`/products/${id}`);
      set((prevState) => ({
        loading: false,
        products: [...prevState.products],
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "something went wrong");
    }
  },
  getCategoryProducts: async (category) => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`/products/category/${category}`);
      set((prevState) => ({ loading: false, products: [...data.products] }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "something went wrong");
    }
  },
  getRecommendation: async () => {
    const { data } = await axios.get("/products/recommendations");
    set({ recommendation: [...data.products] });
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const {data} = await axios.get("/products/Featured");
      set({ products: data.featuredProducts , loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
}));
