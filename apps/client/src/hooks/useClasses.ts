import { useSnackbar } from "@/context/SnackbarContext";
import { classService } from "@/services/classService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const CLASSES_QUERY_KEY = ["classes"];

export const useGetClasses=() =>{
  return useQuery({
    queryKey: CLASSES_QUERY_KEY,
    queryFn: async () => {
      const res = await classService.getAll();
      return res.data;
    },
  });
}

export const useCreateClass=()=> {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: classService.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY });
      showSnackbar({
        message: `Class "${variables.name}" has been created!`,
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data.error ?? "Something went wrong.";
      showSnackbar({ message, severity: "error" });
    },
  });
}
