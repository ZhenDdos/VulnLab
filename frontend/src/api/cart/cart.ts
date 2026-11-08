import { api } from "../axios";

export type CartItemResponse = {
  cart_item_id: number;
  quantity: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string;
};

export type DecrementCartItemResponse = {
  message: string;
  quantity?: number;
};

export const addToCart = async (productId: number) => {
  const { data } = await api.post("/cart/add", { productId });
  return data;
};

export const getCart = async (): Promise<CartItemResponse[]> => {
  const { data } = await api.get("/cart");
  return data;
};

export const removeFromCart = async (cartItemId: number) => {
  const { data } = await api.delete(`/cart/${cartItemId}`);
  return data;
};

export const decrementCartItem = async (
  cartItemId: number,
): Promise<DecrementCartItemResponse> => {
  const { data } = await api.put<DecrementCartItemResponse>(
    `/cart/${cartItemId}/decrement`,
  );
  return data;
};

export const incrementCartItem = async (
  cartItemId: number,
): Promise<DecrementCartItemResponse> => {
  const { data } = await api.put<DecrementCartItemResponse>(
    `/cart/${cartItemId}/increment`,
  );
  return data;
};
