"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Shield, Key, Cpu, Info, CheckCircle2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [provider, setProvider] = useState<"openai" | "gemini">("gemini");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const storedProvider = localStorage.getItem("ai_provider") as "openai" | "gemini";
    const storedKey = localStorage.getItem("ai_api_key");
    if (storedProvider) setProvider(storedProvider);
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Config Violation: Authentication token required.");
      return;
    }
    localStorage.setItem("ai_provider", provider);
    localStorage.setItem("ai_api_key", apiKey.trim());
    toast.success("Intelligence Parameters Synchronized");
  };

  return (
    <div className="max-w-3xl space-y-10">
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight leading-none">System Settings</h2>
          <p className="text-slate-500 text-xs font-bold mt-2">Infrastructure Configuration & Governance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main Configuration Console */}
        <div className="fintech-card rounded-3xl overflow-hidden border border-white/5">
          <div className="bg-slate-950 px-8 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu size={16} className="text-blue-500" />
              <h3 className="font-bold text-white text-sm">Intelligence Core Parameters</h3>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-3 py-1 rounded border border-white/5">Byok-Architecture</span>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Provider Selection */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <Shield size={14} className="text-blue-500" />
                Processing Vector
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setProvider("gemini")}
                  className={cn(
                    "flex flex-col items-start p-6 rounded-2xl border transition-all duration-300 group",
                    provider === "gemini" 
                      ? "bg-blue-600/10 border-blue-600/50 shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                      : "bg-slate-950 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={cn("text-sm font-bold", provider === "gemini" ? "text-blue-400" : "text-slate-500")}>Google Gemini</span>
                    {provider === "gemini" && <CheckCircle2 size={16} className="text-blue-500" />}
                  </div>
                  <p className="text-xs font-bold text-white">Optimal Performance</p>
                </button>
                <button
                  onClick={() => setProvider("openai")}
                  className={cn(
                    "flex flex-col items-start p-6 rounded-2xl border transition-all duration-300 group",
                    provider === "openai" 
                      ? "bg-blue-600/10 border-blue-600/50 shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                      : "bg-slate-950 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={cn("text-sm font-bold", provider === "openai" ? "text-blue-400" : "text-slate-500")}>OpenAI GPT-4</span>
                    {provider === "openai" && <CheckCircle2 size={16} className="text-blue-500" />}
                  </div>
                  <p className="text-xs font-bold text-white">Standard Protocol</p>
                </button>
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <Key size={14} className="text-blue-500" />
                Authentication Token
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 font-mono text-sm text-blue-400 placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800 transition-colors group-focus-within:text-blue-500">
                  <Shield size={18} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  {provider === "gemini" 
                    ? "Initialize tokens via Google AI Studio portal." 
                    : "Access secret keys in OpenAI developer platform."}
                </p>
                <a 
                  href={provider === "gemini" ? "https://aistudio.google.com/app/apikey" : "https://platform.openai.com/api-keys"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[10px] font-black text-blue-500 hover:text-white uppercase tracking-widest transition-all bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10"
                >
                  Acquire Access <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4">
              <button 
                onClick={handleSave} 
                className="w-full py-5 px-8 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/10"
              >
                Synchronize Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Security / Privacy Metadata */}
        <div className="fintech-card p-6 rounded-3xl border border-white/5 bg-slate-900/[0.03] space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500 border border-blue-500/20">
              <Info size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-[10px] mb-2">Architectural Governance Note</h4>
              <p className="text-slate-500 text-xs font-bold leading-relaxed tracking-tight opacity-60">
                All intelligence credentials are committed exclusively to browser-level LocalStorage. Our infrastructure never intercepts or persists decryption keys. Periodic rotation is recommended for institutional-grade security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
