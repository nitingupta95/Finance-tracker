import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters')
    .trim(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  category: z.string().optional(),
});

export const transactionUpdateSchema = transactionSchema.partial();

export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>;
