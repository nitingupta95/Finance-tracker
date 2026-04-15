"use client"
import React, { useState } from 'react';
import { IndianRupee, Calendar, FileText, Tag, Plus, Check, AlertCircle } from 'lucide-react';
import {  TransactionFormData, TRANSACTION_CATEGORIES } from '../types/transaction';
import { AiEntry } from './transaction/ai-entry';
import { getAiHeaders } from '@/lib/ai/client';
import { toast } from 'sonner';

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
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 100) {
      newErrors.description = 'Description must be less than 100 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
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
            toast.success(`Auto-categorized as ${data.category}`);
          }
        } catch (err) {
          console.error("Auto-categorization failed", err);
        }
      }

      onSubmit(finalData);
      setIsSubmitted(true);
      
      // Reset form after successful submission
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
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const getFieldError = (field: keyof FormErrors) => errors[field];
  const isFieldFocused = (field: string) => focusedField === field;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-8">
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
        <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
          <IndianRupee className="w-3.5 h-3.5 text-indigo-400" />
          Quantum (INR)
        </label>
        <div className="relative group">
          <input
            type="number"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            onFocus={() => setFocusedField('amount')}
            onBlur={() => setFocusedField(null)}
            className={`glass-input w-full text-2xl font-black tracking-tight ${
              getFieldError('amount') ? 'border-rose-500/50 focus:ring-rose-500/20' : ''
            }`}
            placeholder="0.00"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 font-bold text-xs group-focus-within:text-indigo-400 transition-colors">
            CURRENCY
          </div>
        </div>
        {getFieldError('amount') && (
          <p className="text-rose-400 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('amount')}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          Description Profile
        </label>
        <div className="relative group">
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            onFocus={() => setFocusedField('description')}
            onBlur={() => setFocusedField(null)}
            rows={2}
            className={`glass-input w-full py-4 resize-none font-medium ${
              getFieldError('description') ? 'border-rose-500/50 focus:ring-rose-500/20' : ''
            }`}
            placeholder="What was this expenditure for?"
          />
          <div className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {formData.description.length}/100
          </div>
        </div>
        {getFieldError('description') && (
          <p className="text-rose-400 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('description')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Field */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Temporal Point
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            onFocus={() => setFocusedField('date')}
            onBlur={() => setFocusedField(null)}
            className={`glass-input w-full font-bold ${
              getFieldError('date') ? 'border-rose-500/50 focus:ring-rose-500/20' : ''
            }`}
          />
        </div>

        {/* Category Field */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            Domain Tag
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            onFocus={() => setFocusedField('category')}
            onBlur={() => setFocusedField(null)}
            className="glass-input w-full bg-slate-900 font-bold appearance-none cursor-pointer"
          >
            <option value="">Auto-Detect</option>
            {TRANSACTION_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading || isSubmitted}
          className={`w-full py-5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 transform shadow-xl ${
            isSubmitted
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : isLoading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 shadow-indigo-500/20'
          } focus:outline-none focus:ring-4 focus:ring-indigo-500/20`}
        >
          <div className="flex items-center justify-center gap-3">
            {isSubmitted ? (
              <>
                <Check className="w-5 h-5" />
                Journal Updated
              </>
            ) : isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Encrypting Data...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
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