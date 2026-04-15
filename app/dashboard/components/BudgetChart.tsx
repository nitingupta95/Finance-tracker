import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BudgetData {
  month: string;
  budget: number;
  spent: number;
  remaining: number;
}

interface BudgetChartProps {
  data: BudgetData[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const chartData = data.filter(item => item.budget > 0);
    
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const currentMonthData = chartData.find(b => b.month === currentMonth) || chartData[chartData.length - 1];
    
  const budgetUtilization = currentMonthData 
      ? (currentMonthData.spent / currentMonthData.budget) * 100 
      : 0;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-500">
            <Target size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight leading-tight uppercase">Spending Velocity</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Budget Allocation Focus</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white tracking-tight tabular-nums">
            {budgetUtilization.toFixed(0)}%
          </div>
          <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Utilization</div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              fontSize={10} 
              fontWeight="bold"
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `₹${value >= 1000 ? (value/1000)+'k' : value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              }}
              itemStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
            />
            <Area
              type="monotone"
              dataKey="budget"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#budgetGradient)"
              activeDot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
              name="Target"
            />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="#ef4444"
              strokeWidth={3}
              fill="url(#spentGradient)"
              activeDot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }}
              name="Actual"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/5">
        <div className="text-center">
          <div className="text-xl font-bold text-white tabular-nums">
             ₹{(currentMonthData?.budget || 0).toLocaleString()}
          </div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">Goal Cap</div>
        </div>
        <div className="text-center border-x border-white/5 px-2">
          <div className="text-xl font-bold text-rose-500 tabular-nums">
            ₹{(currentMonthData?.spent || 0).toLocaleString()}
          </div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">Burned</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-500 tabular-nums">
            ₹{(currentMonthData?.remaining || 0).toLocaleString()}
          </div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">Buffer</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
