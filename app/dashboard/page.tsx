"use client"
import React, { useState, useEffect } from 'react'
import Dashboard from "./components/Dash"
import { TransactionFormData } from '@/types/transaction';
import axios from "axios";
import { AiCashflow } from '@/components/dashboard/ai-cashflow';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const [transactions, setTransactions] = useState<TransactionFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/transaction");
        setTransactions(res.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your financial data...</p>
      </div>
    );
  }

  return (
    <div className="mt-20">
          <Dashboard transactions={transactions} />
          <div className="pb-10">
             <AiCashflow transactions={transactions} />
          </div>
    </div>
  );
}

export default Page