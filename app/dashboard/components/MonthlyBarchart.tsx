'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface MonthlyBarChartProps {
  data: MonthlyData[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: {
    name: string;
    value: number;
    payload: MonthlyData;
    color: string;
  }[];
  label?: string;
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ data = [] }) => {
  const monthMap = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const currentMonthName = new Date().toLocaleString('default', { month: 'short' });
  const currentMonth = data.find(item => item.month === currentMonthName) || data[data.length - 1] || null;

  const currentMonthIndex = monthMap.indexOf(currentMonth?.month || '');
  const previousMonthName = currentMonthIndex > 0 ? monthMap[currentMonthIndex - 1] : '';
  const previousMonth = data.find(item => item.month === previousMonthName) || null;

  const netChange = currentMonth && previousMonth
    ? currentMonth.net - previousMonth.net
    : 0;
  const isPositiveChange = netChange >= 0;

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="font-bold text-slate-500 mb-2 uppercase tracking-widest text-[9px]">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                   <span className="text-[10px] font-bold text-white uppercase tracking-wide">{entry.name}</span>
                </div>
                <span className="text-sm font-black text-white tabular-nums">
                  ₹{Number(entry.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-blue-400">
            <BarChart3 size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight uppercase leading-tight">Flow Analysis</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Monthly Liquidity Trend</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className={`flex items-center sm:justify-end gap-2 ${isPositiveChange ? 'text-emerald-500' : 'text-rose-500'} font-black text-xl tracking-tight tabular-nums`}>
            {isPositiveChange ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <span>₹{Math.abs(netChange).toLocaleString()}</span>
          </div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Net Momentum</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#475569"
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: '#64748b' }}
            />
            <YAxis
              stroke="#475569"
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `₹${value >= 1000 ? (value/1000)+'k' : value}`}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar
              dataKey="income"
              fill="#3b82f6"
              name="Inflow"
              radius={[4, 4, 0, 0]}
              barSize={20}
              animationDuration={1200}
            />
            <Bar
              dataKey="expenses"
              fill="#ef4444"
              name="Outflow"
              radius={[4, 4, 0, 0]}
              barSize={20}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/5">
        <div className="text-center group">
          <div className="text-2xl font-black text-white tabular-nums group-hover:text-blue-400 transition-colors">
            <span className="text-slate-600 text-sm font-bold mr-1">₹</span>
            {(currentMonth?.income ?? 0).toLocaleString()}
          </div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">Total Inflow</div>
        </div>
        <div className="text-center border-y sm:border-y-0 sm:border-x border-white/5 py-4 sm:py-0 group">
          <div className="text-2xl font-black text-rose-500 tabular-nums">
            <span className="text-slate-600 text-sm font-bold mr-1">₹</span>
            {(currentMonth?.expenses ?? 0).toLocaleString()}
          </div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">Confirmed Drain</div>
        </div>
        <div className="text-center group">
          <div className={cn("text-2xl font-black tabular-nums", isPositiveChange ? 'text-emerald-500' : 'text-rose-500')}>
            <span className="text-slate-600 text-sm font-bold mr-1">₹</span>
            {Math.abs(currentMonth?.net ?? 0).toLocaleString()}
          </div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">Net Surplus</div>
        </div>
      </div>
    </div>
  );
};

// Helper for classes 
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default MonthlyBarChart;
