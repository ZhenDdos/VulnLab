import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCart } from "./cart";

export const cartKeys = {
  cart: ["cart"] as const,
};

export const cartQueryOptions = () =>
  queryOptions({
    queryKey: cartKeys.cart,
    queryFn: getCart,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: "always",
  });

export const useCart = () => {
  return useQuery(cartQueryOptions());
};
