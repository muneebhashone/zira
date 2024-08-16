import validator from 'validator';
import { z } from 'zod';

// Zod Schema
export const commentSchema = z.object({
  content: z.string().min(1),
  author: z.string().refine((value) => validator.isMongoId(value)),
  issue: z.string().refine((value) => validator.isMongoId(value)),
});

// Inferred Type
export type CommentInput = z.infer<typeof commentSchema>;
