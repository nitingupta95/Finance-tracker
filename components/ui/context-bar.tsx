"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const ContextBar = () => {
   const pathname = usePathname();
   
   const getPageTitle = () => {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length === 0) return 'Platform Overview';
      const lastPart = parts[parts.length - 1];
      return lastPart
         .split('-')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');
   };

   return (
      <div className="fixed top-0 right-0 left-20 md:left-64 h-16 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 z-40 px-8 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-white tracking-wide">
               {getPageTitle()}
            </h1>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">
               Private Institutional Node
            </span>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="text-[9px] font-bold text-emerald-500/80 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
               System Synchronized
            </div>
         </div>
      </div>
   );
};
