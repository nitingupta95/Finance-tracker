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
      toast.error("Please enter a valid API Key.");
      return;
    }
    localStorage.setItem("ai_provider", provider);
    localStorage.setItem("ai_api_key", apiKey.trim());
    toast.success("AI Settings saved successfully!");
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl mt-20 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI Preferences</CardTitle>
          <CardDescription>
            Configure your "Bring Your Own Key" (BYOK) settings to enable powerful AI features across your finance tracker.
            Your key is <b>only stored locally</b> in your browser and is never saved on any servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select AI Provider</label>
            <select
               value={provider}
               onChange={(e) => setProvider(e.target.value as "openai" | "gemini")}
               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            >
               <option value="gemini">Google Gemini (Recommended/Free tier available)</option>
               <option value="openai">OpenAI (ChatGPT)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">API Secret Key</label>
            <input
               type="password"
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
               placeholder="sk-..."
               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              {provider === "gemini" 
                 ? "Get your free Gemini API key from Google AI Studio." 
                 : "Get your OpenAI API key from platform.openai.com."}
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
