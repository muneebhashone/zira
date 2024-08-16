import validator from 'validator';
import { z } from 'zod';
import { sprintQuerySchema } from '../sprint/sprint.schema';

export const projectInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  owner: z.string().refine((value) => validator.isMongoId(value)),
  members: z
    .array(z.string().refine((value) => validator.isMongoId(value)))
    .optional(),
});

export const projectQuerySchema = z
  .object({
    includeSprints: z.boolean().optional(),
  })
  .merge(sprintQuerySchema);

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectOptions = z.infer<typeof projectQuerySchema>;
