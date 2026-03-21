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
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dugygdmtz/image/upload/v1751709885/Screenshot_2025-07-05_153429_f1idjd.png"
            alt="Logo"
            width={60}
            height={60}
            className="h-12 w-auto object-contain rounded-full"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {isLoaded && !isSignedIn && (
            <>
              <button
                onClick={() => handleNavigation("features")}
                className="text-gray-600 hover:text-blue-600"
              >
                Features
              </button>
              <button
                onClick={() => handleNavigation("testimonials")}
                className="text-gray-600 hover:text-blue-600"
              >
                Testimonials
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isLoaded && isSignedIn && (
            <>
              <Link href="/budget">
                <Button 
                  variant="outline"
                  className={pathname === '/budget' ? 'bg-black text-white hover:bg-black/90 hover:text-white cursor-pointer' : 'hover:cursor-pointer '}
                >
                  <IndianRupee size={18} />
                  <span className="hidden md:inline">Budget</span>
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button 
                  variant="outline"
                  className={pathname === '/dashboard' ? 'bg-black text-white hover:bg-black/90 hover:text-white cursor-pointer' : 'hover:cursor-pointer '}
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <Link href="/transaction">
                <Button 
                  variant="outline" 
                  className={`flex hover:cursor-pointer items-center gap-2 ${pathname === '/transaction' ? 'bg-black text-white hover:bg-black/90 hover:text-white cursor-pointer' : ''}`}
                >
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>

              <Link href="/ai-advisor">
                <Button 
                  variant="outline" 
                  className={`flex hover:cursor-pointer items-center gap-2 border-blue-200 hover:border-blue-300 ${pathname === '/ai-advisor' ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 cursor-pointer hover:text-white' : 'text-blue-600'}`}
                >
                  <Sparkles size={18} className={pathname === '/ai-advisor' ? 'text-white' : 'text-blue-500'} />
                  <span className="hidden xl:inline">AI Advisor</span>
                </Button>
              </Link>

              <Link href="/settings">
                <Button 
                  variant="outline" 
                  title="AI Settings"
                  className={`flex hover:cursor-pointer px-3 items-center gap-2 ${pathname === '/settings' ? 'bg-black text-white hover:bg-black/90 cursor-pointer hover:text-white' : ''}`}
                >
                  <Settings size={18} />
                </Button>
              </Link>
            </>
          )}

          {isLoaded && !isSignedIn && (
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          )}

          {isLoaded && isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
