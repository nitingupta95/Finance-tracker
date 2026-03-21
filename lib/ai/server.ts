import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

export function getAiModel(request: Request) {
  const provider = request.headers.get('x-ai-provider') || 'gemini';
  const apiKey = request.headers.get('x-ai-key');

  if (!apiKey || apiKey === 'null') {
    throw new Error('API key is missing. Please configure it in Settings.');
  }

  if (provider === 'openai') {
    const openai = createOpenAI({ apiKey });
    return openai('gpt-4o-mini');
  } else {
    // Default to gemini-1.5-flash
    const google = createGoogleGenerativeAI({ apiKey });
    return google('gemini-1.5-flash');
  }
}
