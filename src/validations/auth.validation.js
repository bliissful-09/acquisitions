import {z} from 'zod';

export const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().max(255).toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters long').max(100),
    role: z.enum(['user', 'admin']).default('user'),
});  

export const signinSchema = z.object({
    email: z.string().max(255).toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters long').max(100),
});