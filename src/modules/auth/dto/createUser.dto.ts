import { AuthProvider, Gender } from "src/common/enums/user.enum";
import { EmailEvent } from "src/common/utils/email/emailSubjectEnum";
import { z } from "zod";
export const signUpSchema = z
  .object({
    firstName: z.string().min(2).max(30),
    lastName: z.string().min(2).max(30),

    email: z.email(),

    phone: z.string().regex(/^[0-9]{10,15}$/),

    gender: z.enum(Gender),

    age: z.number().min(13).max(100).optional(),

    avatar: z.string().optional(),

    password: z.string().min(8),
    confirmPassword: z.string().min(8),

    provider: z.enum(AuthProvider).default(AuthProvider.SYSTEM).optional(),

    providerId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const confirmEmailSchema = z.object({
  email: z.email(),
  otp: z.any(),
});
// .refine((data) => !data.email || !data.otp, {
//   message: "Please enter your data",
//   path: ["email", "otp"],
// });

export const resetOtpSchema = z.object({
  email: z.email(),
  type: z.enum(EmailEvent),
});
// .refine((data) => !data.email, {
//   message: "Please enter your email",
//   path: ["email"],
// });
export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
export type ISignUpDTO = z.infer<typeof signUpSchema>;
export type IConfirmEmailDTO = z.infer<typeof confirmEmailSchema>;
export type IResetOtpDTO = z.infer<typeof resetOtpSchema>;
export type ILoginDTO = z.infer<typeof loginSchema>;
