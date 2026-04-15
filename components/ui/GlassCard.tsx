import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export const GlassCard = ({ children, className, gradient = false, ...props }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 group",
        gradient && "after:absolute after:inset-0 after:bg-gradient-to-br after:from-indigo-500/10 after:to-purple-500/10 after:opacity-0 after:transition-opacity hover:after:opacity-100",
        className
      )}
      {...props}
    >
      {/* Subtle border glow on hover */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};
