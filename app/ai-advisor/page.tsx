"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAiHeaders } from "@/lib/ai/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertTriangle, TrendingUp, PiggyBank, ReceiptText } from "lucide-react";

export default function AiAdvisorPage() {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // First get transactions
        const txRes = await axios.get("/api/transaction");
        const transactions = txRes.data;

        if (!transactions || transactions.length === 0) {
          setError("No transactions found to analyze.");
          setIsLoading(false);
          return;
        }

        // Send to AI endpoint
        const aiRes = await fetch("/api/ai/insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAiHeaders()
          },
          body: JSON.stringify({ transactions })
        });

        if (!aiRes.ok) {
           const errObj = await aiRes.json();
           throw new Error(errObj.error || "AI Insights failed! (Did you set up your API Key in Settings?)");
        }

        const data = await aiRes.json();
        setInsights(data);
      } catch (err: any) {
        setError(err.message || "Failed to generate AI insights.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="container mx-auto py-10 max-w-4xl mt-20 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-500" />
          AI Financial Advisor
        </h1>
        <p className="text-muted-foreground mt-2">
          Your personal AI-powered financial assistant analyzing your recent transactions.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200 shadow-sm text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="font-medium text-lg mb-2">{error}</p>
          <a href="/settings" className="text-sm underline text-red-500 hover:text-red-700">Check your API Key settings here</a>
        </div>
      ) : insights ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2 shadow-lg border-blue-100">
             <CardHeader className="bg-blue-50/50">
               <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
                  <ReceiptText className="w-5 h-5" /> Executive Summary
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-6">
               <p className="text-lg text-gray-700 leading-relaxed font-medium">{insights.summary}</p>
             </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-t-purple-500">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                   <TrendingUp className="w-5 h-5 text-purple-500" />
                   Top Spending Category
                </CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-2xl font-bold text-gray-800">{insights.topCategory}</p>
             </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-t-green-500">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                   <PiggyBank className="w-5 h-5 text-green-500" />
                   Savings Tip
                </CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-gray-700 font-medium">{insights.savingsTip}</p>
             </CardContent>
          </Card>

          {insights.warning && (
            <Card className="md:col-span-2 shadow-md border-orange-200 bg-orange-50">
               <CardContent className="pt-6">
                 <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-orange-800 mb-1">Budget Warning</h3>
                      <p className="text-orange-900 font-medium">{insights.warning}</p>
                    </div>
                 </div>
               </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
