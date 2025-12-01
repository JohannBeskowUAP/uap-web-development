'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxSteps: 5, // Allow up to 5 tool round-trips
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center text-gray-800">📚 Book Assistant</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">👋 Hi! I can help you find books and track your reading.</p>
            <p className="text-sm mt-2">Try asking: "Recommend some sci-fi books" or "Show my reading stats"</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* Tool Invocations (Optional: visualize tool calls) */}
              {m.toolInvocations?.map((toolInvocation) => {
                const toolCallId = toolInvocation.toolCallId;
                const addResult = toolInvocation.toolName === 'addToReadingList' && 'result' in toolInvocation;
                const markResult = toolInvocation.toolName === 'markAsRead' && 'result' in toolInvocation;

                if (addResult || markResult) {
                  // @ts-ignore
                  const result = toolInvocation.result;
                  return (
                    <div key={toolCallId} className="mt-2 p-2 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                      ✅ {result.message}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 text-gray-500 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask for recommendations..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
