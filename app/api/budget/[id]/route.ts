import { connectDB } from '@/lib/db';
import { Budget } from '@/lib/model/budget';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { budgetUpdateSchema } from '@/lib/validations/budget';
import { handleApiError, ApiError, ErrorMessages } from '@/lib/apiError';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new ApiError(401, ErrorMessages.UNAUTHORIZED);
    }

    await connectDB();

    const id = (await params).id;
    const body = await req.json();

    // Validate input
    const validationResult = budgetUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ApiError(400, ErrorMessages.INVALID_INPUT, validationResult.error.issues);
    }

    // Check if budget exists and belongs to user
    const existingBudget = await Budget.findById(id);

    if (!existingBudget) {
      throw new ApiError(404, ErrorMessages.NOT_FOUND);
    }

    if (existingBudget.userId !== userId) {
      throw new ApiError(403, ErrorMessages.FORBIDDEN);
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { ...validationResult.data, updatedAt: new Date(), userId },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedBudget, { status: 200 });
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

    // Check if budget exists and belongs to user
    const existingBudget = await Budget.findById(id);

    if (!existingBudget) {
      throw new ApiError(404, ErrorMessages.NOT_FOUND);
    }

    if (existingBudget.userId !== userId) {
      throw new ApiError(403, ErrorMessages.FORBIDDEN);
    }

    await Budget.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Budget deleted successfully' }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
