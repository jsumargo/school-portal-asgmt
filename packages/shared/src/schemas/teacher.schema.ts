import { z } from "zod";

const phoneRegex = /^[\d\s\-+()]{8,20}$/;

export const CreateTeacherSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  email: z
    .email("This email address is invalid")
    .trim()
    .toLowerCase()
    .min(1, "Email is required"),
  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact number is required")
    .regex(phoneRegex, "This contact number is invalid"),
});

export type CreateTeacherRequest = z.infer<typeof CreateTeacherSchema>;

