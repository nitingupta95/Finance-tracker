import { generateObject } from 'ai';
import { z } from 'zod';
import { getAiModel } from '@/lib/ai/server';
import { NextResponse } from 'next/server';

const cashflowSchema = z.object({
  projectedBalance: z.number().describe("The projected end-of-month balance based on current spending rate and total income/starting balance."),
  trend: z.enum(["positive", "negative", "neutral"]).describe("Whether the cash flow trend is positive, negative, or neutral."),
  suspectedSubscriptions: z.array(z.object({
    merchant: z.string(),
    amount: z.number(),
    frequency: z.string().describe("E.g., Monthly, Weekly, Yearly"),
    confidence: z.number().describe("1-10 scale of how confident this is a subscription")
  })).describe("A list of transactions that appear to be recurring subscriptions or hidden bank fees."),
  advice: z.string().describe("Advice based on the cash flow projection.")
});

export async function POST(req: Request) {
  try {
    const model = getAiModel(req);
    const body = await req.json();

    if (!body.transactions) {
      return NextResponse.json({ error: "Missing transactions array" }, { status: 400 });
    }

    const txList = body.transactions.slice(0, 100).map((t: any) => 
      `${t.date}: ${t.description} - $${t.amount} (${t.category})`
    ).join('\n');

    const { object } = await generateObject({
      model,
      schema: cashflowSchema,
      prompt: `Act as a financial analyst. Analyze these transactions. 1. Identify recurring subscriptions or fees. 2. Project the end-of-month cash flow based on the remaining days. Assume today is ${new Date().toISOString().split('T')[0]}.\nTransactions:\n${txList}`
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("AI Cashflow Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze cash flow." }, { status: 500 });
  }
}
