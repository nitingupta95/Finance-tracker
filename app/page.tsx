import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import HeroSection from "@/components/ui/Hero";
import { FeaturesGrid } from "@/components/ui/FeaturesGrid";
import { AIAdvisorSpotlight } from "@/components/ui/AIAdvisorSpotlight";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { Testimonials } from "@/components/ui/Testimonials";

export const metadata = {
  title: "Welth - AI-Powered Financial Intelligence",
  description: "Take control of your financial future with the world's most advanced AI-powered finance manager.",
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Special AI Spotlight Section */}
      <AIAdvisorSpotlight />

      {/* Workflow Section */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA Section */}
      <section className="py-32 relative overflow-hidden bg-black pb-48">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full -z-10" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-semibold mb-2 neon-glow">
              <Sparkles className="w-4 h-4" />
              <span>Ready for Financial Mastery?</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Stop Guessing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Start Building Wealth.
              </span>
            </h2>
            
            <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who are already managing their finances smarter with Welth. Your journey to financial freedom starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-10 py-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 text-xl font-bold flex items-center gap-3"
                >
                  Get Started Now
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-10 py-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all text-xl"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>

            <p className="text-gray-500 text-sm font-medium pt-8">
              No credit card required • GDPR Compliant • Private & Secure
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;