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
    <div className="min-h-screen bg-slate-950 p-6 pt-24 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Financial <span className="text-indigo-400">Intelligence</span>
            </h1>
            <p className="text-slate-400 font-medium">Precision tracking for your personal economy</p>
            {hasDataInOtherYears && (
              <div className="mt-4 p-4 glass-morphism rounded-2xl text-sm text-indigo-300 font-medium border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <span className="mr-2">✨</span> You have activity in other years! Switch above to explore history.
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Total Expenses" value={<>₹{totalExpenses.toLocaleString()}</>} changeLabel="Total layout" icon={IndianRupee} color="red" trend="up" />
          <SummaryCard title="Monthly Budget" value={<>₹{monthlyBudget.toLocaleString()}</>} changeLabel="Allocation" icon={PiggyBank} color="green" trend="neutral" />
          <SummaryCard title="Avg Transaction" value={<>₹{avgTransaction.toLocaleString()}</>} changeLabel="Per entry" icon={CreditCard} color="purple" trend="up" />
          <SummaryCard title="Activity Count" value={transactionCount.toString()} changeLabel="Total entries" icon={TrendingUp} color="orange" trend="up" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 overflow-hidden">
             <BudgetChart data={budgetData} />
          </div>
          <div className="glass-card p-6 overflow-hidden">
             <CategoryPieChart data={categoryData} />
          </div>
        </div>

        <div className="glass-card p-6 overflow-hidden">
          <MonthlyBarChart data={monthlyData} />
        </div>

        {/* Transactions List */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 bg-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Recent Intelligence
            </h3>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-white/5">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input w-full pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="glass-input bg-slate-900">
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="glass-input bg-slate-900">
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="inline-flex p-4 rounded-full bg-slate-900 border border-white/5 mb-4 shadow-xl shadow-black/50">
                  <CreditCard className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 font-medium">No intelligence data found for the current filter</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredTransactions.slice(0, 10).map((transaction, index) => (
                  <div key={index} className="group flex items-center justify-between p-5 hover:bg-white/5 transition-all duration-300">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                          <Receipt className="w-5 h-5" />
                       </div>
                       <div>
                          <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">{transaction.description}</div>
                          <div className="text-xs text-slate-500 font-medium mt-0.5">
                            {new Date(transaction.date).toLocaleDateString()}
                            {transaction.category && <span className="mx-2 opacity-30">|</span>}
                            {transaction.category}
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-white flex items-center justify-end gap-1">
                        <span className="text-slate-500 text-sm font-bold">₹</span>
                        {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-indigo-400/60 font-black uppercase tracking-widest mt-1">Processed</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredTransactions.length > 0 && (
              <div className="p-4 bg-white/5 text-center">
                <button className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
                  View Full Transaction Journal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
