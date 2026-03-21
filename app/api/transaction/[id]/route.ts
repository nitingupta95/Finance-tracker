import { connectDB } from '@/lib/db';
import { Transaction } from "@/lib/model/transaction";
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { auth } from '@clerk/nextjs/server';
import { transactionUpdateSchema } from '@/lib/validations/transaction';
import { handleApiError, ApiError, ErrorMessages } from '@/lib/apiError';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new ApiError(401, ErrorMessages.UNAUTHORIZED);
    }

    await connectDB();
    const id = (await params).id;

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid transaction ID');
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      throw new ApiError(404, ErrorMessages.NOT_FOUND);
    }

    if (transaction.userId !== userId) {
      throw new ApiError(403, ErrorMessages.FORBIDDEN);
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new ApiError(401, ErrorMessages.UNAUTHORIZED);
    }

    await connectDB();
    const id = (await params).id;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid transaction ID');
    }

    // Validate input
    const validationResult = transactionUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ApiError(400, ErrorMessages.INVALID_INPUT, validationResult.error.issues);
    }

    // Check if transaction exists and belongs to user
    const existingTransaction = await Transaction.findById(id);

    if (!existingTransaction) {
      throw new ApiError(404, ErrorMessages.NOT_FOUND);
    }

    if (existingTransaction.userId !== userId) {
      throw new ApiError(403, ErrorMessages.FORBIDDEN);
    }

    const updated = await Transaction.findByIdAndUpdate(
      id,
      { ...validationResult.data, userId },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new ApiError(401, ErrorMessages.UNAUTHORIZED);
    }

    await connectDB();
    const id = (await params).id;

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid transaction ID');
    }

    // Check if transaction exists and belongs to user
    const existingTransaction = await Transaction.findById(id);

    if (!existingTransaction) {
      throw new ApiError(404, ErrorMessages.NOT_FOUND);
    }

    if (existingTransaction.userId !== userId) {
      throw new ApiError(403, ErrorMessages.FORBIDDEN);
    }

    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
