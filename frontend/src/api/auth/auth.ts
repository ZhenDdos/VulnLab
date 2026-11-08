import { api } from "../axios";

type AuthResponse = {
  message: string;
  userId: number;
};

type RegisterResponse = {
  message: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export type Me = {
  userId: number;
  email: string;
};

export const login = async (credentials: Credentials) => {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);
  return data;
};

export const register = async (credentials: Credentials) => {
  const { data } = await api.post<RegisterResponse>(
    "/auth/register",
    credentials,
  );
  return data;
};

export const getMe = async () => {
  const response = await api.get<Me>("/auth/me");
  return response.data;
};

export const logout = async () => {
  const { data } = await api.post<{ message: string }>("/auth/logout");
  return data;
};
