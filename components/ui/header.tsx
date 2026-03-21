"use client";
import React from "react";
import { Button } from "./button";
import { PenBox, LayoutDashboard, IndianRupee } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

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
            className="h-12 object-contain rounded-full"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
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
          </SignedOut>
        </div>

        <div className="flex items-center space-x-4">
          <SignedIn>
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
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
