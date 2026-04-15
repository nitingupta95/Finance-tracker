
"use client";

import React, { useEffect, useState } from "react";
import TransactionForm from "./transactionForm";
import { TransactionFormData } from "../types/transaction";
import { Receipt, TrendingUp, Activity, IndianRupee } from "lucide-react";
import axios from "axios";

function Trans() {
  const [transactions, setTransactions] = useState<TransactionFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      } else {
        console.log("Response status:", res.status, res.data);
        alert(res.data.message || "Something went wrong while adding the transaction.");
      }

    } catch (err) {
      console.error("Error adding transaction:", err);
      alert("Failed to add transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 p-6 pt-24 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <Receipt className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Transaction <span className="text-indigo-400">Ledger</span>
              </h1>
              <p className="text-slate-400 font-medium">Capture and audit your financial activities</p>
            </div>
          </div>
          
          {transactions.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="glass-card px-5 py-3 border-l-4 border-l-indigo-500">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Frequency</span>
                </div>
                <div className="text-2xl font-black text-white">{transactions.length} Entries</div>
              </div>
              <div className="glass-card px-5 py-3 border-l-4 border-l-emerald-500">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Volume</span>
                </div>
                <div className="text-2xl font-black text-emerald-400 flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <div className="lg:col-span-5">
             <div className="glass-card p-0 overflow-hidden">
                <div className="bg-white/5 px-6 py-4 border-b border-white/5">
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs">New Data Entry</h3>
                </div>
                <div className="p-6">
                  <TransactionForm onSubmit={handleTransactionSubmit} isLoading={isLoading} />
                </div>
             </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7">
            {transactions.length > 0 ? (
              <div className="glass-card overflow-hidden">
                <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs">Activity Journal</h3>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">Real-time Sync</span>
                </div>
                <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="group flex items-center justify-between p-5 hover:bg-white/5 transition-all duration-300">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                            <Receipt className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="font-bold text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight text-sm">{transaction.description}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">
                              {new Date(transaction.date).toLocaleDateString()}
                              {transaction.category && <span className="mx-2 opacity-30">|</span>}
                              <span className="text-indigo-400/60 uppercase text-[10px] tracking-widest font-bold">{transaction.category}</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-emerald-400 flex items-center justify-end gap-1">
                          <span className="text-emerald-600 text-sm font-bold">₹</span>
                          {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Verified</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-20 text-center">
                 <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <Activity className="w-10 h-10 text-slate-700" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">No Transactions Logged</h3>
                 <p className="text-slate-500 font-medium">Your financial activity journal is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trans;
