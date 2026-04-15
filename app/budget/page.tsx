"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Target, TrendingUp, AlertCircle, Search, Filter } from 'lucide-react';
import { Budget, BudgetFormData } from "../../types/budget";
import BudgetForm from "../../components/budgetForm";
import BudgetCard from "../../components/budgetCard";
import axios from "axios";

import SummaryCard from '../dashboard/components/SummaryCard';
import { IndianRupee } from 'lucide-react';

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overBudgetCount = budgets.filter(budget => (budget.spent || 0) > budget.amount).length;

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/budget');
        setBudgets(response.data);
      } catch (error) {
        console.error('Failed to fetch budgets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudgets(); 
  }, []);

  const handleCreateBudget = async (budgetData: BudgetFormData) => {
    setIsLoading(true);
    const res = await axios.post("/api/budget", budgetData);
    if (res.status === 201) {
      setBudgets((prev) => [res.data, ...prev]);
    } else {
      alert(res.data.message || "Something went wrong while adding the budget.");
    }
    setShowForm(false);
    setIsLoading(false);
  };

  const handleUpdateBudget = async (budgetData: BudgetFormData) => {
    if (!editingBudget?._id) return;
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/budget/${editingBudget._id}`, budgetData);
      if (res.status === 200) {
        setBudgets(prev => prev.map(budget => budget._id === res.data._id ? res.data : budget));
        setEditingBudget(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    setIsLoading(true);
    try {
      const res = await axios.delete(`/api/budget/${budgetId}`);
      if (res.status === 200) {
        setBudgets(prev => prev.filter(b => b._id !== budgetId));
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = filterPeriod === 'all' || budget.period === filterPeriod;
    return matchesSearch && matchesPeriod;
  });

  return (
    <div className="space-y-8">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight leading-none">Budget Architecture</h2>
          <p className="text-slate-500 text-sm font-medium mt-2">Institutional Allocation Governance</p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 group font-semibold text-sm"
        >
          <Plus size={16} className="transition-transform group-hover:rotate-90" />
          Establish Limit Protocol
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Allocation" 
          value={<>₹{totalBudget.toLocaleString()}</>} 
          icon={Target} 
          color="blue" 
          change={100}
          changeLabel="Total Planned"
        />
        <SummaryCard 
          title="Global Drain" 
          value={<>₹{totalSpent.toLocaleString()}</>} 
          icon={TrendingUp} 
          color="red" 
          trend="down"
          changeLabel="Active Utilization"
        />
        <SummaryCard 
          title={totalRemaining >= 0 ? "Net Buffer" : "Violation Depth"} 
          value={<>₹{Math.abs(totalRemaining).toLocaleString()}</>} 
          icon={AlertCircle} 
          color={totalRemaining >= 0 ? "green" : "red"} 
          trend={totalRemaining >= 0 ? "up" : "down"}
          changeLabel="Available Capital"
        />
        <SummaryCard 
          title="Threshold Triggers" 
          value={overBudgetCount.toString()} 
          icon={AlertCircle} 
          color="orange" 
          trend="neutral"
          changeLabel="Policy Violations"
        />
      </div>

      {/* Control Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xl animate-in zoom-in-95 duration-300">
            <BudgetForm
              budget={editingBudget || undefined}
              onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget}
              onCancel={handleCancelForm}
              isLoading={isLoading}
              isEditing={!!editingBudget}
            />
          </div>
        </div>
      )}

      {/* Filters Hub */}
      <div className="fintech-card p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search Allocation Vectors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-500">
               <Filter size={18} />
            </div>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Cycles</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Allocation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {filteredBudgets.length === 0 ? (
          <div className="col-span-full py-24 fintech-card text-center rounded-3xl">
            <div className="bg-slate-950 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
              <Target size={40} className="text-slate-800" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Empty Registry</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-bold uppercase tracking-widest text-[10px] leading-loose">
              {searchTerm || filterPeriod !== 'all' 
                ? 'No vectors match your parameters. Adjust filters to view registry.'
                : 'Initialize your first allocation vector to begin financial governance.'
              }
            </p>
            {!searchTerm && filterPeriod === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-2xl"
              >
                Create Initial Vector
              </button>
            )}
          </div>
        ) : (
          filteredBudgets.map(budget => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetPage;