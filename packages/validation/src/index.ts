import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(120),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
