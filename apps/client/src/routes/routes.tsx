import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "@/layout/MainLayout";
import { APP_ROUTES } from "@/constants/appRoutes";

const router = createBrowserRouter([
  {
    path: APP_ROUTES.home,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={APP_ROUTES.classes} replace />,
      },
      {
        path: APP_ROUTES.classes,
        lazy: {
          Component: async () =>
            (await import("@/pages/Classes/Classes")).default,
        },
      },
      {
        path: APP_ROUTES.addClass,
        lazy: {
          Component: async () =>
            (await import("@/pages/Classes/AddClass")).default,
        },
      },
      {
        path: APP_ROUTES.teachers,
        lazy: {
          Component: async () =>
            (await import("@/pages/Teachers/Teachers")).default,
        },
      },
      {
        path: APP_ROUTES.addTeacher,
        lazy: {
          Component: async () =>
            (await import("@/pages/Teachers/AddTeacher")).default,
        },
      },
      {
        path: "*",
        element: <Navigate to={APP_ROUTES.home} replace />,
      },
    ],
  },
]);

export default router;
