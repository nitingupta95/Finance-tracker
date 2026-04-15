"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const [provider, setProvider] = useState<"openai" | "gemini">("gemini");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Load existing settings
    const storedProvider = localStorage.getItem("ai_provider") as "openai" | "gemini";
    const storedKey = localStorage.getItem("ai_api_key");
    if (storedProvider) setProvider(storedProvider);
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Security violation: API Key required.");
      return;
    }
    localStorage.setItem("ai_provider", provider);
    localStorage.setItem("ai_api_key", apiKey.trim());
    toast.success("Identity systems synchronized successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 pt-24 selection:bg-indigo-500/30">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Intelligence <span className="text-indigo-400">Core</span>
          </h1>
          <p className="text-slate-400 font-medium">Configure your autonomous financial processing engine</p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="bg-white/5 px-8 py-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white tracking-tight">AI Identity & Access</h2>
            <p className="text-slate-400 text-xs mt-1 font-medium italic">
              "Bring Your Own Key" (BYOK) architecture. Local-first storage only.
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Processing Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as "openai" | "gemini")}
                className="glass-input w-full bg-slate-900 font-bold appearance-none cursor-pointer"
              >
                <option value="gemini">Google Gemini Ultra (Optimal Path)</option>
                <option value="openai">OpenAI GPT-4 Omni</option>
              </select>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight pl-1">
                Selected engine will handle all categorization & advisory logic.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Secure API Token
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••••••"
                  className="glass-input w-full font-mono tracking-widest text-indigo-400 placeholder:text-slate-800"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-rose-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 font-bold flex-1 tracking-tight">
                  {provider === "gemini" 
                    ? "Acquire Gemini tokens from Google AI Studio portal." 
                    : "Obtain OpenAI secret keys from the platform dashboard."}
                </div>
                <a 
                  href={provider === "gemini" ? "https://aistudio.google.com/app/apikey" : "https://platform.openai.com/api-keys"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors underline decoration-indigo-400/30"
                >
                  Gateway &rarr;
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleSave} 
                className="w-full py-5 px-8 rounded-2xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:bg-slate-200 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
              >
                Synchronize Configuration
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-amber-500/50">
          <div className="flex gap-4">
            <div className="bg-amber-500/10 p-3 rounded-2xl h-fit">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-tight mb-1">Architectural Note on Privacy</h4>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Tokens are committed to browser-level LocalStorage. They never traverse our infrastructure or exit your client environment. For heightened security, rotate keys periodically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
