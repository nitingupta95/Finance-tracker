import React from "react";
import { featuresData } from "@/data";
import { GlassCard } from "./GlassCard";

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-32 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to <br />
            <span className="text-indigo-400">Master Your Money</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Powerful tools and AI-driven insights to help you track spending, save more, and build wealth effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <GlassCard 
              key={index} 
              className="p-8 h-full flex flex-col items-start gap-4 transition-transform hover:-translate-y-2"
              gradient
            >
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
                {feature.icon()}
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
