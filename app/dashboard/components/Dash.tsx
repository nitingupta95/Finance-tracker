"use client";

import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useUser } from "@clerk/nextjs";
import {
  IndianRupee,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Download,
  Search,
  Activity,
  Receipt
} from 'lucide-react';

import BudgetChart from './BudgetChart';
import CategoryPieChart from './CategorypieChart';
import MonthlyBarChart from './MonthlyBarchart';
import SummaryCard from './SummaryCard';
import { TransactionFormData } from '../../../types/transaction';
import { cn } from '@/lib/utils';

declare module 'jspdf' {
  interface jsPDF {
    previousAutoTable?: { finalY?: number };
  }
}

interface DashboardProps {
  transactions?: TransactionFormData[]; 
}

type BudgetSummary = {
  month: string;
  budget: number;
  spent: number;
  remaining: number;
};

const Dashboard: React.FC<DashboardProps> = ({ transactions = [] }) => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState('all');
  
  // 1. Raw Data State
  const [allBudgets, setAllBudgets] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isInitializing, setIsInitializing] = useState(true);

  // 2. Single source of truth for loading and initial year selection
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const res = await axios.get("/api/budget");
        const budgets = res.data;
        setAllBudgets(budgets);

        // Decide optimal initial year based on all data
        const years: number[] = [];
        if (transactions.length > 0) {
          years.push(...transactions.map(t => new Date(t.date).getFullYear()));
        }
        if (budgets.length > 0) {
          years.push(...budgets.map((b: any) => new Date(b.startDate).getFullYear()));
        }

        if (years.length > 0) {
          const latestYear = Math.max(...years);
          setSelectedYear(latestYear);
        }
        
        setIsInitializing(false);
      } catch (err) {
        console.error("Dashboard: Error fetching initial data", err);
        setIsInitializing(false);
      }
    };

    loadDashboardData();
  }, [transactions]);

  // 3. Derived Budget Summary (Recalculates instantly when year or data changes)
  const budgetData = useMemo(() => {
    const yearBudgets = allBudgets.filter((b: any) => new Date(b.startDate).getFullYear() === selectedYear);
    const currentYearTransactions = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);

    const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const transactionsByMonth: Record<number, TransactionFormData[]> = {};

    currentYearTransactions.forEach(t => {
      const month = new Date(t.date).getMonth();
      transactionsByMonth[month] = transactionsByMonth[month] || [];
      transactionsByMonth[month].push(t);
    });

    return monthMap.map((monthName, monthIndex) => {
      const monthBudgets = yearBudgets.filter((b: any) => {
        return new Date(b.startDate).getMonth() === monthIndex;
      });

      const totalBudget = monthBudgets.reduce((sum: number, b: any) => sum + b.amount, 0);
      const totalSpent = transactionsByMonth[monthIndex]?.reduce((sum, t) => sum + t.amount, 0) || 0;
      
      return {
        month: monthName,
        budget: totalBudget,
        spent: totalSpent,
        remaining: Math.max(totalBudget - totalSpent, 0)
      };
    }).filter(item => item.budget > 0 || item.spent > 0);
  }, [allBudgets, transactions, selectedYear]);

  // 4. Derived Available Years
  const availableYears = Array.from(new Set([
    ...transactions.map(t => new Date(t.date).getFullYear()),
    ...allBudgets.map((b: any) => new Date(b.startDate).getFullYear()),
    new Date().getFullYear()
  ])).sort((a, b) => b - a);

  // 5. Statistics Derived from state
  const yearTransactions = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);
  const totalExpenses = yearTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = yearTransactions.length > 0 ? totalExpenses / yearTransactions.length : 0;
  const transactionCount = yearTransactions.length;
  const hasDataInOtherYears = transactions.length > 0 && yearTransactions.length === 0;

  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const currentBudget = budgetData.find(b => b.month === currentMonth);
  const monthlyBudget = currentBudget?.budget ?? 0;

  const categoryData = yearTransactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Other';
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += transaction.amount;
    } else {
      acc.push({ name: category, value: transaction.amount, color: '#3b82f6' });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyData = monthMap.map((month, index) => {
    const monthExpenses = yearTransactions
      .filter(t => new Date(t.date).getMonth() === index)
      .reduce((sum, t) => sum + t.amount, 0);
    const mBudget = budgetData.find(b => b.month === month)?.budget ?? 0;

    return {
      month,
      income: mBudget,
      expenses: monthExpenses,
      net: mBudget - monthExpenses
    };
  });

  const filteredTransactions = yearTransactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory;

    let matchesDate = true;
    if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(transaction.date) >= weekAgo;
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(transaction.date) >= monthAgo;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const categories = [...new Set(yearTransactions.map(t => t.category).filter(Boolean))];

const handleExport = () => {
  const doc = new jsPDF();

  const formatCurrency = (value: number) => ` ${value.toFixed(2)}`;
  let currentY = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("Personal Finance Report", 14, currentY);
  currentY += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated for: ${user?.fullName || user?.username || "User"}`, 14, currentY);
  currentY += 10;


  // Divider
  doc.setDrawColor(200);
  doc.line(14, currentY, 195, currentY);
  currentY += 10;

  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("Summary", 14, currentY);
  currentY += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summaryLines = [
    `Total Expenses: ${formatCurrency(totalExpenses)}`,
    `Monthly Budget: ${formatCurrency(monthlyBudget)}`,
    `Avg Transaction: ${formatCurrency(avgTransaction)}`,
    `Total Transactions: ${transactionCount}`
  ];
  summaryLines.forEach((line) => {
    doc.text(line, 14, currentY);
    currentY += 6;
  });
  currentY += 4;

  // Spending by Category
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("Spending by Category", 14, currentY);
  currentY += 5;
  autoTable(doc, {
    head: [["Category", "Amount"]],
    body: categoryData.map(c => [c.name, formatCurrency(c.value)]),
    startY: currentY,
    theme: 'striped',
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'right' }
    },
    margin: { left: 14, right: 14 },
  });
    currentY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;



  // Monthly Budget Overview (Improved)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("Monthly Budget Overview", 14, currentY);
  currentY += 5;

  autoTable(doc, {
    head: [["Month", "Budget", "Spent", "Remaining"]],
    body: monthlyData.map(m => [
      m.month,
      formatCurrency(m.income),
      formatCurrency(m.expenses),
      formatCurrency(m.net)
    ]),
    startY: currentY,
    theme: 'striped',
    headStyles: {
      fillColor: [0, 150, 136],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 40 },
      1: { halign: 'right', cellWidth: 40 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 45 },
    },
    margin: { left: 14, right: 14 },
  });
  currentY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14;



  // Transaction History
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("Transaction History", 14, currentY);
  currentY += 5;
  autoTable(doc, {
    head: [["Description", "Category", "Date", "Amount"]],
    body: filteredTransactions.map(t => [
      t.description,
      t.category || 'Other',
      new Date(t.date).toLocaleDateString(),
      formatCurrency(t.amount),
    ]),
    startY: currentY,
    theme: 'striped',
    headStyles: {
      fillColor: [244, 67, 54],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      valign: 'middle',
      cellPadding: 4,
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 60 },
      1: { halign: 'left', cellWidth: 40 },
      2: { halign: 'center', cellWidth: 30 },
      3: { halign: 'right', cellWidth: 30 }
    },
    margin: { left: 14, right: 14 },
  });

  // Save PDF
  doc.save(`finance-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

  return (
    <div className="space-y-8">
      {/* Year Selection Protocols */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="text-[10px] font-bold text-slate-500 mr-2 opacity-60">Temporal Context:</div>
        {availableYears.map(year => (
          <button 
            key={year}
            onClick={() => setSelectedYear(year)}
            className={cn(
              "px-5 py-2.5 rounded-2xl border transition-all text-xs font-bold shadow-xl",
              selectedYear === year 
                ? "bg-blue-600 text-white border-blue-500 shadow-blue-500/20" 
                : "bg-white/[0.03] text-slate-500 border-white/5 hover:border-white/10 hover:bg-white/[0.05]"
            )}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Expenses" 
          value={<>₹{totalExpenses.toLocaleString()}</>} 
          change={12.5} 
          changeLabel={`Total for ${selectedYear}`} 
          icon={IndianRupee} 
          color="red" 
          trend="up" 
        />
        <SummaryCard 
          title="Monthly Budget" 
          value={<>₹{monthlyBudget.toLocaleString()}</>} 
          changeLabel="Planned Allocation" 
          icon={PiggyBank} 
          color="green" 
          trend="neutral" 
        />
        <SummaryCard 
          title="Avg Transaction" 
          value={<>₹{avgTransaction.toLocaleString()}</>} 
          change={5.2}
          changeLabel="Per Entry Average" 
          icon={CreditCard} 
          color="blue" 
          trend="up" 
        />
        <SummaryCard 
          title="Transaction Count" 
          value={transactionCount.toString()} 
          changeLabel="System Entries" 
          icon={TrendingUp} 
          color="orange" 
          trend="up" 
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="fintech-card p-6 rounded-2xl overflow-hidden">
           <BudgetChart data={budgetData} />
        </div>
        <div className="fintech-card p-6 rounded-2xl overflow-hidden">
           <CategoryPieChart data={categoryData} />
        </div>
      </div>

      <div className="fintech-card p-6 rounded-2xl overflow-hidden">
        <MonthlyBarChart data={monthlyData} />
      </div>

      {/* Primary Journal */}
      <div className="fintech-card rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent Activity Journal
          </h2>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all text-[10px] font-bold tracking-wider"
          >
            <Download size={14} />
            Export Registry
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-white/5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search journal protocols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-24 px-6">
              <div className="inline-flex p-4 rounded-3xl bg-slate-900 border border-white/5 mb-4">
                <CreditCard className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-slate-500 font-bold text-xs">No records matching the current selection</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredTransactions.slice(0, 10).map((transaction, index) => (
                <div key={index} className="group flex items-center justify-between p-5 hover:bg-white/2 transition-all duration-300">
                  <div className="flex items-center gap-5">
                     <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shadow-xl">
                        <Receipt className="w-5.5 h-5.5" />
                     </div>
                     <div>
                        <div className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors truncate max-w-[200px] md:max-w-md">
                          {transaction.description}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold mt-1 opacity-60">
                          {new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          {transaction.category && <span className="mx-2 text-slate-700">/</span>}
                          {transaction.category}
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white flex items-center justify-end gap-1.5 tabular-nums">
                      <span className="text-slate-600 text-sm font-bold">₹</span>
                      {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] text-blue-500/60 font-bold mt-1">Confirmed</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredTransactions.length > 0 && (
            <div className="p-4 bg-white/2 border-t border-white/5 text-center">
              <button 
                onClick={() => window.location.href = '/transaction'}
                className="text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-colors tracking-widest"
              >
                Access Full Transaction Journal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
