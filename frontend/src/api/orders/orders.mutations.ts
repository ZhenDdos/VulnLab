import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "../cart/cart.queries";
import { createOrder } from "./orders";

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cartKeys.cart }),
  });
};
