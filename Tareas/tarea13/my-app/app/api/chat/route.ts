// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { z } from 'zod';

export const runtime = 'edge'; // streaming works best on edge runtime

// Simple in-memory session store (replace with Redis/DB in prod)
const sessions = new Map<string, { role: 'system' | 'user' | 'assistant'; content: string }[]>();

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!, // ensure .env.local has this
  baseURL: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
});

// request body validation
const bodySchema = z.object({
  sessionId: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.union([z.literal('user'), z.literal('assistant'), z.literal('system')]),
      content: z.string(),
    })
  ),
  // optional override model (must be a free model id you trust)
  model: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = bodySchema.parse(await req.json());
    const { sessionId, messages, model: modelOverride } = parsed;

    // get or init session history
    const history = sessions.get(sessionId) ?? [];

    // Merge history + incoming messages
    const merged = [...history, ...messages];

    // Build SDK message shape
    const sdkMessages = merged.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // choose model (env fallback)
    const modelId = modelOverride ?? process.env.OPENROUTER_MODEL!;
    const model = openrouter(modelId);

    // Call streamText
    const { textStream } = await streamText({
      model,
      messages: sdkMessages,
      providerOptions: {
        openrouter: {
          cacheControl: { type: 'ephemeral' },
        },
      },
    });

    // Create a TransformStream to capture the full response
    const { readable, writable } = new TransformStream();
    let fullResponse = '';

    // Pipe the text stream through our transform to capture content
    textStream.pipeTo(
      new WritableStream({
        write(chunk) {
          fullResponse += chunk;
          const writer = writable.getWriter();
          writer.write(chunk);
          writer.releaseLock();
        },
        close() {
          // Update session with the assistant's response
          const assistantMessage = {
            role: 'assistant' as const,
            content: fullResponse,
          };
          merged.push(assistantMessage);
          sessions.set(sessionId, merged);
          writable.getWriter().close();
        },
      })
    );

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
