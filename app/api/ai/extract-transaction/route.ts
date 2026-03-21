import { generateObject } from 'ai';
import { z } from 'zod';
import { getAiModel } from '@/lib/ai/server';
import { NextResponse } from 'next/server';

const extractionSchema = z.object({
  amount: z.number().describe("The total amount of the transaction. Must be a positive number."),
  merchant: z.string().describe("The name of the merchant or store. For example, 'Starbucks' or 'Target'."),
  date: z.string().describe("The date of the transaction in YYYY-MM-DD format. If yesterday, compute it relative to today."),
  category: z.string().describe("A general category for this transaction (e.g. 'Food & Dining', 'Groceries', 'Transport', 'Entertainment', 'Shopping').")
});

export async function POST(req: Request) {
  try {
    const model = getAiModel(req);
    const body = await req.json();

    let messages: any[] = [];
    
    if (body.text) {
      messages = [
        { role: 'user', content: `Extract transaction details from this text: "${body.text}". Today is ${new Date().toISOString().split('T')[0]}.` }
      ];
    } else if (body.image) {
      messages = [
        { 
          role: 'user', 
          content: [
            { type: 'text', text: 'Extract the transaction total amount, merchant name, date, and guess the category from this receipt image.' },
            { type: 'image', image: Buffer.from(body.image, "base64") }
          ]
        }
      ];
    } else {
      return NextResponse.json({ error: "Missing text or image payload" }, { status: 400 });
    }

    const { object } = await generateObject({
      model,
      schema: extractionSchema,
      messages,
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("AI Extraction Error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse data with AI." }, { status: 500 });
  }
}
