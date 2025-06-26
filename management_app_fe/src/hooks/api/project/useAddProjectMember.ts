"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface AddMemberPayload {
  projectId: string;
  email: string;
}

const useAddProjectMember = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddMemberPayload) => {
      const { projectId, email } = payload;

      const { data: result } = await axiosInstance.post(
        `/projects/${projectId}/members`,
        { email }
      );

      return result;
    },
    onSuccess: (_, variables) => {
      toast.success("Member invited successfully");
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId, "members"],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to invite member");
    },
  });
};

export default useAddProjectMember;
