"use client";
import React from "react";
import { Button } from "./button";
import { PenBox, LayoutDashboard, IndianRupee, Sparkles, Settings } from "lucide-react";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

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
    <header className="fixed top-0 w-full bg-slate-950/50 backdrop-blur-2xl z-50 border-b border-white/5">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="https://res.cloudinary.com/dugygdmtz/image/upload/v1751709885/Screenshot_2025-07-05_153429_f1idjd.png"
            alt="Logo"
            width={50}
            height={50}
            className="h-10 w-auto object-contain rounded-full shadow-lg shadow-indigo-500/20"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoaded && isSignedIn && (
            <>
              <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/dashboard' ? 'text-white' : 'text-slate-400'}`}>
                Dashboard
              </Link>
              <Link href="/budget" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/budget' ? 'text-white' : 'text-slate-400'}`}>
                Budgets
              </Link>
              <Link href="/transaction" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/transaction' ? 'text-white' : 'text-slate-400'}`}>
                Transactions
              </Link>
            </>
          )}
          {isLoaded && !isSignedIn && (
            <>
              <button
                onClick={() => handleNavigation("features")}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => handleNavigation("testimonials")}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Testimonials
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoaded && isSignedIn && (
            <>
              <Link href="/ai-advisor" className="hidden sm:block">
                <Button 
                  variant="outline" 
                   className={`h-9 gap-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white transition-all ${pathname === '/ai-advisor' ? 'bg-indigo-500 text-white' : ''}`}
                >
                  <Sparkles size={16} />
                  <span className="hidden lg:inline">AI Advisor</span>
                </Button>
              </Link>

              <Link href="/settings">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`h-9 w-9 text-slate-400 hover:text-white hover:bg-white/5 transition-all ${pathname === '/settings' ? 'text-white bg-white/10' : ''}`}
                >
                  <Settings size={18} />
                </Button>
              </Link>
            </>
          )}

          {isLoaded && !isSignedIn && (
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="default" className="bg-white text-slate-950 hover:bg-slate-200 font-bold">
                Get Started
              </Button>
            </SignInButton>
          )}

          {isLoaded && isSignedIn && (
            <div className="pl-2 border-l border-white/10">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border border-white/20",
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
