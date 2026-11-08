import { api } from "../axios.js";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export const fetchProducts = async () => {
  const { data } = await api.get<Product[]>("/products");
  return data;
};
