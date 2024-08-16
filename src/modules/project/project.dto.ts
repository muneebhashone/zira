import z from 'zod';
import { userSchema } from '../user/user.dto';

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  owner: userSchema,
  members: z.array(userSchema).optional(),
});

export type Project = z.infer<typeof projectSchema>;
