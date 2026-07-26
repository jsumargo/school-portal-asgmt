export interface FormTeacherSummary {
  name: string;
}

export interface ClassData {
  level: string;
  name: string;
  formTeacher: FormTeacherSummary;
}
