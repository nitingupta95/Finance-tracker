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
      bg: 'from-rose-500 to-red-500',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/20',
      iconBg: 'bg-rose-500/20 text-rose-400',
      progress: 'bg-rose-500',
    },
    yellow: {
      bg: 'from-amber-400 to-orange-500',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      iconBg: 'bg-amber-500/20 text-amber-400',
      progress: 'bg-amber-500',
    },
    green: {
      bg: 'from-emerald-400 to-teal-500',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      progress: 'bg-emerald-500',
    },
  };

  const colors = colorClasses[statusColor];

  return (
    <div className="glass-card group p-6 relative overflow-hidden">
      {/* Glow Effect */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:opacity-30 ${colors.bg.replace('from-', 'bg-')}`}></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${colors.iconBg} border border-white/5 shadow-inner`}>
            {React.cloneElement(statusIcon as React.ReactElement, { className: 'w-5 h-5' })}
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">{budget.category}</h3>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">{budget.period}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => budget._id && onDelete(budget._id)}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Utilization</span>
          <span className={`text-xl font-black ${colors.text} tracking-tighter`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        
        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/5 shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${colors.bg} transition-all duration-1000 ease-out rounded-full`}
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              boxShadow: `0 0 15px ${colors.text}40`
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <div className="text-sm font-bold text-white">₹{budget.amount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Limit</div>
          </div>
          <div className="text-center border-x border-white/5">
            <div className="text-sm font-bold text-rose-400">₹{spent.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Burn</div>
          </div>
          <div className="text-center">
             <div className={`text-sm font-bold ${remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{Math.abs(remaining).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              {remaining >= 0 ? 'Slack' : 'Excess'}
            </div>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-tight">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-slate-700"></div>
          <span>Start: {new Date(budget.startDate).toLocaleDateString()}</span>
        </div>
        {budget.endDate && (
          <div className="flex items-center gap-1.5">
            <span>End: {new Date(budget.endDate).toLocaleDateString()}</span>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;