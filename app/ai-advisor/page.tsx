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
    <div className="min-h-screen bg-slate-950 p-6 pt-24 selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                AI <span className="text-blue-400">Advisor</span>
              </h1>
            </div>
            <p className="text-slate-400 font-medium max-w-lg">
              Unlock autonomous insights processed by your configured Intelligence Core.
            </p>
          </div>
          
          <div className="hidden md:block">
             <div className="glass-card px-4 py-2 border-l-2 border-l-blue-500">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-xs font-bold text-white uppercase tracking-tight">Active Analysis</span>
                </div>
             </div>
          </div>
        </div>

        {isLoading ? (
          <div className="glass-card py-32 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <p className="text-white font-black uppercase tracking-widest text-sm">Synthesizing Data</p>
              <p className="text-slate-500 text-xs mt-1 font-medium">Decoding transaction patterns into actionable logic...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card p-12 border-l-4 border-l-rose-500 text-center">
            <div className="bg-rose-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Analysis Interrupted</h3>
            <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">{error}</p>
            <a 
              href="/settings" 
              className="px-8 py-3 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Verify System Keys
            </a>
          </div>
        ) : insights ? (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Executive Summary */}
            <div className="md:col-span-2 glass-card p-0 overflow-hidden">
               <div className="bg-white/5 px-8 py-5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ReceiptText className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">Executive Intelligence Summary</h3>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-blue-500/30 rounded-full"></div>)}
                  </div>
               </div>
               <div className="p-10">
                 <p className="text-xl text-slate-200 leading-relaxed font-medium italic">
                   "{insights.summary}"
                 </p>
               </div>
            </div>

            {/* Metrics */}
            <div className="glass-card p-8 border-l-4 border-l-purple-500 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Primary Cost Center</h3>
              </div>
              <p className="text-3xl font-black text-white tracking-tighter">{insights.topCategory}</p>
              <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                IDENTIFIED BY PATTERN RECOGNITION
              </div>
            </div>

            <div className="glass-card p-8 border-l-4 border-l-emerald-500 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <PiggyBank className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Optimization Strategy</h3>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed">{insights.savingsTip}</p>
              <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-emerald-500 uppercase tracking-tight">
                EFFICIENCY PROTOCOL RECOMMENDED
              </div>
            </div>

            {insights.warning && (
              <div className="md:col-span-2 glass-card p-8 bg-amber-500/5 border-l-4 border-l-amber-500 relative overflow-hidden">
                 <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
                 <div className="flex items-start gap-6 relative z-10">
                    <div className="bg-amber-500/20 p-4 rounded-2xl border border-amber-500/20">
                      <AlertTriangle className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                        Threshold Violation Alert
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                      </h3>
                      <p className="text-amber-200/80 font-semibold text-lg max-w-2xl leading-snug">{insights.warning}</p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Footer info */}
        <div className="text-center pt-10">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
            Analysis performed locally using your encrypted API bridge
          </p>
        </div>
      </div>
    </div>
  );
}
