import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { useGetClasses } from "@/hooks/useClasses";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";
import { APP_ROUTES } from "@/constants/appRoutes";
import type { ClassData } from "@school-portal/shared";

const tableHeaders = ["#", "Class Level", "Class Name", "Form Teacher"];

const ClassTable = ({ rows }: { rows: ClassData[] }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableCell key={header}>
                <strong>{header}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.level}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.formTeacher.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const EmptyState = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <Stack
      spacing={2}
      sx={{ alignItems: "center", justifyContent: "center", minHeight: "50vh" }}
    >
      <Typography variant="h3">There are no existing classes yet.</Typography>
      <AddClassButton onClick={onAdd} />
    </Stack>
  );
};

const AddClassButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="contained" onClick={onClick}>
      <AddIcon sx={{ marginRight: "0.5rem" }} /> Add Class
    </Button>
  );
};

export default function Classes() {
  const navigate = useNavigate();

  const { data: classData, isLoading } = useGetClasses();

  const handleAdd = () => {
    navigate(APP_ROUTES.addClass);
  };

  return (
    <Container>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          margin: "1.5rem 0",
        }}
      >
        <Typography variant="h2">Classes</Typography>
        {!!classData?.length && <AddClassButton onClick={handleAdd} />}
      </Stack>
      <Paper sx={{ padding: "2rem" }}>
        {isLoading ? (
          <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
            <CircularProgress aria-label="Loading…" />
          </Stack>
        ) : classData?.length ? (
          <ClassTable rows={classData} />
        ) : (
          <EmptyState onAdd={handleAdd} />
        )}
      </Paper>
    </Container>
  );
}
