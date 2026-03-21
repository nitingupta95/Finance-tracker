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
    <div className="mt-18 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Management</h1>
            <p className="text-gray-600">Set spending limits and track your financial goals</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create Budget
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Total Budget</h3>
                <div className="text-2xl font-bold text-gray-900">₹{totalBudget.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Total Spent</h3>
                <div className="text-2xl font-bold text-gray-900">	₹{totalSpent.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`bg-gradient-to-r p-3 rounded-xl ${
                totalRemaining >= 0 
                  ? 'from-green-500 to-green-600' 
                  : 'from-red-500 to-red-600'
              }`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">
                  {totalRemaining >= 0 ? 'Remaining' : 'Over Budget'}
                </h3>
                <div className={`text-2xl font-bold ${
                  totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  	₹{Math.abs(totalRemaining).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Over Budget</h3>
                <div className="text-2xl font-bold text-gray-900">{overBudgetCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search budgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBudgets.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Target className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No budgets found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterPeriod !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first budget to start tracking your spending'
                }
              </p>
              {!searchTerm && filterPeriod === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all"
                >
                  Create Your First Budget
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