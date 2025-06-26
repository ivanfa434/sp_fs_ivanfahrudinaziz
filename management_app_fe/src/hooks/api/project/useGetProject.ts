import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@/types/project";

const useGetProject = (projectId: string) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Project>(
        `/projects/${projectId}`
      );
      return data;
    },
    enabled: !!projectId,
  });
};

export default useGetProject;
