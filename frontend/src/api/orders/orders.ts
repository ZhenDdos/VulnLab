import { api } from "../axios";

export type OrderResponse = {
  id: number;
  user_id: number;
  total_price: string;
  status: string;
  created_at: string;
};

export type CreateOrderResponse = {
  message: string;
  order: OrderResponse;
};

export const createOrder = async (): Promise<CreateOrderResponse> => {
  const { data } = await api.post<CreateOrderResponse>("/orders");
  return data;
};
