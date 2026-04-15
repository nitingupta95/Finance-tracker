"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Target, TrendingUp, AlertCircle, Search, Filter } from 'lucide-react';
import { Budget, BudgetFormData } from "../../types/budget";
import BudgetForm from "../../components/budgetForm";
import BudgetCard from "../../components/budgetCard";
import axios from "axios";

// ✅ Removed unused prop
const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // (rest of your component remains unchanged)

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
    
    // const newBudget: Budget = {
    //   _id: Date.now().toString(),
    //   ...budgetData,
    //   spent: 0,
    //   remaining: budgetData.amount,
    //   isActive: true,
    //   createdAt: new Date().toISOString(),
    // };
     
    const res= await axios.post("/api/budget",budgetData);
      if (res.status === 201) {
        setBudgets((prev) => [res.data, ...prev]);
      } else {
        console.log("Response status:", res.status, res.data);
        alert(res.data.message || "Something went wrong while adding the transaction.");
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
        const updated = res.data;

        setBudgets(prev =>
          prev.map(budget =>
            budget._id === updated._id ? updated : budget
          )
        );

        setEditingBudget(null);
        setShowForm(false);
      } else {
        alert('Failed to update budget');
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Something went wrong while updating the budget.');
    } finally {
      setIsLoading(false);
    }
  };

  // === Start Editing ===
  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  // === Delete Budget ===
  const handleDeleteBudget = async (budgetId: string) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    setIsLoading(true);
    try {
      const res = await axios.delete(`/api/budget/${budgetId}`);

      if (res.status === 200) {
        setBudgets(prev => prev.filter(b => b._id !== budgetId));
      } else {
        alert('Failed to delete budget.');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Something went wrong while deleting the budget.');
    } finally {
      setIsLoading(false);
    }
  };




 
 

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  // Filter budgets
  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = filterPeriod === 'all' || budget.period === filterPeriod;
    return matchesSearch && matchesPeriod;
  });

  return (
    <div className="min-h-screen bg-slate-950 p-6 pt-24 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Budget <span className="text-emerald-400">Architecture</span>
            </h1>
            <p className="text-slate-400 font-medium font-medium">Engineer your financial limits with precision</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            Establish Limit
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-2xl">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Planned</h3>
                <div className="text-2xl font-black text-white">₹{totalBudget.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-rose-500">
            <div className="flex items-center gap-4">
              <div className="bg-rose-500/20 p-3 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Global Drain</h3>
                <div className="text-2xl font-black text-rose-400">₹{totalSpent.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${totalRemaining >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                <Target className={`w-6 h-6 ${totalRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
              </div>
              <div>
                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  {totalRemaining >= 0 ? 'Net Buffer' : 'Violation Depth'}
                </h3>
                <div className={`text-2xl font-black ${totalRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₹{Math.abs(totalRemaining).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-amber-500">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/20 p-3 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Threshold Triggers</h3>
                <div className="text-2xl font-black text-white">{overBudgetCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
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

        {/* Filters */}
        <div className="glass-card p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search budget schemas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="glass-input bg-slate-900"
              >
                <option value="all">All Periods</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filteredBudgets.length === 0 ? (
            <div className="col-span-full py-20 glass-card text-center">
              <div className="bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
                <Target className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Allocation Vectors</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                {searchTerm || filterPeriod !== 'all' 
                  ? 'Adjustment required: No budgets match your current search parameters.'
                  : 'Initialization required: Establish your first spending limits to begin tracking.'
                }
              </p>
              {!searchTerm && filterPeriod === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-3 bg-white text-slate-950 rounded-2xl font-extrabold hover:bg-slate-200 transition-all active:scale-95"
                >
                  Create Initial Budget
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
    </div>
  );
};

export default BudgetPage;