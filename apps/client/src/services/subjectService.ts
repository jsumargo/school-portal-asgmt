import { API_ROUTES } from "@/constants/apiRoutes";
import apiClient from "./api";

export const subjectService = {
  getAll: () => apiClient.get(API_ROUTES.subjects).then((res) => res.data),
};
