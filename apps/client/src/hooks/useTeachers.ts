import { useSnackbar } from "@/context/SnackbarContext";
import { teacherService } from "@/services/teacherService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const TEACHER_QUERY_KEY = ["teachers"];

export const useGetTeachers = () => {
  return useQuery({
    queryKey: TEACHER_QUERY_KEY,
    queryFn: async () => {
      const res = await teacherService.getAll();
      return res.data;
    },
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: teacherService.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEACHER_QUERY_KEY });
      showSnackbar({
        message: `Teacher "${variables.name}" has been created!`,
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data.error ?? "Something went wrong.";
      showSnackbar({ message, severity: "error" });
    },
  });
};
