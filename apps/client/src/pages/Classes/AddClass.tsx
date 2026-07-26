import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { type SelectChangeEvent } from "@mui/material/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useCreateClass } from "@/hooks/useClasses";
import ClassForm from "./ClassForm";
import { useGetTeachers } from "@/hooks/useTeachers";
import {
  CreateClassSchema,
  type CreateClassRequest,
} from "@school-portal/shared";
import { useGetLevels } from "@/hooks/useLevels";
import { APP_ROUTES } from "@/constants/appRoutes";

export default function AddClass() {
  const navigate = useNavigate();
  const createClass = useCreateClass();
  const { data: teacherList, isLoading: isLoadingTeacherList } =
    useGetTeachers();
  const { data: levelList, isLoading: isLoadingLevelList } = useGetLevels();

  const [formValues, setFormValues] = useState<CreateClassRequest>({
    level: "",
    name: "",
    teacherEmail: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateClassRequest, string>>
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
      delete next[name as keyof CreateClassRequest];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = CreateClassSchema.safeParse(formValues);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    createClass.mutate(formValues, {
      onSuccess: () => navigate(APP_ROUTES.classes),
    });
  };

  return (
    <Container>
      <Typography variant="h2" sx={{ margin: "1.5rem 0" }}>
        Add Class
      </Typography>

      <form onSubmit={handleSubmit}>
        <ClassForm
          formValues={formValues}
          errors={errors}
          onChange={handleChange}
          teacherList={teacherList}
          isLoadingTeacherList={isLoadingTeacherList}
          levelList={levelList}
          isLoadingLevelList={isLoadingLevelList}
        />

        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "flex-end", marginTop: "1.5rem" }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              navigate(APP_ROUTES.classes);
            }}
          >
            <ArrowBackIcon sx={{ marginRight: "0.5rem" }} />
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createClass.isPending}
          >
            Add Class
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
