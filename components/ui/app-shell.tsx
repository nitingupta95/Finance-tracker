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
        <footer className="bg-blue-50 py-5 mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Made by Nitin Gupta ©️2025</p>
          </div>
        </footer>
      )}
    </>
  );
}
