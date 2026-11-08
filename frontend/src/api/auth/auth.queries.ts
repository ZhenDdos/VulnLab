import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getMe, type Me } from "./auth";

export const authQueryKeys = {
  me: ["me"] as const,
};

export const useMe = () => {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: async (): Promise<Me | null> => {
      try {
        return await getMe();
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
};
