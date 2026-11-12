import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  sender: 'user' | 'advisor';
  text: string;
  recommendedSlug?: string;
  recommendedName?: string;
}

interface HygieneAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HygieneAdvisorModal: React.FC<HygieneAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'advisor',
      text: 'Hello! I am your WiZ Hygiene Advisor. Ask me anything about home sanitization, skin-friendly personal care, dilution ratios for 1L/5L cans, or the best WiZ product for your home!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'What cleaner is safe for luxury Italian marble floors?',
    'Which WiZ product is best for gentle makeup removal?',
    'What is the recommended dilution for 5L Floor Cleaner?',
    'Best handwash for sensitive, dry skin?'
  ];

  const handleSend = async (messageText?: string) => {
    const queryText = (messageText || input).trim();
    if (!queryText || loading) return;

    const userMsg: Message = { sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/hygiene-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'advisor',
          text: data.reply || 'WiZ provides FDA-approved hygiene products for home and personal care.'
        }
      ]);
    } catch (err) {
      console.warn('Advisor fallback triggered:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'advisor',
          text: 'For home hygiene, WiZ Disinfectant Floor Cleaner and Lemon Dishwash provide 99.9% germ protection! For personal hygiene, our Wet Wipes and Anti-Bacterial Handwash are dermatologically tested. Check our catalog to order directly via WhatsApp!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="relative bg-white max-w-2xl w-full h-[600px] flex flex-col shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-[#7a49a6] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white/20">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">WiZ Hygiene Advisor</h3>
              <p className="text-[11px] text-teal-100">
                AI hygiene specialist • Strictly WiZ catalog recommendations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 transition-colors"
            aria-label="Close Advisor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'advisor' && (
                <div className="w-7 h-7 bg-[#7a49a6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 bg-gray-300 text-gray-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <div className="w-2 h-2 bg-[#7a49a6] animate-pulse"></div>
              <span>WiZ Hygiene Advisor is formulating your answer...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap bg-teal-50 hover:bg-teal-100 text-[#7a49a6] text-[11px] font-medium px-2.5 py-1 border border-teal-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask about stain removal, floor safety, 5L cans, dilution..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#7a49a6]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#7a49a6] hover:bg-[#5f3786] text-white px-4 py-2.5 text-xs font-bold uppercase transition-colors disabled:opacity-50 flex items-center space-x-1"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
