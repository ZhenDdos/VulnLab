// src/api/products.queries.ts
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./products";

export const productKeys = {
  all: ["products"] as const,
  bySort: (sort: string) => [...productKeys.all, sort] as const,
};

export const productsQueryOptions = (sort: string) =>
  queryOptions({
    queryKey: productKeys.bySort(sort),
    queryFn: () => fetchProducts(sort),
    staleTime: 1000 * 60 * 5,
  });

export const useProducts = (sort: string) => {
  return useQuery(productsQueryOptions(sort));
};
