"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface RemoveMemberPayload {
  projectId: string;
  userId: string;
}

const useRemoveProjectMember = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RemoveMemberPayload) => {
      const { data } = await axiosInstance.delete(
        `/projects/${payload.projectId}/members/${payload.userId}`
      );
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId, "members"],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to remove member");
    },
  });
};

export default useRemoveProjectMember;
