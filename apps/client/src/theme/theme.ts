import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#135BB4",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#E22C3B",
    },
    background: {
      default: "#F7F7F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1rem",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 800,
      lineHeight: "2.25rem",
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: 800,
      lineHeight: "1.625rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          height: "5.5rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: "0.875rem",
          fontWeight: 600,
          color: theme.palette.text.primary,
          marginBottom: "0.5rem",
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          fontSize: "0.875rem",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F7F7F7",
        },
      },
    },
  },
});

export default theme;
