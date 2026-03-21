import { z } from 'zod';

const budgetBaseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  period: z.enum(['weekly', 'monthly', 'yearly'], {
    message: 'Period must be weekly, monthly, or yearly',
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
});

export const budgetSchema = budgetBaseSchema.refine(
  (data) => {
    if (data.endDate && data.endDate !== '') {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const budgetUpdateSchema = budgetBaseSchema.partial();

export type BudgetInput = z.infer<typeof budgetSchema>;
export type BudgetUpdateInput = z.infer<typeof budgetUpdateSchema>;
