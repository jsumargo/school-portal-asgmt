import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "@mui/material/Link";
import { Link as RouterLink, useNavigate } from "react-router";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCreateClass } from "@/hooks/useClasses";
import { useGetTeachers } from "@/hooks/useTeachers";
import {
  CreateClassSchema,
  type CreateClassRequest,
  type LevelData,
  type TeacherData,
} from "@school-portal/shared";
import { useGetLevels } from "@/hooks/useLevels";
import { APP_ROUTES } from "@/constants/appRoutes";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";

export default function AddClass() {
  const navigate = useNavigate();
  const createClass = useCreateClass();
  const { data: teacherList, isLoading: isLoadingTeacherList } =
    useGetTeachers();
  const { data: levelList, isLoading: isLoadingLevelList } = useGetLevels();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateClassRequest>({
    resolver: zodResolver(CreateClassSchema),
    defaultValues: {
      level: "",
      name: "",
      teacherEmail: "",
    },
  });

  const onSubmit = (data: CreateClassRequest) => {
    createClass.mutate(data, {
      onSuccess: () => navigate(APP_ROUTES.classes),
    });
  };

  return (
    <Container>
      <Typography variant="h2" sx={{ margin: "1.5rem 0" }}>
        Add Class
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ padding: "2rem" }}>
          <Stack spacing={2}>
            <Box>
              <InputLabel id="level-select">Class Level</InputLabel>
              <Controller
                name="level"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl
                    error={!!fieldState.error}
                    sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
                  >
                    <Select
                      id="level-select"
                      {...field}
                      displayEmpty
                      renderValue={(value: string) => {
                        if (!value) {
                          return (
                            <Typography sx={{ color: "#9B9B9B" }}>
                              Select a level
                            </Typography>
                          );
                        }
                        return value;
                      }}
                    >
                      {isLoadingLevelList ? (
                        <>
                          <Skeleton sx={{ margin: "0 1rem" }} />
                          <Skeleton sx={{ margin: "0 1rem" }} />
                          <Skeleton sx={{ margin: "0 1rem" }} />
                        </>
                      ) : (
                        levelList?.map((level: LevelData) => (
                          <MenuItem key={level.name} value={level.name}>
                            {level.name}
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
              <InputLabel htmlFor="name-input">Class Name</InputLabel>
              <TextField
                id="name-input"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder="Class Name"
                sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
              />
            </Box>

            <Box>
              <InputLabel htmlFor="teacher-select">Form Teacher</InputLabel>
              <Controller
                name="teacherEmail"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl
                    error={!!fieldState.error}
                    sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
                  >
                    <Select
                      id="teacher-select"
                      {...field}
                      displayEmpty
                      renderValue={(value: string) => {
                        if (!value) {
                          return (
                            <Typography sx={{ color: "#9B9B9B" }}>
                              Assign a form teacher
                            </Typography>
                          );
                        }
                        const selectedTeacher = teacherList?.find(
                          (teacher: TeacherData) => teacher.email === value,
                        );
                        return selectedTeacher?.name;
                      }}
                    >
                      {isLoadingTeacherList ? (
                        <>
                          <Skeleton sx={{ margin: "0 1rem" }} />
                          <Skeleton sx={{ margin: "0 1rem" }} />
                          <Skeleton sx={{ margin: "0 1rem" }} />
                        </>
                      ) : teacherList?.length ? (
                        teacherList.map((teacher: TeacherData) => (
                          <MenuItem key={teacher.email} value={teacher.email}>
                            {teacher.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" sx={{ display: "block" }}>
                          <p>No existing teachers</p>
                          <Link component={RouterLink} to="/teachers/add">
                            Add a teacher
                          </Link>
                        </MenuItem>
                      )}
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
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
