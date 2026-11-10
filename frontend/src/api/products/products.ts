import { api } from "../axios.js";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export type SortDirection = "asc" | "desc";

export const fetchProducts = async (sort: SortDirection) => {
  const { data } = await api.get<Product[]>("/products", {
    params: { sortBy: sort },
  });
  return data;
};
