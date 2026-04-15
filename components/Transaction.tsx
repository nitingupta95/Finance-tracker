"use client";

import React, { useEffect, useState } from "react";
import TransactionForm from "./transactionForm";
import { TransactionFormData } from "../types/transaction";
import { Receipt, TrendingUp, Activity, IndianRupee, History, Search, Filter } from "lucide-react";
import axios from "axios";
import SummaryCard from "@/app/dashboard/components/SummaryCard";

function Trans() {
  const [transactions, setTransactions] = useState<TransactionFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("/api/transaction");
        setTransactions(res.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const handleTransactionSubmit = async (transaction: TransactionFormData) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/transaction", transaction);
      if (res.status === 201) {
        setTransactions((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">Activity Ledger</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Comprehensive financial audit trail</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="fintech-card px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
             <div className="text-right">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Global Volume</div>
                <div className="text-lg font-black text-white tabular-nums mt-1">₹{totalAmount.toLocaleString()}</div>
             </div>
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <TrendingUp size={18} />
             </div>
          </div>
        </div>
      </div>

      {/* Primary Integration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Terminal Section */}
        <div className="lg:col-span-5 space-y-6">
           <div className="fintech-card rounded-3xl overflow-hidden border border-white/5">
              <div className="bg-slate-950 px-6 py-4 border-b border-white/5 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
                   <Activity size={14} />
                </div>
                <h3 className="font-black text-white uppercase tracking-[0.15em] text-[10px]">Data Entry Terminal</h3>
              </div>
              <div className="p-8">
                <TransactionForm onSubmit={handleTransactionSubmit} isLoading={isLoading} />
              </div>
           </div>
        </div>

        {/* Audit Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fintech-card rounded-3xl overflow-hidden border border-white/5">
            <div className="bg-slate-950 px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-slate-500 border border-white/5">
                   <History size={14} />
                </div>
                <h3 className="font-black text-white uppercase tracking-[0.15em] text-[10px]">Registry Journal</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">Live Feed</span>
              </div>
            </div>

            {/* Filter Hub */}
            <div className="px-6 py-4 bg-slate-950/50 border-b border-white/5">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Filter registry by descriptor or domain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-xs font-bold text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all uppercase tracking-widest"
                  />
               </div>
            </div>

            <div className="divide-y divide-white/5 max-h-[700px] overflow-y-auto custom-scrollbar">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <div key={index} className="group flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all duration-300">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-600 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all duration-500 group-hover:scale-110">
                          <Receipt size={20} />
                       </div>
                       <div>
                          <div className="font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm leading-tight">{transaction.description}</div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                            {transaction.category && (
                              <div className="flex items-center gap-2">
                                 <div className="w-1 h-1 rounded-full bg-slate-800" />
                                 <span className="text-blue-500/60 uppercase text-[9px] tracking-widest font-black bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">{transaction.category}</span>
                              </div>
                            )}
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-white tabular-nums flex items-center justify-end gap-1 group-hover:text-blue-400 transition-colors">
                        <span className="text-slate-600 text-sm font-bold opacity-40">₹</span>
                        {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Verified Origin</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center">
                   <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
                      <Activity size={32} className="text-slate-800" />
                   </div>
                   <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Access Restricted</h3>
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">No activities detected in current buffer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trans;
