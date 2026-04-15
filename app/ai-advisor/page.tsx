"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAiHeaders } from "@/lib/ai/client";
import { Sparkles, AlertTriangle, TrendingUp, PiggyBank, ReceiptText, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AiAdvisorPage() {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const txRes = await axios.get("/api/transaction");
        const transactions = txRes.data;

        if (!transactions || transactions.length === 0) {
          setError("No transactional data available for analysis.");
          setIsLoading(false);
          return;
        }

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
           throw new Error(errObj.error || "Intelligence Core offline. Verify encryption keys.");
        }

        const data = await aiRes.json();
        setInsights(data);
      } catch (err: any) {
        setError(err.message || "Failed to initialize intelligence protocol.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight leading-none">Intelligence Core</h2>
          <p className="text-slate-500 text-[10px] font-bold mt-2">Autonomous Financial Pattern Analysis</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="fintech-card px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="text-right">
                 <div className="text-[9px] text-slate-500 font-bold leading-none">System Status</div>
                 <div className="flex items-center gap-2 mt-1 justify-end">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span className="text-[10px] font-bold text-white tracking-tight">Active</span>
                 </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                 <ShieldCheck size={18} />
              </div>
           </div>
        </div>
      </div>

      {isLoading ? (
        <div className="fintech-card py-32 flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/50">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin shadow-2xl" />
            <Sparkles className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-bold text-xs">Synthesizing Datastreams</h3>
            <p className="text-slate-500 text-[10px] font-bold mt-2 opacity-60">Decoding Transaction Vectors Into Actionable Logic...</p>
          </div>
        </div>
      ) : error ? (
        <div className="fintech-card p-12 text-center rounded-3xl border border-rose-500/20 bg-rose-500/[0.02]">
          <div className="bg-rose-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
            <AlertTriangle size={32} className="text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Analysis Breach</h3>
          <p className="text-slate-500 font-bold text-[10px] mb-10 max-w-sm mx-auto leading-loose">{error}</p>
          <a 
            href="/settings" 
            className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-xs hover:bg-rose-500 hover:text-white transition-all active:scale-95"
          >
            Authenticate Keys
          </a>
        </div>
      ) : insights ? (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Executive Summary */}
          <div className="md:col-span-2 fintech-card rounded-3xl overflow-hidden border border-white/5">
             <div className="bg-slate-950 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ReceiptText size={16} className="text-blue-500" />
                  <h3 className="font-bold text-white text-[10px]">Executive Intelligence Brief</h3>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-blue-500/20 rounded-full" />
                </div>
             </div>
             <div className="p-10 bg-slate-950/20">
               <p className="text-xl text-slate-300 leading-relaxed font-bold italic tracking-tight">
                 "{insights.summary}"
               </p>
             </div>
          </div>

          {/* Core Metrics */}
          <div className="fintech-card p-8 rounded-3xl group transition-all duration-500 hover:bg-slate-900/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 tracking-widest leading-none">High-Frequency Center</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 tracking-tight">Category Extraction</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight tabular-nums">{insights.topCategory}</p>
            <div className="mt-8 pt-5 border-t border-white/5 text-[9px] font-bold text-slate-600 tracking-widest">
              Verified by intelligence pattern recognition
            </div>
          </div>

          <div className="fintech-card p-8 rounded-3xl group transition-all duration-500 hover:bg-slate-900/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform">
                <PiggyBank size={20} />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 tracking-widest leading-none">Efficiency Protocol</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 tracking-tight">Strategic Optimization</p>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-300 leading-loose tracking-wide">{insights.savingsTip}</p>
            <div className="mt-8 pt-5 border-t border-white/5 text-[9px] font-bold text-emerald-500 tracking-widest">
              System recommended savings vector
            </div>
          </div>

          {insights.warning && (
            <div className="md:col-span-2 fintech-card p-10 bg-rose-500/[0.02] border border-rose-500/20 rounded-3xl relative overflow-hidden group">
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-rose-500/5 blur-[100px] rounded-full group-hover:bg-rose-500/10 transition-all duration-1000" />
               <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                  <div className="bg-rose-500/10 p-5 rounded-3xl border border-rose-500/20 text-rose-500">
                    <AlertTriangle size={36} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                       <h3 className="font-black text-rose-500 uppercase tracking-[0.2em] text-[10px]">Threshold Violation Alert</h3>
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                    </div>
                    <p className="text-white font-bold text-xl leading-snug tracking-tight uppercase">{insights.warning}</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Footer info */}
      <div className="text-center pt-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-950 border border-white/5 rounded-full">
           <Activity size={12} className="text-slate-700" />
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
              Localized Analysis Hub • Encrypted API Tunnel Active
           </p>
        </div>
      </div>
    </div>
  );
}
