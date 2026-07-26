import { API_ROUTES } from "@/constants/apiRoutes";
import apiClient from "./api";

export const levelService = {
  getAll: () => apiClient.get(API_ROUTES.levels).then((res) => res.data),
};
