
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Transaction Manager</h1>
                <p className="text-gray-600">Track and manage your financial transactions</p>
              </div>
            </div>
            {transactions.length > 0 && (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Transactions</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Amount</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
                    <IndianRupee className="w-5 h-5" />
                    {totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="py-12">
        <TransactionForm onSubmit={handleTransactionSubmit} isLoading={isLoading} />
      </div>
      {transactions.length > 0 && (
        <div className="max-w-2xl mx-auto px-8 pb-12">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-black px-6 py-4">
              <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-600">
                        {transaction.date} {transaction.category && `• ${transaction.category}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trans;
