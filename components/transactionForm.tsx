"use client"
import React, { useState } from 'react';
import { IndianRupee, Calendar, FileText, Tag, Plus, Check, AlertCircle } from 'lucide-react';
import { TransactionFormData, TRANSACTION_CATEGORIES } from '../types/transaction';
import { AiEntry } from './transaction/ai-entry';
import { getAiHeaders } from '@/lib/ai/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onSubmit: (transaction: TransactionFormData) => void;
  isLoading?: boolean;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
  category?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Quantum must be > 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descriptor required';
    } else if (formData.description.length > 100) {
      newErrors.description = 'Limit: 100 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Temporal point required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      let finalData = { ...formData };
      
      if (!finalData.category) {
        try {
          const res = await fetch("/api/ai/categorize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAiHeaders()
            },
            body: JSON.stringify({ merchant: finalData.description })
          });
          if (res.ok) {
            const data = await res.json();
            finalData.category = data.category;
            toast.success(`Vector: ${data.category}`);
          }
        } catch (err) {
          console.error("Auto-categorization failed", err);
        }
      }

      onSubmit(finalData);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setFormData({
          amount: 0,
          description: '',
          date: new Date().toISOString().split('T')[0],
          category: '',
        });
        setIsSubmitted(false);
      }, 1500);
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getFieldError = (field: keyof FormErrors) => errors[field];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="mb-10">
        <AiEntry onExtracted={(data: any) => {
          setFormData(prev => ({
            ...prev,
            amount: data.amount || prev.amount,
            description: data.merchant || prev.description,
            date: data.date || prev.date,
            category: data.category || prev.category
          }));
          setErrors({});
        }} />
      </div>

      {/* Amount Field */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-[0.2em]">
          <IndianRupee size={12} className="text-blue-500" />
          Quantum Allocation
        </label>
        <div className="relative group">
          <input
            type="number"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            className={cn(
               "w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-black tabular-nums transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-800",
               getFieldError('amount') && "border-rose-500/50 focus:ring-rose-500/20"
            )}
            placeholder="0.00"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-700 uppercase tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">
            CURRENCY (INR)
          </div>
        </div>
        {getFieldError('amount') && (
          <p className="text-rose-500 text-[10px] font-black flex items-center gap-1.5 uppercase tracking-widest mt-2">
            <AlertCircle size={10} />
            {getFieldError('amount')}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-[0.2em]">
          <FileText size={12} className="text-blue-500" />
          Descriptor Profile
        </label>
        <div className="relative group">
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={2}
            className={cn(
               "w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 resize-none font-bold placeholder-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white leading-relaxed",
               getFieldError('description') && "border-rose-500/50 focus:ring-rose-500/20"
            )}
            placeholder="Activity descriptor..."
          />
          <div className="absolute bottom-4 right-6 text-[9px] font-black text-slate-700 uppercase tracking-widest">
            {formData.description.length}/100
          </div>
        </div>
        {getFieldError('description') && (
          <p className="text-rose-500 text-[10px] font-black flex items-center gap-1.5 uppercase tracking-widest mt-2">
            <AlertCircle size={10} />
            {getFieldError('description')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Field */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-[0.2em]">
            <Calendar size={12} className="text-blue-500" />
            Temporal Point
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={cn(
               "w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
               getFieldError('date') && "border-rose-500/50 focus:ring-rose-500/20"
            )}
          />
        </div>

        {/* Category Field */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-[0.2em]">
            <Tag size={12} className="text-blue-500" />
            Domain Tag
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="" className="bg-slate-950 text-slate-500">Auto-Detect Domain</option>
            {TRANSACTION_CATEGORIES.map(category => (
              <option key={category} value={category} className="bg-slate-950">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-8">
        <button
          type="submit"
          disabled={isLoading || isSubmitted}
          className={cn(
            "w-full py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
            isSubmitted
              ? 'bg-emerald-600 text-white shadow-emerald-500/10'
              : isLoading
              ? 'bg-slate-800 text-slate-500 border border-white/5'
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/10'
          )}
        >
          <div className="flex items-center justify-center gap-3">
            {isSubmitted ? (
              <>
                <Check size={18} />
                Registry Updated
              </>
            ) : isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus size={18} />
                Commit Transaction
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;