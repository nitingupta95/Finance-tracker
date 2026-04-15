"use client";

import React, { useState, useEffect } from "react";
import { Bell, Search, HelpCircle, X, ChevronRight, MessageSquare, Terminal, Zap, Shield, FileText, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Notifications ---
export function NotificationFeed() {
  const [isOpen, setIsOpen] = useState(false);
  const logs = [
    { id: 1, type: "system", title: "Budget Protocol Active", description: "Monthly allocation verified across all centers.", time: "02m ago", icon: Shield, color: "text-emerald-500" },
    { id: 2, type: "ai", title: "AI Strategy Synthesized", description: "New optimization vector identified for 'Discretionary' spend.", time: "15m ago", icon: Zap, color: "text-blue-500" },
    { id: 3, type: "security", title: "Encryption Bridge Verified", description: "Secure API tunnel status: ACTIVE.", time: "1h ago", icon: Activity, color: "text-blue-400" },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2.5 rounded-xl transition-all border border-transparent hover:border-white/5",
          isOpen ? "bg-white/5 text-white" : "text-slate-500 hover:text-white"
        )}
      >
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_#2563eb]" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-96 bg-slate-950 border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
             <div className="bg-slate-900/50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-white tracking-wider uppercase">Operational Logs</h3>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">3 Active Events</span>
             </div>
             <div className="p-2">
                {logs.map((log) => (
                  <div key={log.id} className="group p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer flex gap-4">
                     <div className={cn("mt-1", log.color)}>
                        <log.icon size={16} />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                           <h4 className="text-[10px] font-bold text-white tracking-wider">{log.title}</h4>
                           <span className="text-[9px] font-bold text-slate-600 uppercase">{log.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight opacity-70">
                           {log.description}
                        </p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-4 bg-slate-900/30 border-t border-white/5 text-center">
                <button className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] hover:text-white transition-colors">
                   Clear Signal History
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Help ---
export function HelpPortal() {
  const [isOpen, setIsOpen] = useState(false);
  const helpItems = [
    { title: "Protocol Overview", icon: FileText, desc: "System architecture documentation" },
    { title: "Terminal Shortcuts", icon: Terminal, desc: "Quick keyboard command index" },
    { title: "Intelligence Support", icon: MessageSquare, desc: "Direct intelligence core bridge" },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2.5 rounded-xl transition-all border border-transparent hover:border-white/5",
          isOpen ? "bg-white/5 text-white" : "text-slate-500 hover:text-white"
        )}
      >
        <HelpCircle size={20} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-slate-950 border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
             <div className="p-2">
                {helpItems.map((item, idx) => (
                  <div key={idx} className="group p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="text-slate-500 group-hover:text-blue-500 transition-colors">
                           <item.icon size={18} />
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{item.title}</h4>
                           <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight mt-0.5">{item.desc}</p>
                        </div>
                     </div>
                     <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-500 translate-x-0 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
             </div>
             <div className="p-6 bg-blue-600/5 text-center">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">System version 4.0.2-FINAL</p>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto" />
             </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Global Search / Command Palette ---
export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : null; // Handled by parent but good to have
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:pt-32">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
         <div className="flex items-center px-6 py-5 border-b border-white/5 bg-slate-950/50">
            <Search className="text-blue-500 mr-4" size={20} />
            <input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Execute Global Search Protocol (Ctrl+K)..."
              className="flex-1 bg-transparent border-none outline-none text-lg text-white font-bold placeholder:text-slate-700 tracking-tight"
            />
            <button onClick={onClose} className="text-slate-700 hover:text-white transition-colors">
               <X size={20} />
            </button>
         </div>
         
         <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
            {!query ? (
               <div className="p-8 text-center space-y-6">
                  <div className="bg-blue-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 text-blue-500">
                     <Search size={32} />
                  </div>
                  <div>
                     <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-2">Intelligence Bridge Active</h3>
                     <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto opacity-60">
                        Scan for transactions, budget centers, and behavioral insights across the institutional grid.
                     </p>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                     <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-[10px] font-black text-blue-500">ESC</kbd>
                        <span className="text-[9px] font-black text-slate-700 uppercase">to Close</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-[10px] font-black text-blue-500">↑↓</kbd>
                        <span className="text-[9px] font-black text-slate-700 uppercase">to Navigate</span>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="space-y-4 py-4">
                  <div className="px-4">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-4">Neural Matching Results</p>
                     <div className="flex flex-col gap-2">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="group p-4 bg-slate-950/50 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all cursor-pointer flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:border-blue-500/20 transition-all">
                                    <Activity size={18} />
                                 </div>
                                 <div>
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Historical Vector MATCH_{i}</h4>
                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight mt-0.5">Scanned from transactional database buffer</p>
                                 </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-800 transition-colors group-hover:text-blue-500" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
         </div>
         
         <div className="bg-slate-950/80 px-8 py-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="text-blue-500"><Terminal size={12} /></span>
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest uppercase">Encryption Tunnel: ACTIVE</span>
            </div>
            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Protocol V4.0</span>
         </div>
      </div>
    </div>
  );
}
