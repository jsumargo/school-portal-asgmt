import { API_ROUTES } from "@/constants/apiRoutes";
import apiClient from "./api";
import type { CreateClassRequest } from "@school-portal/shared";

export const classService = {
  create: (requestData: CreateClassRequest) =>
    apiClient.post(API_ROUTES.classes, requestData).then((res) => res.data),
  getAll: () => apiClient.get(API_ROUTES.classes).then((res) => res.data),
};
