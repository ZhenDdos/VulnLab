// src/api/products.queries.ts
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./products";

export const productKeys = {
  all: ["products"] as const,
};

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: productKeys.all,
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

export const useProducts = () => {
  return useQuery(productsQueryOptions());
};
