import validator from 'validator';
import { z } from 'zod';

export const issueInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  project: z.string().refine((value) => validator.isMongoId(value)),
  assignee: z
    .string()
    .refine((value) => validator.isMongoId(value))
    .optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  comments: z
    .array(z.string().refine((value) => validator.isMongoId(value)))
    .optional(),
  labels: z
    .array(z.string().refine((value) => validator.isMongoId(value)))
    .optional(),
  sprint: z
    .string()
    .refine((value) => validator.isMongoId(value))
    .optional(),
});

export type IssueInput = z.infer<typeof issueInputSchema>;
