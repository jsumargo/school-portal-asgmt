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
import type { CreateTeacherRequest, SubjectData } from "@school-portal/shared";

interface TeacherFormProps {
  formValues: CreateTeacherRequest;
  errors: Partial<Record<keyof CreateTeacherRequest, string>>;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent,
  ) => void;
  subjectList: SubjectData[];
  isLoadingSubjectList: boolean;
}

export default function TeacherForm({
  formValues,
  errors,
  onChange,
  subjectList,
  isLoadingSubjectList,
}: TeacherFormProps) {
  return (
    <Paper sx={{ padding: "2rem" }}>
      <Stack spacing={2}>
        <div>
          <InputLabel id="name-label">Name</InputLabel>
          <TextField
            name="name"
            placeholder="Name"
            aria-labelledby="name-label"
            error={!!errors.name}
            helperText={errors.name}
            onChange={onChange}
            sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
          />
        </div>

        <div>
          <InputLabel id="subject-label">Subject</InputLabel>
          <FormControl error={!!errors.subject}>
            <Select
              name="subject"
              labelId="subject-label"
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
              value={formValues.subject}
              onChange={onChange}
              sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
            >
              {isLoadingSubjectList ? (
                <>
                  <Skeleton sx={{ margin: "0 1rem" }} />
                  <Skeleton sx={{ margin: "0 1rem" }} />
                  <Skeleton sx={{ margin: "0 1rem" }} />
                </>
              ) : (
                subjectList.map((subject) => (
                  <MenuItem key={subject.name} value={subject.name}>
                    {subject.name}
                  </MenuItem>
                ))
              )}
            </Select>
            <FormHelperText>{errors.subject}</FormHelperText>
          </FormControl>
        </div>

        <div>
          <InputLabel id="email-label">Email Address</InputLabel>
          <TextField
            name="email"
            placeholder="Email address"
            aria-labelledby="email-label"
            error={!!errors.email}
            helperText={errors.email}
            onChange={onChange}
            sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
          />
        </div>

        <div>
          <InputLabel id="contact-label">Work Contact Number</InputLabel>
          <TextField
            name="contactNumber"
            placeholder="Work contact number"
            aria-labelledby="contact-label"
            error={!!errors.contactNumber}
            helperText={errors.contactNumber}
            onChange={onChange}
            sx={{ minWidth: { xs: "100%", sm: "30rem" } }}
          />
        </div>
      </Stack>
    </Paper>
  );
}
