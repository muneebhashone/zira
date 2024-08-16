import z from 'zod';

export const sprintSchema = z.object({
  id: z.string(),
  startDate: z.string().date(),
  endDate: z.string().date(),
});

export type Sprint = z.infer<typeof sprintSchema>;
