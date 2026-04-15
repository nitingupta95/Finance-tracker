import React from "react";
import { Sparkles, TrendingUp, AlertCircle, PieChart, ShieldCheck } from "lucide-react";
import { GlassCard } from "./GlassCard";

export const AIAdvisorSpotlight = () => {
  return (
    <section className="py-32 bg-black relative overflow-hidden text-white">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-600/10 blur-[150px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left Side: Content */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Financial Intelligence</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              An AI That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Really Knows You.
              </span>
            </h2>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Our advanced AI advisor analyzes your spending patterns across all categories to provide clear, actionable advice. No generic tips—just pure financial intelligence.
            </p>

            <ul className="space-y-4">
              {[
                { icon: TrendingUp, text: "Predictive cash flow analysis for next month" },
                { icon: AlertCircle, text: "Instant alerts for unusual spending spikes" },
                { icon: PieChart, text: "Automated budget adjustments based on habits" },
                { icon: ShieldCheck, text: "Privacy-first approach with your own AI keys" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-300">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-indigo-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Visual Chat UI */}
          <div className="flex-1 w-full max-w-xl">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <GlassCard className="p-8 space-y-6 border-white/20 shadow-2xl relative">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">AI Advisor</h4>
                    <p className="text-xs text-indigo-400">Online & Analyzing</p>
                  </div>
                </div>

                {/* Message 1 */}
                <div className="space-y-2 max-w-[85%] self-start">
                  <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 text-sm text-gray-300 leading-relaxed">
                    "I've noticed your 'Dining Out' expenses are 22% higher than last month. At this rate, you'll exceed your budget by ₹4,500."
                  </div>
                  <p className="text-[10px] text-gray-500 px-1">2m ago</p>
                </div>

                {/* Message 2 (Recommendation Card) */}
                <div className="space-y-2 max-w-[90%] self-end ml-auto">
                  <GlassCard className="p-4 border-indigo-500/30 bg-indigo-500/5 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                      <TrendingUp className="w-4 h-4" />
                      Smart Suggestion
                    </div>
                    <p className="text-sm text-gray-200">
                      Transfer ₹5,000 to your 'Emergency Fund'. I calculate a 95% chance of achieving your quarterly goal if you do this now.
                    </p>
                    <button className="w-full py-2 rounded-lg bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-colors">
                      Execute Transfer
                    </button>
                  </GlassCard>
                </div>

                {/* User Input Shadow */}
                <div className="pt-4">
                  <div className="px-5 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-gray-500 flex items-center justify-between">
                    <span>Ask your AI advisor...</span>
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
