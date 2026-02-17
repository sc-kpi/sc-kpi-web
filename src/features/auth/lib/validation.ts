import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string().min(8, { error: "Password must be at least 8 characters" }),
  firstName: z.string().min(1, { error: "First name is required" }),
  lastName: z.string().min(1, { error: "Last name is required" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, { error: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const totpCodeSchema = z.object({
  code: z
    .string()
    .min(6, { error: "Code must be at least 6 characters" })
    .max(10, { error: "Code must be at most 10 characters" }),
});

export type TotpCodeFormData = z.infer<typeof totpCodeSchema>;

export const totpDisableSchema = z.object({
  password: z.string().min(1, { error: "Password is required" }),
  code: z
    .string()
    .min(6, { error: "Code must be at least 6 characters" })
    .max(10, { error: "Code must be at most 10 characters" }),
});

export type TotpDisableFormData = z.infer<typeof totpDisableSchema>;
