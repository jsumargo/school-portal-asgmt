import { subjectService } from "@/services/subjectService";
import { useQuery } from "@tanstack/react-query";

const SUBJECTS_QUERY_KEY = ["subjects"];

export const useGetSubjects = () => {
  return useQuery({
    queryKey: SUBJECTS_QUERY_KEY,
    queryFn: async () => {
      const res = await subjectService.getAll();
      return res.data;
    },
  });
};
