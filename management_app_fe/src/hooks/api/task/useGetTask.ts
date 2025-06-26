"use client";

import useAxios from "@/hooks/useAxios";
import type { Task } from "@/types/task";
import { useQuery } from "@tanstack/react-query";

const useGetTask = (taskId: string) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async (): Promise<Task> => {
      const { data } = await axiosInstance.get(`/tasks/${taskId}`);
      return data;
    },
    enabled: !!taskId,
  });
};

export default useGetTask;
