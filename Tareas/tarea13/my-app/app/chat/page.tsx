'use client';

import { useState, useRef } from 'react';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'system', content: 'You are a podcast summary assistant. Be precise.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef<string>(localStorage.getItem('chat_session') ?? crypto.randomUUID());

  // ensure session id saved
  if (!localStorage.getItem('chat_session')) localStorage.setItem('chat_session', sessionIdRef.current);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    // POST to our API with current conversation
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        messages: nextMessages,
        // optional: model override: e.g. 'mistralai/mistral-7b-instruct:free'
      }),
    });

    if (!resp.body) {
      setLoading(false);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = '';
    // append provisional assistant message
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      assistantText += chunk;

      // update the last assistant message progressively
      setMessages(prev => {
        // copy prev and replace last assistant
        const copy = prev.slice(0, -1);
        return [...copy, { role: 'assistant', content: assistantText }];
      });
    }

    setLoading(false);
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4 border rounded p-3 h-96 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-blue-600' : m.role === 'assistant' ? 'text-gray-800' : 'text-sm text-gray-500'}>
            <b>{m.role}:</b> <span>{m.content}</span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Assistant is typing…</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
