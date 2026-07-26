import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router";
import type {
  CreateClassRequest,
  LevelData,
  TeacherData,
} from "@school-portal/shared";

interface ClassFormProps {
  formValues: CreateClassRequest;
  errors: Partial<Record<keyof CreateClassRequest, string>>;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent,
  ) => void;
  teacherList: TeacherData[];
  isLoadingTeacherList: boolean;
  levelList: LevelData[];
  isLoadingLevelList: boolean;
}

export default function ClassForm({
  formValues,
  errors,
  onChange,
  teacherList,
  isLoadingTeacherList,
  levelList,
  isLoadingLevelList,
}: ClassFormProps) {
  return (
    <Paper sx={{ padding: "2rem" }}>
      <Stack spacing={2}>
        <div>
          <InputLabel id="level-label">Class Level</InputLabel>
          <FormControl error={!!errors.level}>
            <Select
              name="level"
              aria-labelledby="level-label"
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
              value={formValues.level}
              onChange={onChange}
              sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
            >
              {isLoadingLevelList ? (
                <>
                  <Skeleton sx={{ margin: "0 1rem" }} />
                  <Skeleton sx={{ margin: "0 1rem" }} />
                  <Skeleton sx={{ margin: "0 1rem" }} />
                </>
              ) : (
                levelList.map((level) => (
                  <MenuItem key={level.name} value={level.name}>
                    {level.name}
                  </MenuItem>
                ))
              )}
            </Select>
            <FormHelperText>{errors.level}</FormHelperText>
          </FormControl>
        </div>

        <div>
          <InputLabel id="name-label">Class Name</InputLabel>
          <TextField
            name="name"
            aria-labelledby="name-label"
            placeholder="Class Name"
            error={!!errors.name}
            helperText={errors.name}
            onChange={onChange}
            sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
          />
        </div>

        <div>
          <InputLabel id="teacher-label">Form Teacher</InputLabel>
          <FormControl error={!!errors.teacherEmail}>
            <Select
              name="teacherEmail"
              aria-labelledby="teacher-label"
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
                  (teacher) => teacher.email === value,
                );
                return selectedTeacher?.name;
              }}
              value={formValues.teacherEmail}
              onChange={onChange}
              sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
            >
              {isLoadingTeacherList ? (
                <>
                  <Skeleton sx={{ margin: "0 1rem" }} />
                  <Skeleton sx={{ margin: "0 1rem" }} />
                  <Skeleton sx={{ margin: "0 1rem" }} />
                </>
              ) : teacherList?.length ? (
                teacherList.map((teacher) => (
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
            <FormHelperText>{errors.teacherEmail}</FormHelperText>
          </FormControl>
        </div>
      </Stack>
    </Paper>
  );
}
