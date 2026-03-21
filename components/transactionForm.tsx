"use client"
import React, { useState } from 'react';
import { IndianRupee, Calendar, FileText, Tag, Plus, Check, AlertCircle } from 'lucide-react';
import {  TransactionFormData, TRANSACTION_CATEGORIES } from '../types/transaction';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
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
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-black px-8 py-6">
          <h2 className="text-3xl font-bold text-white mb-2">Add Transaction</h2>
          <p className="text-blue-100">Track your financial activity</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Amount Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                onFocus={() => setFocusedField('amount')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 rounded-xl border-2 text-lg font-medium transition-all duration-200 ${
                  getFieldError('amount')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : isFieldFocused('amount')
                    ? 'border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
                placeholder="0.00"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                INR
              </div>
            </div>
            {getFieldError('amount') && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('amount')}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                  getFieldError('description')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : isFieldFocused('description')
                    ? 'border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
                placeholder="Enter transaction description..."
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {formData.description.length}/100
              </div>
            </div>
            {getFieldError('description') && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('description')}
              </p>
            )}
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              onFocus={() => setFocusedField('date')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                getFieldError('date')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : isFieldFocused('date')
                  ? 'border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
            />
            {getFieldError('date') && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('date')}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category <span className="text-xs text-gray-500 ml-1">(Optional)</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              onFocus={() => setFocusedField('category')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isFieldFocused('category')
                  ? 'border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
            >
              <option value="">Select a category...</option>
              {TRANSACTION_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isSubmitted}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                isSubmitted
                  ? 'bg-green-500 shadow-lg'
                  : isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-black hover:from-blue-700 hover:to-black-700 hover:shadow-lg hover:scale-105 active:scale-95'
              } focus:outline-none focus:ring-4 focus:ring-blue-200`}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitted ? (
                  <>
                    <Check className="w-5 h-5" />
                    Transaction Added!
                  </>
                ) : isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Transaction
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;