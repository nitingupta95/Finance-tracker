import React from 'react';
import {  TrendingUp, TrendingDown } from 'lucide-react';

import { LucideIcon } from 'lucide-react'; // or use React.ComponentType if using other icons

export interface SummaryCardProps {
  title: string;
  value: string | React.ReactNode;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon; // OR React.ComponentType if it's not from Lucide
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  trend?: 'up' | 'down' | 'neutral';
}


const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-indigo-500',
    glow: 'rgba(59, 130, 246, 0.5)',
    iconBg: 'bg-blue-500/20 text-blue-400',
  },
  green: {
    bg: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16, 185, 129, 0.5)',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  red: {
    bg: 'from-rose-500 to-red-500',
    glow: 'rgba(244, 63, 94, 0.5)',
    iconBg: 'bg-rose-500/20 text-rose-400',
  },
  purple: {
    bg: 'from-purple-500 to-indigo-500',
    glow: 'rgba(168, 85, 247, 0.5)',
    iconBg: 'bg-purple-500/20 text-purple-400',
  },
  orange: {
    bg: 'from-amber-500 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.5)',
    iconBg: 'bg-amber-500/20 text-amber-400',
  },
};

const  SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  trend = 'neutral'
}) => {
  const colors = colorClasses[color];

  return (
    <div className="glass-card p-6 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colors.iconBg} transition-all duration-300 group-hover:scale-110 shadow-lg shadow-black/20`}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            trend === 'up' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : trend === 'down'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-slate-400 text-sm font-semibold tracking-wide uppercase">{title}</h3>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        {changeLabel && (
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            {changeLabel}
          </p>
        )}
      </div>

      <div className="mt-5 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full bg-gradient-to-r ${colors.bg} rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
          style={{ 
            width: `${Math.min(Math.abs(change || 0) * 2, 100)}%`,
            boxShadow: `0 0 10px ${colors.glow}`
          }}
        />
      </div>
    </div>
  );
};

export default SummaryCard;