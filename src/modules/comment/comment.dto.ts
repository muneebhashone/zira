import z from 'zod';
import { userSchema } from '../user/user.dto';
import { issueSchema } from '../issue/issue.dto';

export const commentSchema = z.object({
  content: z.string(),
  author: userSchema,
  issue: issueSchema,
});

export type Comment = z.infer<typeof commentSchema>;
