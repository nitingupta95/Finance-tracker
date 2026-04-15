"use client";

import React from "react"; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; 
import { Sparkles, ReceiptText, Tag, CreditCard, ChevronRight, Play } from "lucide-react"; 
import { GlassCard } from "./GlassCard";

const HeroSection = () => { 
  return (
    <section className="relative pt-40 pb-20 px-4 overflow-hidden min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/20 blur-[120px] rounded-full" />

      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-medium mb-8 animate-fade-in shadow-xl backdrop-blur-md">
          <Sparkles className="w-3 h-3" />
          <span>The Future of Personal Finance is Here</span>
        </div>

        <h1 className="text-5xl md:text-8xl lg:text-[110px] pb-6 gradient-title leading-[1.1] tracking-tight">
          Master Your Finances <br />
          <span className="text-white">With AI Intelligence</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          The ultimate AI-powered financial platform. Seamlessly track spending,
          scan receipts, and get predictive insights—using your own AI keys for total privacy and control.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-20">
          <Link href="/dashboard">
            <Button size="lg" className="px-10 py-7 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-lg font-bold">
              Start Free Trial
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-10 py-7 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all flex items-center gap-2 text-lg">
            <Play className="w-4 h-4 fill-white text-white" />
            Watch Demo
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 mb-20">
          {[
            { icon: Sparkles, text: "AI Financial Advisor", color: "text-blue-400" },
            { icon: ReceiptText, text: "Smart Receipt Scanner", color: "text-purple-400" },
            { icon: Tag, text: "Auto-Categorization", color: "text-emerald-400" },
            { icon: CreditCard, text: "Subscription Finder", color: "text-orange-400" }
          ].map((pill, i) => (
            <span key={i} className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium text-gray-300 backdrop-blur-xl">
              <pill.icon className={`w-4 h-4 ${pill.color}`} /> 
              {pill.text}
            </span>
          ))}
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="relative mt-10 max-w-6xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20" />
          <GlassCard className="p-2 border-white/20 shadow-2xl overflow-hidden rounded-2xl">
            <Image
              src="/hero-dashboard.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl shadow-2xl border-white/10 mx-auto"
              priority
            />
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
