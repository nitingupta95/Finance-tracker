"use client";

import React, { useEffect, useState } from "react";
import { getAiHeaders } from "@/lib/ai/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Loader2, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import { TransactionFormData } from "@/types/transaction";

export function AiCashflow({ transactions }: { transactions: TransactionFormData[] }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/ai/cashflow", {
          method: "POST",
          headers: {
             "Content-Type": "application/json",
             ...getAiHeaders()
          },
          body: JSON.stringify({ transactions })
        });
        
        if (!res.ok) {
           const errObj = await res.json();
           throw new Error(errObj.error || "Failed to load.");
        }
        
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "AI Analysis failed.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [transactions]);

  if (transactions.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Cash Flow Projection */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            AI Cash Flow Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin"/> Analyzing...</div>
           ) : error ? (
             <div className="text-red-500 text-sm">{error}</div>
           ) : data ? (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <p className="text-sm font-medium text-gray-600">Projected EOM Balance</p>
                   <div className={`flex items-center gap-1 font-bold text-xl ${data.trend === 'positive' ? 'text-green-600' : data.trend === 'negative' ? 'text-red-600' : 'text-gray-700'}`}>
                      {data.trend === 'positive' ? <ArrowUpRight className="w-5 h-5"/> : data.trend === 'negative' ? <ArrowDownRight className="w-5 h-5"/> : null}
                      ₹{data.projectedBalance.toFixed(2)}
                   </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 font-medium">
                  {data.advice}
                </div>
             </div>
           ) : null}
        </CardContent>
      </Card>

      {/* Subscription Alerts */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-500" />
            Subscription & Fee Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin"/> Scanning...</div>
           ) : error ? (
             <div className="text-red-500 text-sm">{error}</div>
           ) : data && data.suspectedSubscriptions ? (
             <div className="space-y-3">
                {data.suspectedSubscriptions.length > 0 ? (
                  data.suspectedSubscriptions.map((sub: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border">
                       <div className="flex items-center gap-3">
                         <div className="bg-purple-100 p-2 rounded-md"><AlertTriangle className="w-4 h-4 text-purple-600" /></div>
                         <div>
                           <p className="font-semibold text-sm">{sub.merchant}</p>
                           <p className="text-xs text-gray-500">{sub.frequency} (Confidence: {sub.confidence}/10)</p>
                         </div>
                       </div>
                       <div className="font-bold text-gray-700">₹{sub.amount.toFixed(2)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-green-600 font-medium my-2">✅ No recurring subscriptions or hidden fees detected!</p>
                )}
             </div>
           ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
