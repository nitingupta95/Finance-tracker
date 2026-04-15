'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  PieLabelRenderProps,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload: CategoryData;
  }[];
}

// ✅ FIXED: CustomLabel must be a plain function, not React.FC
function CustomLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: PieLabelRenderProps & { percent?: number }) {
  if ((percent ?? 0) < 0.05) return null;

  const RADIAN = Math.PI / 180;
  const inner = Number(innerRadius);
  const outer = Number(outerRadius);
  const radius = inner + (outer - inner) * 0.5;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > Number(cx) ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
}

const COLORS = [
  '#6366f1', '#f43f5e', '#10b981', '#fbbf24', '#a855f7',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#4f46e5',
];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
          <p className="font-bold text-white mb-1 uppercase tracking-widest text-[10px] opacity-60">{item.name}</p>
          <p className="text-xl font-black text-white">
            ₹{item.value.toLocaleString()}
          </p>
          <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500" style={{ width: `${percentage}%` }}></div>
          </div>
          <p className="text-[10px] font-bold text-indigo-400 mt-1 uppercase">{percentage}% Share</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-purple-500/20 p-3 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
          <PieChartIcon className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Category Intelligence</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Distribution of Capital</p>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              labelLine={false}
              label={CustomLabel}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="grid grid-cols-2 gap-4">
          {data.slice(0, 6).map((item, index) => (
            <div key={item.name} className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                  style={{ 
                    backgroundColor: COLORS[index % COLORS.length],
                    boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}80`
                  }}
                />
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors truncate">{item.name}</span>
              </div>
              <span className="text-sm font-black text-white ml-2">
                ₹{item.value.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
