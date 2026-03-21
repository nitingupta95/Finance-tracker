"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyPlus, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { getAiHeaders } from "@/lib/ai/client";

export function AiEntry({ onExtracted }: { onExtracted: (data: any) => void }) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTextSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/extract-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAiHeaders()
        },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onExtracted(data);
      toast.success("Transaction extracted successfully!");
      setText("");
    } catch (e: any) {
      toast.error(e.message || "Failed to extract transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      // get the base64 string without the data:image/png;base64, prefix
      const base64 = reader.result?.toString().split(",")[1];
      if (!base64) return;

      setIsLoading(true);
      try {
         const res = await fetch("/api/ai/extract-transaction", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             ...getAiHeaders()
           },
           body: JSON.stringify({ image: base64 })
         });
         
         if (!res.ok) {
           const errorObj = await res.json();
           throw new Error(errorObj.error || "Failed");
         }
         
         const data = await res.json();
         onExtracted(data);
         toast.success("Receipt scanned successfully!");
      } catch (e: any) {
         toast.error(e.message || "Failed to parse receipt");
      } finally {
         setIsLoading(false);
      }
    };
  };

  return (
    <div className="border rounded-lg p-4 bg-muted/20 space-y-3 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-sm">AI Auto-Fill</h3>
      </div>
      <div className="flex gap-2">
        <input 
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="e.g. Spent $15 on coffee at Starbucks yesterday"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={isLoading}
        />
        <Button onClick={handleTextSubmit} disabled={isLoading || !text}>
          <CopyPlus className="w-4 h-4 mr-2" />
          Parse Text
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">OR</span>
      </div>
      <div>
        <Button variant="outline" className="w-full relative" disabled={isLoading}>
          <Upload className="w-4 h-4 mr-2" />
          <span>{isLoading ? "Analyzing Receipt..." : "Upload Receipt Image"}</span>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            disabled={isLoading}
          />
        </Button>
      </div>
    </div>
  );
}
