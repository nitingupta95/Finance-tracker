"use client"
import React, { useState } from 'react';
import { Calendar, Tag, Clock, Save, X, AlertCircle, IndianRupee } from 'lucide-react';
import { Budget, BudgetFormData, BUDGET_CATEGORIES, BUDGET_PERIODS } from "../types/budget";
import { cn } from "@/lib/utils";

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (budget: BudgetFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

interface FormErrors {
  category?: string;
  amount?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  budget, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<BudgetFormData>({
    category: budget?.category || '',
    amount: budget?.amount || 0,
    period: budget?.period || 'monthly',
    startDate: budget?.startDate || new Date().toISOString().split('T')[0],
    endDate: budget?.endDate || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof BudgetFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const getFieldError = (field: keyof FormErrors) => errors[field];

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-w-xl w-full mx-auto">
      {/* Header */}
      <div className="bg-slate-950 px-8 py-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight uppercase">
              {isEditing ? 'Modify Allocation' : 'Establish Limit'}
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
               Refined Financial Governance
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-white hover:bg-white/5 p-2 rounded-xl transition-all border border-transparent hover:border-white/5"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Category Field */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Tag size={12} className="text-blue-500" />
            Category Classification
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={cn(
               "w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold",
               getFieldError('category') && "border-rose-500/50 focus:ring-rose-500/20"
            )}
          >
            <option value="" className="bg-slate-950">Select category...</option>
            {BUDGET_CATEGORIES.map(category => (
              <option key={category} value={category} className="bg-slate-950 text-white">
                {category}
              </option>
            ))}
          </select>
          {getFieldError('category') && (
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-2">
              <AlertCircle size={10} />
              {getFieldError('category')}
            </p>
          )}
        </div>

        {/* Amount and Period Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <IndianRupee size={12} className="text-blue-500" />
              Allocation Amount
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className={cn(
                   "w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xl font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                   getFieldError('amount') && "border-rose-500/50 focus:ring-rose-500/20"
                )}
                placeholder="0.00"
              /> 
            </div>
            {getFieldError('amount') && (
              <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-2">
                <AlertCircle size={10} />
                {getFieldError('amount')}
              </p>
            )}
          </div>

          {/* Period Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} className="text-blue-500" />
              Execution Cycle
            </label>
            <select
              value={formData.period}
              onChange={(e) => handleInputChange('period', e.target.value as 'monthly' | 'weekly' | 'yearly')}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            >
              {BUDGET_PERIODS.map(period => (
                <option key={period.value} value={period.value} className="bg-slate-950">
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} className="text-blue-500" />
              Effective Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={cn(
                 "w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                 getFieldError('startDate') && "border-rose-500/50 focus:ring-rose-500/20"
              )}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} className="text-blue-500" />
              Termination Date <span className="text-[8px] opacity-40 ml-1">(Optional)</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={cn(
                 "w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                 getFieldError('endDate') && "border-rose-500/50 focus:ring-rose-500/20"
              )}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-400 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] py-4 px-6 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                 <Save size={16} />
                 {isEditing ? 'Commit Changes' : 'Execute Plan'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;