import z from 'zod';
import { projectSchema } from '../project/project.dto';
import { issueSchema } from '../issue/issue.dto';

export const sprintSchema = z.object({
  id: z.string(),
  startDate: z.string().date(),
  project: projectSchema.partial(),
  issues: z.array(issueSchema.partial()).optional(),
  endDate: z.string().date(),
});

export type SprintType = z.infer<typeof sprintSchema>;
