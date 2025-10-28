'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center gap-3 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] p-3 transition-all focus-within:border-[var(--accent-primary)] focus-within:shadow-[0_0_0_3px_var(--accent-glow)]">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your data..."
          disabled={isLoading || disabled}
          className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none outline-none min-h-[24px] max-h-[200px] leading-6"
          rows={1}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white transition-all hover:shadow-[0_4px_20px_var(--accent-glow)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-xs text-[var(--text-muted)] text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}

