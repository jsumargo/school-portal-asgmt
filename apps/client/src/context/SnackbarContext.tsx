import { createContext, useContext, useState, type ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { type AlertColor } from "@mui/material/Alert";

interface SnackbarOptions {
  message: string;
  severity?: AlertColor;
}

interface SnackbarContextType {
  showSnackbar: (options: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const showSnackbar = ({ message, severity = "success" }: SnackbarOptions) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  return (
    <SnackbarContext value={{ showSnackbar }}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={severity} onClose={() => setOpen(false)}>
          {message}
        </Alert>
      </Snackbar>

      {children}
    </SnackbarContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within SnackbarProvider");
  return context;
};
