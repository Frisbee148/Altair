import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(120),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric or underscore"),
  password: z.string().min(8).max(128),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
