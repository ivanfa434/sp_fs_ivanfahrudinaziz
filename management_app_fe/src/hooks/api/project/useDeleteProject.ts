"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useDeleteProject = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await axiosInstance.delete(`/projects/${projectId}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/dashboard");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to delete project");
    },
  });
};

export default useDeleteProject;
