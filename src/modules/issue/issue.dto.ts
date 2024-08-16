import { z } from 'zod';
import { commentSchema } from '../comment/comment.schema';
import { labelSchema } from '../label/label.schema';
import { userSchema } from '../user/user.dto';

export const issueSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string(),
  assignee: userSchema.partial(),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  comments: z.array(commentSchema).optional(),
  labels: z.array(labelSchema).optional(),
  sprintId: z.string().optional(),
});

export type IssueType = z.infer<typeof issueSchema>;
