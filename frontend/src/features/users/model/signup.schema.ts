import { z } from 'zod';

export const userSignupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
});

export type UserSignupFormData = z.infer<typeof userSignupSchema>;
