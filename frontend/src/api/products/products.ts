import { api } from "../axios.js";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export const fetchProducts = async (sort: string) => {
  const { data } = await api.get<Product[]>("/products", {
    params: { sortBy: sort },
  });
  return data;
};
