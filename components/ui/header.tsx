"use client";
import React from "react";
import { Button } from "./button";
import { PenBox, LayoutDashboard, IndianRupee, Sparkles, Settings } from "lucide-react";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  const handleNavigation = (section: string) => {
    if (typeof window === "undefined") return;

    if (window.location.pathname === "/") {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${section}`);
      setTimeout(() => {
        const element = document.getElementById(section);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-xl z-50 border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
             <IndianRupee size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase">Welth</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard" className={cn("text-[10px] font-black uppercase tracking-widest transition-all", pathname === '/dashboard' ? 'text-blue-500' : 'text-slate-500 hover:text-white')}>
                Dashboard
              </Link>
              <Link href="/budget" className={cn("text-[10px] font-black uppercase tracking-widest transition-all", pathname === '/budget' ? 'text-blue-500' : 'text-slate-500 hover:text-white')}>
                Budgets
              </Link>
              <Link href="/transaction" className={cn("text-[10px] font-black uppercase tracking-widest transition-all", pathname === '/transaction' ? 'text-blue-500' : 'text-slate-500 hover:text-white')}>
                Transactions
              </Link>
            </>
          ) : (
            <>
              <button onClick={() => handleNavigation("features")} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                Features
              </button>
              <button onClick={() => handleNavigation("testimonials")} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                Testimonials
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isLoaded && isSignedIn && (
            <>
              <Link href="/ai-advisor" className="hidden sm:block">
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-10 gap-2 border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest rounded-xl",
                    pathname === '/ai-advisor' && "bg-blue-600 text-white"
                  )}
                >
                  <Sparkles size={14} />
                  <span>AI Advisor</span>
                </Button>
              </Link>

              <Link href="/settings">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "h-10 w-10 text-slate-500 hover:text-white hover:bg-white/5 transition-all rounded-xl",
                    pathname === '/settings' && "text-white bg-white/10"
                  )}
                >
                  <Settings size={18} />
                </Button>
              </Link>
            </>
          )}

          {isLoaded && !isSignedIn && (
            <SignInButton forceRedirectUrl="/dashboard">
              <Button className="h-11 px-8 bg-white text-slate-950 hover:bg-blue-600 hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-white/5">
                Initialize Access
              </Button>
            </SignInButton>
          )}

          {isLoaded && isSignedIn && (
            <div className="pl-4 border-l border-white/10 ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border border-white/20 rounded-xl",
                  },
                }}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
