import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { sendChatMessage, getConversations, getConversationMessages, deleteConversation } from '../services/api.js';
import { ChatWindow } from '../components/chatbot/ChatComponents.jsx';
import { Card, Button } from '../components/common/UIComponents.jsx';
import { Bot, Plus, Trash2, MessageSquare } from 'lucide-react';

export default function AssistantPage() {
  const { language } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const res = await getConversations();
      if (res?.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConversationId) {
          selectConversation(res.data[0].id);
        }
      }
    } catch {
      // ignore
    }
  }

  async function selectConversation(id) {
    setActiveConversationId(id);
    try {
      const res = await getConversationMessages(id);
      if (res?.data) {
        setMessages(res.data);
      }
    } catch {
      setMessages([]);
    }
  }

  const handleSendMessage = async (text) => {
    // Optimistically add user message
    const userMsg = { role: 'user', content: text, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await sendChatMessage({
        conversationId: activeConversationId || undefined,
        message: text,
        language,
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.data.answer,
        warnings: res.data.warnings,
        relatedTopics: res.data.relatedTopics,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If this was a new conversation, update active id and refresh list
      if (!activeConversationId && res.data.conversationId) {
        setActiveConversationId(res.data.conversationId);
        loadConversations();
      }
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to connect to AI Agronomist.'}`,
        warnings: ['Network failure or API limit reached. Please check server configuration.'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation history?')) return;
    try {
      await deleteConversation(id);
      if (activeConversationId === id) {
        handleNewConversation();
      }
      loadConversations();
    } catch (err) {
      alert('Failed to delete conversation: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-forest-600" /> AI Agricultural Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            24/7 conversational advice grounded in IPM, balanced nutrition, and seasonal farming practices.
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={Plus} onClick={handleNewConversation}>
          New Query
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar of Conversations */}
        <div className="lg:col-span-1 space-y-3">
          <Card className="p-4 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Saved Dialogs</span>
              <button
                type="button"
                onClick={handleNewConversation}
                className="text-forest-700 hover:text-forest-800 font-bold"
              >
                + New
              </button>
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No previous chat records.</p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`p-2.5 rounded-xl text-xs font-medium cursor-pointer border transition flex items-center justify-between gap-2 ${
                      activeConversationId === conv.id
                        ? 'bg-forest-50 text-forest-800 border-forest-200 font-bold'
                        : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{conv.title || 'Advisory Question'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="text-slate-300 hover:text-rose-600 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentLanguage={language}
          />
        </div>
      </div>
    </div>
  );
}

