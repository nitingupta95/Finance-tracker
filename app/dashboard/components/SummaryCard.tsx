import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface SummaryCardProps {
  title: string;
  value: string | React.ReactNode;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  trend?: 'up' | 'down' | 'neutral';
}

const colorVariants = {
  blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  green: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  red: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  orange: "text-amber-500 bg-amber-500/10 border-amber-500/20",
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  trend = 'neutral'
}) => {
  return (
    <div className="fintech-card p-5 rounded-2xl group flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110", colorVariants[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums border",
            trend === 'up' 
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
              : trend === 'down'
              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
              : "bg-slate-800 text-slate-400 border-white/5"
          )}>
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-slate-500 text-[10px] font-bold tracking-wider">{title}</p>
        <div className="text-2xl font-bold text-white tracking-tight tabular-nums truncate">
          {value}
        </div>
        {changeLabel && (
          <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 mt-1">
            <span className={cn("w-1.5 h-1.5 rounded-full", trend === 'up' ? "bg-emerald-500" : trend === 'down' ? "bg-rose-500" : "bg-slate-700")} />
            {changeLabel}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;