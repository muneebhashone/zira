import { z } from 'zod';
import { projectSchema } from '../project/project.dto';
import { sprintSchema } from '../sprint/sprint.dto';
import { userSchema } from '../user/user.dto';
import { labelSchema } from '../label/label.schema';
import { commentSchema } from '../comment/comment.schema';

export const issueSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  project: projectSchema.partial(),
  assignee: userSchema.partial(),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  comments: z.array(commentSchema).optional(),
  labels: z.array(labelSchema).optional(),
  sprint: sprintSchema,
});

export type Issue = z.infer<typeof issueSchema>;
