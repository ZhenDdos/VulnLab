// src/api/products.queries.ts
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchProducts, SortDirection } from "./products";

export const productKeys = {
  all: ["products"] as const,
  bySort: (sort: SortDirection) => [...productKeys.all, sort] as const,
};

export const productsQueryOptions = (sort: SortDirection) =>
  queryOptions({
    queryKey: productKeys.bySort(sort),
    queryFn: () => fetchProducts(sort),
    staleTime: 1000 * 60 * 5,
  });

export const useProducts = (sort: SortDirection) => {
  return useQuery(productsQueryOptions(sort));
};
