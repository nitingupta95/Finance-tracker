import { generateObject } from 'ai';
import { z } from 'zod';
import { getAiModel } from '@/lib/ai/server';
import { NextResponse } from 'next/server';

const categorizeSchema = z.object({
  category: z.string().describe("The best matching category from this list: Food & Dining, Shopping, Housing, Transportation, Vehicle, Utilities, Communication, Financial Expenses, Investments, Income, Others. If unsure, choose Others.")
});

export async function POST(req: Request) {
  try {
    const model = getAiModel(req);
    const body = await req.json();

    if (!body.merchant) {
      return NextResponse.json({ error: "Missing merchant name" }, { status: 400 });
    }

    const { object } = await generateObject({
      model,
      schema: categorizeSchema,
      prompt: `Categorize this transaction merchant/description: "${body.merchant}". Choose the best category based on standard personal finance categories.`
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("AI Categorize Error:", error);
    return NextResponse.json({ error: error.message || "Failed to categorize data with AI." }, { status: 500 });
  }
}
