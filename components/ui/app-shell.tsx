"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Check if we are on the sign-in or sign-up page
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  return (
    <>
      {!isAuthPage && <Header />}
      
      <main className={!isAuthPage ? "min-h-screen" : "flex items-center justify-center min-h-screen"}>
        {children}
      </main>

      {!isAuthPage && (
        <footer className="py-8 bg-slate-950 border-t border-white/5 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-slate-500 text-sm font-medium">Made by Nitin Gupta ©️2025</p>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
              <p className="text-slate-600 text-xs">A Premium Financial Intelligence Platform</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
