import React from "react";
import Image from "next/image";
import { testimonialsData } from "@/data";
import { GlassCard } from "./GlassCard";
import { Quote } from "lucide-react";

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 bg-black relative">
       <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by Thousands of <br />
            <span className="text-indigo-400">Smart Investors</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Join the community of users who have transformed their relationship with money using Welth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <GlassCard key={index} className="p-8 group h-full flex flex-col justify-between" gradient>
              <div>
                <Quote className="w-10 h-10 text-indigo-500/20 mb-4 group-hover:text-indigo-500/40 transition-colors" />
                <p className="text-gray-300 text-lg leading-relaxed italic mb-8">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="relative">
                   <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20" />
                   <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="relative rounded-full border border-white/20"
                  />
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-xs text-indigo-400 font-medium">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
