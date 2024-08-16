import z from 'zod';
import { userSchema } from '../user/user.dto';

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  owner: userSchema.partial(),
  members: z.array(userSchema).optional(),
});

export type ProjectType = z.infer<typeof projectSchema>;
