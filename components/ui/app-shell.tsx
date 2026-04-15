"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import { Sidebar } from "./sidebar";
import { ContextBar } from "./context-bar";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  // Pages that use the legacy top-nav (Landing, Sign-in, Sign-up)
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  const useTraditionalLayout = isLandingPage || isAuthPage;

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden selection:bg-blue-500/30">
      {!useTraditionalLayout && isSignedIn && <Sidebar />}
      
      <div className={cn(
        "flex-1 flex flex-col min-h-screen overflow-y-auto overflow-x-hidden",
        !useTraditionalLayout && isSignedIn ? "md:pl-0" : ""
      )}>
        {/* Render Sidebar-specific layout or Traditional Header layout */}
        {useTraditionalLayout ? (
           <>
             {!isAuthPage && <Header />}
             <main className={cn(
               "flex-1",
               isAuthPage ? "flex flex-col items-center justify-center min-h-screen" : "pt-24"
             )}>
               {children}
             </main>
           </>
        ) : (
          <div className={cn(
            "transition-all duration-300",
            isSignedIn ? "pl-[80px] md:pl-[var(--sidebar-width)]" : "" 
          )}>
            <style jsx global>{`
               :root {
                 --sidebar-width: 280px;
               }
               .sidebar-collapsed {
                 --sidebar-width: 80px;
               }
            `}</style>
            
            <ContextBar />
            <main className="p-8 md:p-12 max-w-7xl pt-24 md:pt-28">
               {children}
            </main>
          </div>
        )}

        {isLandingPage && (
          <footer className="py-12 bg-slate-950 border-t border-white/5 mt-auto">
            <div className="container mx-auto px-6 text-center">
              <div className="flex flex-col items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                       <span className="text-white font-bold text-xs">W</span>
                    </div>
                    <span className="text-white font-bold text-sm tracking-tight">Welth</span>
                 </div>
                <p className="text-slate-600 text-[10px] font-bold tracking-wider">
                   Institutional Grade Financial Intelligence • ©️2025
                </p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
