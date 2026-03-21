"use client"
import React, { useState, useEffect } from 'react'
import Dashboard from "./components/Dash"
import { TransactionFormData } from '@/types/transaction';
import axios from "axios";
import { AiCashflow } from '@/components/dashboard/ai-cashflow';

const Page = () => {
  const [transactions, setTransactions] = useState<TransactionFormData[]>([]);
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
  
  return (
    <div className="mt-20">
        
          <Dashboard transactions={transactions} />
          <div className="pb-10">
             <AiCashflow transactions={transactions} />
          </div>
    </div>
  )
}

export default Page