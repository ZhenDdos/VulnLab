import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, register, type Credentials } from "./auth";
import { authQueryKeys } from "./auth.queries";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (credentials: Credentials) => login(credentials),
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (credentials: Credentials) => register(credentials),
  });

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.me, null);
    },
  });
};
