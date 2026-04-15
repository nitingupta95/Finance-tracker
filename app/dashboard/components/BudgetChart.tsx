import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

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
          <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10 transition-transform group-hover:scale-105">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Financial Allocation</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Budget vs Real-time Spending</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-white tracking-tighter">
            {budgetUtilization.toFixed(0)}%
          </div>
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Efficiency</div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#475569" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `₹${value >= 1000 ? (value/1000)+'k' : value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
            />
            <Area
              type="monotone"
              dataKey="budget"
              stroke="#10b981"
              strokeWidth={4}
              fill="url(#budgetGradient)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              name="Target"
            />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="#f43f5e"
              strokeWidth={4}
              fill="url(#spentGradient)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
              name="Actual"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/5">
        <div className="text-center">
          <div className="text-xl font-bold text-white tracking-tight">
             ₹{(currentMonthData?.budget || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Goal</div>
        </div>
        <div className="text-center border-x border-white/5">
          <div className="text-xl font-bold text-rose-400 tracking-tight">
            ₹{(currentMonthData?.spent || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Consumed</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400 tracking-tight">
            ₹{(currentMonthData?.remaining || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Buffer</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
