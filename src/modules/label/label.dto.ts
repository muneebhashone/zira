import z from 'zod';

export const labelSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export type LabelType = z.infer<typeof labelSchema>;
