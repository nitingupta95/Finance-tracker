"use client";

import React from "react"; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; 

const HeroSection = () => { 
  return (
    <section className="pt-40 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Finances <br />
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 mb-4 " variant="destructive">
              Get Started
            </Button>
          </Link>
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
