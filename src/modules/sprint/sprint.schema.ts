import validator from 'validator';
import { z } from 'zod';

export const sprintInputSchema = z.object({
  name: z.string().min(1),
  project: z.string().refine((value) => validator.isMongoId(value)),
  startDate: z.date(),
  endDate: z.date(),
});

export const sprintQuerySchema = z.object({
  includeIssues: z.boolean().optional(),
});

export type SprintInput = z.infer<typeof sprintInputSchema>;
export type SprintOptions = z.infer<typeof sprintQuerySchema>;
