"use client";

import React from "react"; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; 
import { Sparkles, ReceiptText, Tag, CreditCard } from "lucide-react"; 

const HeroSection = () => { 
  return (
    <section className="pt-40 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Finances <br />
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The ultimate AI-powered financial management platform. Seamlessly track spending,
          scan receipts, auto-categorize transactions, and get predictive insights—using your own AI keys!
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 mb-4 " variant="destructive">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 mb-10 text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1.5 bg-gray-100/80 px-4 py-2 rounded-full border border-gray-200"><Sparkles className="w-4 h-4 text-blue-500" /> AI Financial Advisor</span>
          <span className="flex items-center gap-1.5 bg-gray-100/80 px-4 py-2 rounded-full border border-gray-200"><ReceiptText className="w-4 h-4 text-purple-500" /> Smart Receipt Scanner</span>
          <span className="flex items-center gap-1.5 bg-gray-100/80 px-4 py-2 rounded-full border border-gray-200"><Tag className="w-4 h-4 text-green-500" /> Auto-Categorization</span>
          <span className="flex items-center gap-1.5 bg-gray-100/80 px-4 py-2 rounded-full border border-gray-200"><CreditCard className="w-4 h-4 text-orange-500" /> Subscription Finder</span>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div className="hero-image">
            <Image
              src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
              unoptimized // 🔄 Optional: remove this if you want Next.js to optimize
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
