import type { CreateTeacherRequest } from "@school-portal/shared";
import apiClient from "./api";
import { API_ROUTES } from "@/constants/apiRoutes";

export const teacherService = {
  create: (requestData: CreateTeacherRequest) =>
    apiClient.post(API_ROUTES.teachers, requestData).then((res) => res.data),
  getAll: () => apiClient.get(API_ROUTES.teachers).then((res) => res.data),
};
