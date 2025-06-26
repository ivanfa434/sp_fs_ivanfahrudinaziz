"use client";

import useAxios from "@/hooks/useAxios";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const useGetUsers = (search?: string) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["users", search],
    queryFn: async (): Promise<User[]> => {
      const { data } = await axiosInstance.get("/users", {
        params: { search },
      });
      return data;
    },
  });
};

export default useGetUsers;
