import { z } from "zod";

export const CreateClassSchema = z.object({
  level: z.string().trim().min(1, "Level is required"),
  name: z.string().trim().min(1, "Name is required"),
  teacherEmail: z.string().trim().min(1, "Form teacher is required"),
});

export type CreateClassRequest = z.infer<typeof CreateClassSchema>;
