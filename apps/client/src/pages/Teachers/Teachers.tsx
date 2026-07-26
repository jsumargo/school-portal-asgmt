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
import { useGetTeachers } from "@/hooks/useTeachers";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";
import { APP_ROUTES } from "@/constants/appRoutes";
import type { TeacherData } from "@school-portal/shared";

const tableHeaders = ["#", "Name", "Subject", "Email", "Work Contact"];

const TeacherTable = ({ rows }: { rows: TeacherData[] }) => {
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
            <TableRow key={row.email}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.subject}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.contactNumber}</TableCell>
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
      <Typography variant="h3">There are no existing teachers yet.</Typography>
      <AddTeacherButton onClick={onAdd} />
    </Stack>
  );
};

const AddTeacherButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="contained" onClick={onClick}>
      <AddIcon sx={{ marginRight: "0.5rem" }} /> Add Teacher
    </Button>
  );
};

export default function Teachers() {
  const navigate = useNavigate();

  const { data: teacherData, isLoading } = useGetTeachers();

  const handleAdd = () => {
    navigate(APP_ROUTES.addTeacher);
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
        <Typography variant="h2">Teachers</Typography>
        {!!teacherData?.length && <AddTeacherButton onClick={handleAdd} />}
      </Stack>
      <Paper sx={{ padding: "2rem" }}>
        {isLoading ? (
          <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
            <CircularProgress aria-label="Loading…" />
          </Stack>
        ) : teacherData?.length ? (
          <TeacherTable rows={teacherData} />
        ) : (
          <EmptyState onAdd={handleAdd} />
        )}
      </Paper>
    </Container>
  );
}
