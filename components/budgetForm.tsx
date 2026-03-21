"use client"
import React, { useState } from 'react';
import {  Calendar, Tag, Clock, Save, X, AlertCircle, IndianRupee } from 'lucide-react';
import { Budget, BudgetFormData, BUDGET_CATEGORIES, BUDGET_PERIODS } from "../types/budget";

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
  const isFieldFocused = (field: string) => focusedField === field;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Budget' : 'Create New Budget'}
            </h3>
            <p className="text-emerald-100 text-sm">
              {isEditing ? 'Update your budget settings' : 'Set spending limits for better financial control'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Category Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            onFocus={() => setFocusedField('category')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              getFieldError('category')
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : isFieldFocused('category')
                ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
                : 'border-gray-200 hover:border-gray-300'
            } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
          >
            <option value="">Select a category...</option>
            {BUDGET_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {getFieldError('category') && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {getFieldError('category')}
            </p>
          )}
        </div>

        {/* Amount and Period Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Budget Amount
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
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
                    : 'border-gray-200 hover:border-gray-300'
                } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
                placeholder="0.00"
              /> 
            </div>
            {getFieldError('amount') && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('amount')}
              </p>
            )}
          </div>

          {/* Period Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Budget Period
            </label>
            <select
              value={formData.period}
              onChange={(e) => handleInputChange('period', e.target.value as 'monthly' | 'weekly' | 'yearly')}
              onFocus={() => setFocusedField('period')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isFieldFocused('period')
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
                  : 'border-gray-200 hover:border-gray-300'
              } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
            >
              {BUDGET_PERIODS.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              onFocus={() => setFocusedField('startDate')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                getFieldError('startDate')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : isFieldFocused('startDate')
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
                  : 'border-gray-200 hover:border-gray-300'
              } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
            />
            {getFieldError('startDate') && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('startDate')}
              </p>
            )}
          </div>

          {/* End Date Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              End Date <span className="text-xs text-gray-500 ml-1">(Optional)</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              onFocus={() => setFocusedField('endDate')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                getFieldError('endDate')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : isFieldFocused('endDate')
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
                  : 'border-gray-200 hover:border-gray-300'
              } focus:outline-none focus:ring-4 bg-gray-50 focus:bg-white`}
            />
            {getFieldError('endDate') && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('endDate')}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:scale-105 active:scale-95'
            } focus:outline-none focus:ring-4 focus:ring-emerald-200`}
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? 'Update Budget' : 'Create Budget'}
                </>
              )}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;