import React from 'react';
import { Edit, Trash2, AlertTriangle, CheckCircle, Clock, IndianRupee } from 'lucide-react';
import { Budget } from "../types/budget";
import { cn } from "@/lib/utils";

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

  const statusColor = getStatusColor();

  const colorVariants = {
    red: {
      text: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      progress: "bg-rose-500",
      icon: <AlertTriangle size={18} />
    },
    yellow: {
      text: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      progress: "bg-amber-500",
      icon: <Clock size={18} />
    },
    green: {
      text: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      progress: "bg-emerald-500",
      icon: <CheckCircle size={18} />
    }
  };

  const theme = colorVariants[statusColor];

  return (
    <div className="fintech-card p-6 rounded-2xl group relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
             <IndianRupee size={18} />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">{budget.category}</h3>
            <p className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">Active Allocation</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => budget._id && onDelete(budget._id)}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Utilization */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-slate-500 tracking-wider leading-none">Utilization</span>
          <span className={cn("text-2xl font-bold tracking-tight tabular-nums leading-none", theme.text)}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
          <div
            className={cn("h-full transition-all duration-1000 ease-out rounded-full", theme.progress)}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4">
          <div className="text-center">
            <div className="text-sm font-bold text-white tabular-nums">₹{budget.amount.toLocaleString()}</div>
            <div className="text-[9px] text-slate-500 font-bold tracking-wider mt-1 opacity-60">Limit</div>
          </div>
          <div className="text-center border-x border-white/5">
            <div className="text-sm font-bold text-rose-500 tabular-nums">₹{spent.toLocaleString()}</div>
            <div className="text-[9px] text-slate-500 font-bold tracking-wider mt-1 opacity-60">Burn</div>
          </div>
          <div className="text-center">
             <div className={cn("text-sm font-bold tabular-nums", remaining >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
              ₹{Math.abs(remaining).toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-500 font-bold tracking-wider mt-1 opacity-60">
              {remaining >= 0 ? 'Buffer' : 'Deficit'}
            </div>
          </div>
        </div>
      </div>

      {/* Meta Footer */}
      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-bold text-slate-500 tracking-widest">
        <span>Start: {new Date(budget.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        {budget.endDate && (
          <span>End: {new Date(budget.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;