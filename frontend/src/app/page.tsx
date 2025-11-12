'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { SchemaViewer } from '@/components/SchemaViewer';
import { queryData, checkHealth, QueryResult } from '@/lib/api';
import { Database, AlertCircle, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  result?: QueryResult;
  isLoading?: boolean;
}

const EXAMPLE_QUESTIONS = [
  "What's our total revenue this year?",
  "Show me monthly revenue trends for 2025",
  "Who are our top 10 customers by lifetime value?",
  "Which products have the highest profit margins?",
  "How many support tickets are still open?",
  "What's the average order value by customer segment?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showSchema, setShowSchema] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function checkBackendHealth() {
    setBackendStatus('checking');
    try {
      await checkHealth();
      setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
    }
  }

  async function handleSend(content: string) {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const result = await queryData(content);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id
            ? { ...msg, isLoading: false, result, content: result.answer || '' }
            : msg
        )
      );
    } catch (error) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                isLoading: false,
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleExampleClick(question: string) {
    if (!isLoading && backendStatus === 'online') {
      handleSend(question);
    }
  }

  async function handleRegenerate(assistantMessageId: string) {
    // Find the user message that came before this assistant message
    const messageIndex = messages.findIndex(m => m.id === assistantMessageId);
    if (messageIndex <= 0) return;
    
    const userMessage = messages[messageIndex - 1];
    if (userMessage.type !== 'user') return;
    
    setRegeneratingId(assistantMessageId);
    
    try {
      const result = await queryData(userMessage.content);
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, result, content: result.answer || '' }
            : msg
        )
      );
    } catch (error) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                result: undefined,
              }
            : msg
        )
      );
    } finally {
      setRegeneratingId(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col animated-gradient">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center glow-accent p-2">
              <Image
                src="/hermes-icon.svg"
                alt="Hermes"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold gradient-text">Hermes</h1>
              <p className="text-xs text-[var(--text-muted)]">AI-Powered Data Explorer</p>
            </div>
          </button>
          
          {/* Schema button and Backend status */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSchema(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] transition-all cursor-pointer"
            >
              <Database className="w-4 h-4" />
              Schema
            </button>
            
            {backendStatus === 'checking' && (
              <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Connecting...
              </span>
            )}
            {backendStatus === 'online' && (
              <span className="flex items-center gap-2 text-sm text-[var(--success)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                Connected
              </span>
            )}
            {backendStatus === 'offline' && (
              <button
                onClick={checkBackendHealth}
                className="flex items-center gap-2 text-sm text-[var(--error)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
                Backend offline – Click to retry
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-6">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto mb-6 glow-accent p-4">
                <Image
                  src="/hermes-icon.svg"
                  alt="Hermes"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
                Ask anything about your data
              </h2>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                I can query your database using natural language, analyze results, and visualize insights with charts and tables.
              </p>
            </div>

            {/* Example questions */}
            <div className="w-full max-w-2xl">
              <p className="text-sm text-[var(--text-muted)] mb-4 text-center">
                Try asking:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXAMPLE_QUESTIONS.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(question)}
                    disabled={backendStatus !== 'online'}
                    className="flex items-center text-left px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-[var(--accent-primary)] mr-2 text-lg leading-none">→</span>
                    <span>{question}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="flex-1 py-6 space-y-6 overflow-y-auto">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                type={message.type}
                content={message.content}
                result={message.result}
                isLoading={message.isLoading}
                isRegenerating={regeneratingId === message.id}
                onFollowUp={handleSend}
                onRegenerate={message.type === 'assistant' && !message.isLoading ? () => handleRegenerate(message.id) : undefined}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0 py-6">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            disabled={backendStatus !== 'online'}
          />
        </div>
      </main>

      {/* Schema Viewer Modal */}
      <SchemaViewer isOpen={showSchema} onClose={() => setShowSchema(false)} />
    </div>
  );
}
