import React, { useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Loader2 } from 'lucide-react';

export function ChatMessage({ message, onTopicClick }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-forest-600 text-white' : 'bg-harvest-100 text-harvest-800 border border-harvest-200'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={`max-w-[85%] md:max-w-[75%] space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-forest-600 text-white rounded-tr-none'
              : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none'
          }`}
        >
          {message.content}
        </div>

        {/* AI Warnings if present in message metadata */}
        {!isUser && message.warnings?.length > 0 && (
          <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 text-left">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{message.warnings.join(' ')}</span>
          </div>
        )}

        {/* Related Topics Suggestions */}
        {!isUser && message.relatedTopics?.length > 0 && onTopicClick && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.relatedTopics.map((topic, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onTopicClick(topic)}
                className="text-[11px] font-medium bg-slate-100 hover:bg-forest-50 hover:text-forest-700 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition"
              >
                + {topic}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatWindow({ messages = [], onSendMessage, isLoading, currentLanguage }) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleTopicClick = (topic) => {
    if (isLoading) return;
    onSendMessage(`Tell me more about: ${topic}`);
  };

  return (
    <div className="flex flex-col h-[650px] bg-slate-50 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">AgroAI Virtual Agronomist</h3>
            <p className="text-[11px] text-slate-500">Live multi-lingual crop & farm advisory</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
          Active
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Welcome to AgroAI Chat!</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Ask any agricultural question: crop selection, soil treatment, pest control, or weather management.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                'Which fertilizer is best for Tomato flowering stage?',
                'How to identify Fall Armyworm on Maize?',
                'Tips to manage water scarcity in Drip irrigation',
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSendMessage(suggestion)}
                  className="text-xs bg-white border border-slate-200 hover:border-forest-500 hover:text-forest-700 text-slate-700 px-3 py-1.5 rounded-lg shadow-2xs transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} onTopicClick={handleTopicClick} />
          ))
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-harvest-100 text-harvest-800 border border-harvest-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-forest-600" />
              <span>AgroAI is consulting agronomy models...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AgroAI anything about crops, soil, pests, or irrigation..."
          disabled={isLoading}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 bg-slate-50/50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white transition shadow-sm"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

