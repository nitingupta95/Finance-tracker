import { generateObject } from 'ai';
import { z } from 'zod';
import { getAiModel } from '@/lib/ai/server';
import { NextResponse } from 'next/server';

const insightsSchema = z.object({
  summary: z.string().describe("A concise 2-sentence summary of the user's spending habits."),
  topCategory: z.string().describe("The category where the user spent the most money."),
  savingsTip: z.string().describe("A personalized, actionable tip on how to save money based on these transactions."),
  warning: z.string().describe("A gentle warning if the user seems to be overspending on a specific category. Return an empty string if no warning is needed.")
});

export async function POST(req: Request) {
  try {
    const model = getAiModel(req);
    const body = await req.json();

    if (!body.transactions || !Array.isArray(body.transactions)) {
      return NextResponse.json({ error: "Missing or invalid transactions array" }, { status: 400 });
    }

    // Pass the transactions as an abbreviated list to save tokens
    const txList = body.transactions.slice(0, 50).map((t: any) => 
      `${t.date}: ${t.description} - $${t.amount} (${t.category})`
    ).join('\n');

    const { object } = await generateObject({
      model,
      schema: insightsSchema,
      prompt: `Analyze the following recent transactions and provide a financial summary, the top spending category, a savings tip, and an optional budget warning. Transactions:\n${txList}`
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("AI Insights Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate insights." }, { status: 500 });
  }
}
