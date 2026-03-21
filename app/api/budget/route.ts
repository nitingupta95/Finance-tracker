// app/api/budget/route.ts

import { connectDB } from '@/lib/db';
import { Budget } from '@/lib/model/budget';
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { budgetSchema } from '@/lib/validations/budget';
import { handleApiError, ApiError, ErrorMessages } from '@/lib/apiError';

// GET budgets for logged-in user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new ApiError(401, ErrorMessages.UNAUTHORIZED);
    }

    await connectDB();

    const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(budgets, { status: 200 });

  } catch (error) {
    return handleApiError(error);
  }
}

// POST new budget
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new ApiError(401, ErrorMessages.UNAUTHORIZED);
    }

    await connectDB();

    const body = await req.json();

    // Validate input
    const validationResult = budgetSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ApiError(400, ErrorMessages.INVALID_INPUT, validationResult.error.issues);
    }

    const { category, amount, period, startDate, endDate } = validationResult.data;

    const newBudget = await Budget.create({
      category,
      amount,
      period,
      startDate,
      endDate: endDate || undefined,
      isActive: true,
      userId,
    });

    return NextResponse.json(newBudget, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
}
