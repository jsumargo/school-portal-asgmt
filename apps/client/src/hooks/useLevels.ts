import { levelService } from "@/services/levelService";
import { useQuery } from "@tanstack/react-query";

const LEVELS_QUERY_KEY = ["levels"];

export const useGetLevels = () => {
  return useQuery({
    queryKey: LEVELS_QUERY_KEY,
    queryFn: async () => {
      const res = await levelService.getAll();
      return res.data;
    },
  });
};
