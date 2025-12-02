import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .min(5, { message: 'Username must be at least 5 characters' })
    .max(20, { message: 'Username must be less than 20 characters' }),
  password: z.string()
    .min(5, { message: 'Password must be at least 5 characters' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
