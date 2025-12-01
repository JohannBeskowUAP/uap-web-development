import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/lib/tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku'),
    messages,
    tools,
    system: `You are a knowledgeable and enthusiastic book recommendation assistant. 
    You help users find books, manage their reading lists, and track their reading stats.
    
    Use the available tools to:
    - Search for books when asked for recommendations.
    - Get details when asked about specific books.
    - Add books to the reading list when the user expresses interest.
    - Mark books as read when the user says they finished one.
    - Show stats when asked.
    
    Be conversational, friendly, and helpful. 
    When showing book lists, provide the title and author.
    When adding to a list, confirm the action.`,
  });

  return result.toDataStreamResponse();
}
