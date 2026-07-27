import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import { useCreateTeacher } from "@/hooks/useTeachers";
import {
  CreateTeacherSchema,
  type CreateTeacherRequest,
  type SubjectData,
} from "@school-portal/shared";
import { useGetSubjects } from "@/hooks/useSubjects";
import { APP_ROUTES } from "@/constants/appRoutes";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function AddTeacher() {
  const navigate = useNavigate();
  const createTeacher = useCreateTeacher();
  const { data: subjectList, isLoading: isLoadingSubjectList } =
    useGetSubjects();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTeacherRequest>({
    resolver: zodResolver(CreateTeacherSchema),
    defaultValues: {
      name: "",
      subject: "",
      email: "",
      contactNumber: "",
    },
  });

  const onSubmit = (data: CreateTeacherRequest) => {
    createTeacher.mutate(data, {
      onSuccess: () => navigate(APP_ROUTES.teachers),
    });
  };

  return (
    <Container>
      <Typography variant="h2" sx={{ margin: "1.5rem 0" }}>
        Add Teacher
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ padding: "2rem" }}>
          <Stack spacing={2}>
            <Box>
              <InputLabel htmlFor="name-input">Name</InputLabel>
              <TextField
                id="name-input"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder="Name"
                sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
              />
            </Box>

            <Box>
              <InputLabel htmlFor="subject-select">Subject</InputLabel>
              <Controller
                name="subject"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl
                    error={!!fieldState.error}
                    sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
                  >
                    <Select
                      id="subject-select"
                      {...field}
                      displayEmpty
                      renderValue={(value: string) => {
                        if (!value) {
                          return (
                            <Typography color="textDisabled">
                              Select a subject
                            </Typography>
                          );
                        }
                        return value;
                      }}
                    >
                      {isLoadingSubjectList ? (
                        <>
                          <Skeleton sx={{ margin: "0 1rem" }} />
                          <Skeleton sx={{ margin: "0 1rem" }} />
                          <Skeleton sx={{ margin: "0 1rem" }} />
                        </>
                      ) : (
                        subjectList?.map((subject: SubjectData) => (
                          <MenuItem key={subject.name} value={subject.name}>
                            {subject.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Box>

            <Box>
              <InputLabel htmlFor="email-input">Email Address</InputLabel>
              <TextField
                id="email-input"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="Email address"
                sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
              />
            </Box>

            <Box>
              <InputLabel htmlFor="contact-input">Work Contact Number</InputLabel>
              <TextField
              id="contact-input"
                {...register("contactNumber")}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber?.message}
                placeholder="Work contact number"

                sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
              />
            </Box>
          </Stack>
        </Paper>

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
