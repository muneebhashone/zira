import { z } from 'zod';

export const labelSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
});

export type LabelInput = z.infer<typeof labelSchema>;
