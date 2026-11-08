import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  decrementCartItem,
  incrementCartItem,
  removeFromCart,
} from "./cart";
import { cartKeys } from "./cart.queries";

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => addToCart(productId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cartKeys.cart }),
  });
};

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cartKeys.cart }),
  });
};

export const useDecrementCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number) => decrementCartItem(cartItemId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cartKeys.cart }),
  });
};

export const useIncrementCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number) => incrementCartItem(cartItemId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cartKeys.cart }),
  });
};
