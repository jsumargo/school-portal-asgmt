import AppBar from "@mui/material/AppBar";
import { useLocation } from "react-router";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router";
import { APP_ROUTES } from "@/constants/appRoutes";

const pages = [
  { name: "Classes", href: APP_ROUTES.classes },
  { name: "Teachers", href: APP_ROUTES.teachers },
];

export default function Header() {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname.includes(href);
  };

  return (
    <AppBar position="static">
      <Container sx={{ height: "100%" }}>
        <Stack direction="row" sx={{ alignItems: "stretch", height: "100%" }}>
          <Link
            component={RouterLink}
            underline="none"
            to={APP_ROUTES.home}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              marginRight: { xs: "1rem", sm: "4.5rem" },
            }}
          >
            <SchoolOutlinedIcon color="primary" />{" "}
            <Typography variant="h3">School Portal</Typography>
          </Link>
          {pages.map((page) => (
            <Link
              component={RouterLink}
              to={page.href}
              underline="none"
              key={page.name}
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.875rem",
                padding: "1rem",
                borderBottom: "2px solid",
                borderColor: isActive(page.href)
                  ? "primary.main"
                  : "transparent",
              }}
            >
              {page.name}
            </Link>
          ))}
        </Stack>
      </Container>
    </AppBar>
  );
}
