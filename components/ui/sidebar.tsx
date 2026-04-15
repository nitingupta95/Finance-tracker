"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PiggyBank, 
  History, 
  Sparkles, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  IndianRupee,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Budgets", href: "/budget", icon: PiggyBank },
  { name: "Transactions", href: "/transaction", icon: History },
  { name: "AI Advisor", href: "/ai-advisor", icon: Sparkles },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setIsCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  if (!isMounted) return null;

  return (
    <div 
      className={cn(
        "flex flex-col h-screen fixed left-0 top-0 z-50 bg-slate-950 border-r border-white/5 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 h-20">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3 group transition-opacity">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <IndianRupee size={18} className="text-white" />
             </div>
             <span className="text-2xl font-bold text-white tracking-tight uppercase premium-gradient-text">Welth</span>
          </Link>
        )}
        {isCollapsed && (
           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <IndianRupee size={18} className="text-white" />
           </div>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-slate-950 hover:bg-blue-500 transition-all z-50 shadow-lg shadow-blue-500/20 hover:scale-110"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-10 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-blue-600/10 text-blue-500 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]" 
                  : "text-slate-500 hover:text-white hover:bg-white/[0.02]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-blue-600 text-white shadow-lg" : "bg-white/5 text-slate-500"
                )}>
                  <item.icon size={18} />
                </div>
                {!isCollapsed && (
                  <span className={cn(
                    "text-sm font-bold tracking-tight transition-colors",
                    isActive ? "text-white" : "text-slate-500"
                  )}>
                    {item.name}
                  </span>
                )}
              </div>
              {isActive && (
                <div
                  className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Footer Section */}
      <div className="p-4 border-t border-white/5 bg-slate-950/50">
        <div className={cn(
          "flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.05]",
          isCollapsed ? "justify-center px-0" : "px-4"
        )}>
          <UserButton 
  appearance={{
    elements: {
      avatarBox: "w-9 h-9 border border-white/10 rounded-xl",

      // Main card
      userButtonPopoverCard:
        "bg-[#0b0f1a] border border-white/10 text-white shadow-xl",

      // User info (top section)
      userPreviewMainIdentifier: "text-white !text-white",
      userPreviewSecondaryIdentifier: "text-gray-400 !text-gray-400",

      // Buttons (THIS is where your issue is)
      userButtonPopoverActionButton:
        "text-white hover:bg-white/10 !text-white",

      userButtonPopoverActionButtonText:
        "!text-white",

      userButtonPopoverActionButtonIcon:
        "text-white",

      // Footer
      userButtonPopoverFooter: "text-gray-400",

      // Extra force (important for Clerk overrides)
      userButtonPopoverBody: "text-white",
    }
  }}
/>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-white truncate">{user?.fullName || user?.username}</p>
               <p className="text-[10px] text-slate-600 font-bold truncate uppercase tracking-widest mt-0.5">Authorized User</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
