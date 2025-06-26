"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteTask = (projectId?: string) => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data } = await axiosInstance.delete(`/tasks/${taskId}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        queryClient.invalidateQueries({
          queryKey: ["project", projectId, "tasks"],
        });
      }
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to delete task");
    },
  });
};

export default useDeleteTask;
