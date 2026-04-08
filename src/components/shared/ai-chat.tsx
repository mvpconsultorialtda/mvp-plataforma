"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, Trash2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface AIChatProps {
  platform: string;
  accentColor: string;
  placeholder?: string;
  suggestions?: string[];
}

export function AIChat({ platform, accentColor, placeholder, suggestions = [] }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMessage: Message = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          platform,
          history: messages,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", text: `Erro: ${data.error}` }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Erro de conexão. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-card border border-border rounded-t-xl">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-6">
            <Bot size={48} className="mx-auto opacity-50" style={{ color: accentColor }} />
            <div>
              <h3 className="text-lg font-semibold">Assistente IA</h3>
              <p className="text-sm text-muted mt-1">Como posso ajudar você hoje?</p>
            </div>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-sm px-3 py-2 rounded-lg border border-border hover:border-current transition-colors text-left"
                    style={{ color: accentColor }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "text-white"
                  : "bg-muted/30 border border-border"
              }`}
              style={msg.role === "user" ? { backgroundColor: accentColor } : undefined}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted/30 border border-border rounded-2xl px-4 py-3">
              <Loader2 size={16} className="animate-spin" style={{ color: accentColor }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border border-t-0 border-border rounded-b-xl p-3 bg-card flex gap-2">
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-lg hover:bg-muted/30 text-muted transition-colors"
            title="Limpar conversa"
          >
            <Trash2 size={18} />
          </button>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Digite sua mensagem..."}
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-sm placeholder:text-muted"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2 rounded-lg transition-colors disabled:opacity-30"
          style={{ color: accentColor }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
