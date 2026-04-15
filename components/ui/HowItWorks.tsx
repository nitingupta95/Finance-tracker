import React from "react";
import { howItWorksData } from "@/data";
import { GlassCard } from "./GlassCard";

export const HowItWorks = () => {
  return (
    <section className="py-32 bg-black relative">
       <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-20 tracking-tight">
          Three Simple Steps to <br />
          <span className="text-indigo-400">Financial Freedom</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-px bg-white/10 -z-0" />
          
          {howItWorksData.map((step, index) => (
            <div key={index} className="text-center relative z-10 group">
              <div className="w-20 h-20 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 backdrop-blur-xl group-hover:scale-110 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/30 transition-all duration-300 neon-glow">
                <div className="text-indigo-400">
                  {step.icon()}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs mx-auto text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
