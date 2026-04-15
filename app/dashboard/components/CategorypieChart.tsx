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
      fontSize={11}
      fontWeight="bold"
      className="tabular-nums"
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#4f46e5',
];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="font-bold text-slate-500 mb-1 uppercase tracking-widest text-[9px]">{item.name}</p>
          <p className="text-xl font-black text-white tabular-nums">
            ₹{item.value.toLocaleString()}
          </p>
          <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }}></div>
          </div>
          <p className="text-[9px] font-bold text-blue-400 mt-2 uppercase tracking-wide">{percentage}% Volume</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 shadow-lg text-blue-400">
          <PieChartIcon size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight leading-tight uppercase">Category Distribution</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Capital Segmentation</p>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              labelLine={false}
              label={CustomLabel}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1200}
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
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {data.slice(0, 6).map((item, index) => (
            <div key={item.name} className="group flex items-center justify-between py-1 transition-all">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase truncate">{item.name}</span>
              </div>
              <span className="text-xs font-black text-white tabular-nums">
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
