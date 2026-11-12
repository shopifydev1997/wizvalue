import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

interface ChatMessage {
  sender: 'user' | 'advisor';
  text: string;
}

export const HygieneAdvisorPage: React.FC = () => {
  useSEO({
    title: 'AI Hygiene Advisor | WiZ Home Hygiene & Personal Care',
    description: 'Ask our AI Hygiene Advisor for personalized product recommendations, surface suitability, dilution instructions, and personal hygiene advice strictly tailored to WiZ products.'
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'advisor',
      text: 'Welcome to the official WiZ Hygiene Advisor! How can I assist you today? Ask about marble-safe floor cleaning, stubborn kitchen grease, dilution for 5L cans, or skin-friendly wipes.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      title: 'Marble & Granite Floor Care',
      desc: 'Which WiZ cleaner kills 99.9% germs without corroding shiny marble floors?',
      query: 'Which WiZ product is safe for Italian marble floors and what is the dilution?'
    },
    {
      title: 'Baby & Pet Safe Wipes',
      desc: 'Are WiZ Wet Wipes alcohol-free and safe for toddlers and pets?',
      query: 'Are WiZ Wet Wipes safe for toddlers and sensitive skin?'
    },
    {
      title: 'Commercial 5L Dilution Ratios',
      desc: 'How much water should I add to 5L Floor Cleaner and Dishwash for institutional mopping?',
      query: 'What are the recommended dilution ratios for WiZ 5L Floor Cleaner and Dishwash?'
    },
    {
      title: 'Laundry Matic Stain Defense',
      desc: 'Can WiZ Liquid Matic be used in both Front Load and Top Load machines?',
      query: 'Is WiZ Liquid Matic Laundry Detergent suitable for front load washing machines?'
    }
  ];

  const handleSend = async (messageText?: string) => {
    const queryText = (messageText || input).trim();
    if (!queryText || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: queryText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/hygiene-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'advisor', text: data.reply }]);
    } catch (err) {
      console.warn('Advisor fallback:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'advisor',
          text: 'WiZ Disinfectant Floor Cleaners and Active Lemon Dishwash provide 99.9% protection. For personal hygiene, our Wet Wipes and Anti-Bacterial Handwash are dermatologically formulated. You can order all sizes (including 1L & 5L packs) directly via WhatsApp!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Hygiene Advisor' }]} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Banner */}
        <div className="bg-[#7a49a6] text-white p-8 sm:p-12 mb-8 border border-teal-800">
          <div className="flex items-center space-x-2 text-teal-200 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              AI Powered Guidance
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            WiZ AI Hygiene Advisor
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-2 max-w-2xl leading-relaxed">
            Get expert guidance on surface disinfection, dilution ratios for economical 1L and 5L cans, and safe personal care products exclusively from the WiZ catalog.
          </p>
        </div>

        {/* Preset Topic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p.query)}
              className="p-4 border border-gray-200 bg-[#fafafa] hover:border-[#7a49a6] hover:bg-white text-left transition-all group cursor-pointer"
            >
              <h3 className="font-bold text-xs text-gray-900 group-hover:text-[#7a49a6] transition-colors mb-1">
                {p.title}
              </h3>
              <p className="text-[11px] text-gray-500 leading-snug">
                {p.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Interactive Chat Window */}
        <div className="border border-gray-300 bg-white shadow-xs">
          <div className="h-[450px] overflow-y-auto p-6 space-y-4 bg-gray-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'advisor' && (
                  <div className="w-8 h-8 bg-[#7a49a6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] p-4 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-800 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-sm">{m.text}</p>
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 text-gray-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-gray-500 text-xs">
                <div className="w-2 h-2 bg-[#7a49a6] animate-pulse"></div>
                <span>Analyzing hygiene protocols and WiZ catalog formulations...</span>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                placeholder="Ask about surface compatibility, dilution ratios, 5L cans, or skin sensitivity..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-3 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[#7a49a6] hover:bg-[#5f3786] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center space-x-1.5"
              >
                <span>Ask Advisor</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#7a49a6]" />
            <span>Advises exclusively on WiZ certified products</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/shop" className="text-[#7a49a6] font-semibold hover:underline">
              Shop Full Catalog →
            </Link>
            <Link to="/bulk-order" className="text-gray-900 font-semibold hover:underline">
              B2B Bulk Enquiries →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
