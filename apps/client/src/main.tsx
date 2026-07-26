import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "./context/SnackbarContext";
import theme from "./theme/theme";

const queryClient = new QueryClient();

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
