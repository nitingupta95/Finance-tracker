"use client";

import React, { useEffect, useState } from 'react';
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
  Search
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
  const [budgetData, setBudgetData] = useState<BudgetSummary[]>([]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const availableYears = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))).sort((a, b) => b - a);
  if (!availableYears.includes(currentYear)) {
    availableYears.unshift(currentYear);
  }

  const yearTransactions = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);

  const totalExpenses = yearTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = yearTransactions.length > 0 ? totalExpenses / yearTransactions.length : 0;
  const transactionCount = yearTransactions.length;

  useEffect(() => {
    const fetchBudgetData = async () => {
      const res = await axios.get("/api/budget");
      
      const yearBudgets = res.data.filter((b: { startDate: string }) => new Date(b.startDate).getFullYear() === selectedYear);
      const currentYearTransactions = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);

      const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const transactionsByMonth: Record<number, TransactionFormData[]> = {};

      currentYearTransactions.forEach(t => {
        const month = new Date(t.date).getMonth();
        transactionsByMonth[month] = transactionsByMonth[month] || [];
        transactionsByMonth[month].push(t);
      });

      const summary: BudgetSummary[] = [];

      monthMap.forEach((monthName, monthIndex) => {
        const monthBudgets = yearBudgets.filter((b: { startDate: string }) => {
          return new Date(b.startDate).getMonth() === monthIndex;
        });

        if (monthBudgets.length > 0) {
          const totalBudget = monthBudgets.reduce((sum: number, b: { amount: number }) => sum + b.amount, 0);
          const totalSpent = transactionsByMonth[monthIndex]?.reduce((sum, t) => sum + t.amount, 0) || 0;
          summary.push({
            month: monthName,
            budget: totalBudget,
            spent: totalSpent,
            remaining: Math.max(totalBudget - totalSpent, 0)
          });
        }
      });

      setBudgetData(summary);
    };

    fetchBudgetData();
  }, [transactions, selectedYear]);

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
    const monthBudget = budgetData.find(b => b.month === month)?.budget ?? 0;

    return {
      month,
      income: monthBudget,
      expenses: monthExpenses,
      net: monthBudget - monthExpenses
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
            <p className="text-gray-600">Track your spending and manage your budget</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
 
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Total Expenses" value={<><IndianRupee className="w-4 h-4" />{totalExpenses.toFixed(2)}</>} changeLabel="vs last month" icon={IndianRupee} color="blue" trend="up" />
          <SummaryCard title="Monthly Budget" value={<><IndianRupee className="w-4 h-4" />{monthlyBudget.toFixed(2)}</>}  changeLabel="under budget" icon={PiggyBank} color="green" trend="down" />
          <SummaryCard title="Avg Transaction" value={<><IndianRupee className="w-4 h-4" />{avgTransaction.toFixed(2)}</>}  changeLabel="vs last month" icon={CreditCard} color="purple" trend="up" />
          <SummaryCard title="Total Transactions" value={transactionCount.toString()} changeLabel="this month" icon={TrendingUp} color="orange" trend="up" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BudgetChart data={budgetData} />
          <CategoryPieChart data={categoryData} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <MonthlyBarChart data={monthlyData} />
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Transactions */}
          <div className="p-6">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <CreditCard className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-600">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.slice(0, 10).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                        {transaction.category && ` • ${transaction.category}`}
                      </div>
                    </div>
                    <div className="text-right text-lg font-bold text-gray-900">
                      <IndianRupee className="inline w-4 h-4" />
                      {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
