import { connectDB } from '@/lib/db';
import { Transaction } from '@/lib/model/transaction';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { transactionSchema } from '@/lib/validations/transaction';
import { handleApiError, ApiError, ErrorMessages } from '@/lib/apiError';

// GET /api/transaction
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new ApiError(401, ErrorMessages.UNAUTHORIZED);
    }

    await connectDB();
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/transaction
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new ApiError(401, ErrorMessages.UNAUTHORIZED);
    }

    await connectDB();
    const body = await req.json();

    // Validate input
    const validationResult = transactionSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ApiError(400, ErrorMessages.INVALID_INPUT, validationResult.error.issues);
    }

    const { amount, description, date, category } = validationResult.data;

    // Save the transaction
    const transaction = await Transaction.create({
      amount,
      description,
      date,
      category,
      userId,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}