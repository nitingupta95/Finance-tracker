import React from 'react';
import { Edit, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Budget } from "../types/budget";

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const spent = budget.spent || 0;
  const remaining = budget.amount - spent;
  const percentage = (spent / budget.amount) * 100;
  
  const getStatusColor = () => {
    if (percentage >= 100) return 'red';
    if (percentage >= 80) return 'yellow';
    return 'green';
  };

  const getStatusIcon = () => {
    if (percentage >= 100) return <AlertTriangle className="w-4 h-4" />;
    if (percentage >= 80) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const statusColor = getStatusColor();
  const statusIcon = getStatusIcon();

  const colorClasses = {
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      lightBg: 'bg-red-50',
      border: 'border-red-200',
      progress: 'bg-red-500',
    },
    yellow: {
      bg: 'from-yellow-500 to-orange-500',
      text: 'text-yellow-600',
      lightBg: 'bg-yellow-50',
      border: 'border-yellow-200',
      progress: 'bg-yellow-500',
    },
    green: {
      bg: 'from-green-500 to-emerald-600',
      text: 'text-green-600',
      lightBg: 'bg-green-50',
      border: 'border-green-200',
      progress: 'bg-green-500',
    },
  };

  const colors = colorClasses[statusColor];

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${colors.border}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-r ${colors.bg} p-2 rounded-lg text-white`}>
              {statusIcon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{budget.category}</h3>
              <p className="text-sm text-gray-600 capitalize">{budget.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(budget)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => budget._id && onDelete(budget._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className={`text-sm font-bold ${colors.text}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${colors.progress} transition-all duration-500 ease-out rounded-full`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                ₹{budget.amount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Budget</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                ₹{spent.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Spent</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                	₹{Math.abs(remaining).toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">
                {remaining >= 0 ? 'Remaining' : 'Over Budget'}
              </div>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Start: {new Date(budget.startDate).toLocaleDateString()}</span>
            {budget.endDate && (
              <span>End: {new Date(budget.endDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;