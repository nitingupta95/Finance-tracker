import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  date: string;
  category?: string;
  userId: string; // Clerk user ID
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String },
    userId: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for better query performance
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, category: 1 });
TransactionSchema.index({ userId: 1, date: 1 });

export const Transaction =
  models.Transaction || model<ITransaction>('Transaction', TransactionSchema);
