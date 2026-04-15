"use client";
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
  IndianRupee,
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
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
          <p className="font-bold text-slate-400 mb-2 uppercase tracking-widest text-[10px]">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}80` }} />
                   <span className="text-xs font-bold text-white">{entry.name}</span>
                </div>
                <span className="text-sm font-black text-white">
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

  const renderCurrencyTick = ({ x, y, payload }: { x: number; y: number; payload: { value: number } }) => {
    return (
      <text
        x={x}
        y={y}
        dy={4}
        textAnchor="end"
        fill="#475569"
        fontSize={11}
        fontWeight="bold"
      >
        ₹{payload.value >= 1000 ? (payload.value/1000)+'k' : payload.value}
      </text>
    );
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Flow Analysis</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Monthly Liquidity Trend</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className={`flex items-center sm:justify-end gap-2 ${isPositiveChange ? 'text-emerald-400' : 'text-rose-400'} font-black text-xl tracking-tight`}>
            {isPositiveChange ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span>₹{Math.abs(netChange).toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Net Momentum</div>
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
              fontSize={11}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={renderCurrencyTick}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar
              dataKey="income"
              fill="#6366f1"
              name="Inflow"
              radius={[6, 6, 0, 0]}
              barSize={24}
              animationDuration={1500}
            />
            <Bar
              dataKey="expenses"
              fill="#f43f5e"
              name="Outflow"
              radius={[6, 6, 0, 0]}
              barSize={24}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/5">
        <div className="text-center group">
          <div className="text-2xl font-black text-white flex items-center justify-center gap-1 group-hover:text-indigo-400 transition-colors">
            <span className="text-slate-600 text-sm font-bold">₹</span>
            {(currentMonth?.income ?? 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Total Inflow</div>
        </div>
        <div className="text-center border-y sm:border-y-0 sm:border-x border-white/5 py-4 sm:py-0 group">
          <div className="text-2xl font-black text-rose-400 flex items-center justify-center gap-1 group-hover:scale-110 transition-transform">
            <span className="text-slate-600 text-sm font-bold">₹</span>
            {(currentMonth?.expenses ?? 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Current Drain</div>
        </div>
        <div className="text-center group">
          <div className={`text-2xl font-black flex items-center justify-center gap-1 transition-all ${isPositiveChange ? 'text-emerald-400 group-hover:neon-glow' : 'text-rose-400'} rounded-lg`}>
            <span className="text-slate-600 text-sm font-bold">₹</span>
            {Math.abs(currentMonth?.net ?? 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Net Surplus</div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
