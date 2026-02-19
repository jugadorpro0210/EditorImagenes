
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, User, Bot, Loader2, Maximize2, Sparkle } from 'lucide-react';

interface AssistantPanelProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-4 border-b border-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-indigo-400/20">
              <Bot className="text-white" size={20} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>
          </div>
          <div>
            <h2 className="font-semibold text-sm">Lumina AI</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Asistente Creativo</p>
          </div>
        </div>
        <button className="p-2 text-gray-500 hover:text-white transition-colors">
          <Maximize2 size={16} />
        </button>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
              <Sparkle className="text-indigo-400 mb-2 mx-auto" size={24} />
              <p className="text-sm text-gray-400">
                Hola, soy Lumina. Puedo ayudarte a refinar tus prompts, analizar tu imagen o sugerirte estilos creativos. ¿En qué puedo ayudarte hoy?
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['¿Cómo mejoro este prompt?', 'Dime estilos artísticos', 'Analiza mi imagen'].map(suggestion => (
                <button 
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="text-[11px] px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full border border-gray-800 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                  : 'bg-gray-900 text-gray-200 border border-gray-800 rounded-tl-none'
              }`}>
                {msg.content}
                {msg.image && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                    <img src={msg.image} alt="Generado" className="w-full h-auto" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold px-1">
                {msg.role === 'user' ? 'Tú' : 'Lumina'}
              </span>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-none p-4">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta algo a Lumina..."
            disabled={isLoading}
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 text-indigo-500 hover:text-indigo-400 disabled:text-gray-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
