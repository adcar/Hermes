'use client';

import { QueryResult } from '@/lib/api';
import { DataChart } from './DataChart';
import { DataTable } from './DataTable';
import { SqlHighlight } from './SqlHighlight';
import { User, Sparkles, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  type: 'user' | 'assistant';
  content: string;
  result?: QueryResult;
  isLoading?: boolean;
  onFollowUp?: (question: string) => void;
}

export function ChatMessage({ type, content, result, isLoading, onFollowUp }: ChatMessageProps) {
  const [showSQL, setShowSQL] = useState(false);
  const [showInsights, setShowInsights] = useState(true);

  if (type === 'user') {
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl rounded-tr-sm px-5 py-3 glow-soft">
            <p className="text-white font-medium">{content}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 border border-[var(--border-subtle)]">
            <User className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-start animate-fade-in-up">
        <div className="flex items-start gap-3 max-w-[85%]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0 glow-accent">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-2xl rounded-tl-sm px-5 py-4 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="typing-dot w-2 h-2 rounded-full bg-[var(--accent-primary)]"></span>
              <span className="typing-dot w-2 h-2 rounded-full bg-[var(--accent-primary)]"></span>
              <span className="typing-dot w-2 h-2 rounded-full bg-[var(--accent-primary)]"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-fade-in-up w-full">
      <div className="flex items-start gap-3 w-full min-w-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0 glow-accent">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 space-y-4 min-w-0">
          {/* Main answer */}
          <div className="bg-[var(--bg-secondary)] rounded-2xl rounded-tl-sm px-5 py-4 border border-[var(--border-subtle)]">
            <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{result?.answer || content}</p>
          </div>

          {/* Visualization */}
          {result && result.success && result.data && result.data.length > 0 && (
            <div className="chart-container">
              {result.visualization === 'chart' && (
                <DataChart
                  data={result.data}
                  chartType={result.chart_type || 'bar'}
                  xAxis={result.x_axis || ''}
                  yAxis={result.y_axis || ''}
                />
              )}
              {result.visualization === 'table' && (
                <DataTable data={result.data} />
              )}
              {result.visualization === 'number' && result.data[0] && (
                <div className="text-center py-6">
                  <p className="text-5xl font-bold gradient-text">
                    {formatValue(Object.values(result.data[0])[0])}
                  </p>
                  <p className="text-[var(--text-secondary)] mt-2">
                    {Object.keys(result.data[0])[0]?.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Insights */}
          {result?.insights && result.insights.length > 0 && (
            <div className="bg-[var(--bg-tertiary)] rounded-xl px-4 py-3 border border-[var(--border-subtle)]">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-full"
              >
                {showInsights ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Key Insights
              </button>
              {showInsights && (
                <ul className="mt-3 space-y-2">
                  {result.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--accent-primary)] mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* SQL Query (collapsible) */}
          {result?.sql && (
            <div className="bg-[var(--bg-tertiary)] rounded-xl px-4 py-3 border border-[var(--border-subtle)]">
              <button
                onClick={() => setShowSQL(!showSQL)}
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-full"
              >
                <Database className="w-4 h-4" />
                {showSQL ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                SQL Query
                <span className="text-xs text-[var(--text-muted)] ml-auto">
                  {result.row_count} row{result.row_count !== 1 ? 's' : ''} returned
                </span>
              </button>
              {showSQL && (
                <div className="code-block mt-3 p-4 overflow-x-auto">
                  <SqlHighlight code={result.sql} />
                </div>
              )}
            </div>
          )}

          {/* Follow-up questions */}
          {result?.follow_up_questions && result.follow_up_questions.length > 0 && onFollowUp && (
            <div className="flex flex-wrap gap-2">
              {result.follow_up_questions.slice(0, 3).map((question, i) => (
                <button
                  key={i}
                  onClick={() => onFollowUp(question)}
                  className="text-sm px-4 py-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Error state */}
          {result && !result.success && result.error && (
            <div className="bg-red-950/30 border border-red-800/50 rounded-xl px-4 py-3">
              <p className="text-sm text-red-400">{result.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatValue(value: unknown): string {
  if (typeof value === 'number') {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
      return '$' + (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
  }
  return String(value);
}

