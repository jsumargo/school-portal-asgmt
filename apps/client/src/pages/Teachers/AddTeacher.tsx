import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { useCreateTeacher } from "@/hooks/useTeachers";
import TeacherForm from "./TeacherForm";
import {
  CreateTeacherSchema,
  type CreateTeacherRequest,
} from "@school-portal/shared";
import { useGetSubjects } from "@/hooks/useSubjects";
import { APP_ROUTES } from "@/constants/appRoutes";

export default function AddTeacher() {
  const navigate = useNavigate();
  const createTeacher = useCreateTeacher();
  const { data: subjectList, isLoading } = useGetSubjects();

  const [formValues, setFormValues] = useState<CreateTeacherRequest>({
    name: "",
    subject: "",
    email: "",
    contactNumber: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTeacherRequest, string>>
  >({});

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof CreateTeacherRequest];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = CreateTeacherSchema.safeParse(formValues);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    createTeacher.mutate(formValues, {
      onSuccess: () => navigate(APP_ROUTES.teachers),
    });
  };

  return (
    <Container>
      <Typography variant="h2" sx={{ margin: "1.5rem 0" }}>
        Add Teacher
      </Typography>

      <form onSubmit={handleSubmit}>
        <TeacherForm
          formValues={formValues}
          errors={errors}
          onChange={handleChange}
          subjectList={subjectList}
          isLoadingSubjectList={isLoading}
        />

        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "flex-end", marginTop: "1.5rem" }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              navigate(APP_ROUTES.teachers);
            }}
          >
            <ArrowBackIcon sx={{ marginRight: "0.5rem" }} />
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createTeacher.isPending}
          >
            Add Teacher
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
