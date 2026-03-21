export function getAiHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  
  const provider = localStorage.getItem("ai_provider") || "gemini";
  const apiKey = localStorage.getItem("ai_api_key") || "";
  
  return {
    "x-ai-provider": provider,
    "x-ai-key": apiKey
  };
}
