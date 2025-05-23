const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface QueryResult {
  success: boolean;
  question: string;
  sql: string;
  explanation: string;
  visualization: 'chart' | 'table' | 'text' | 'number';
  chart_type?: 'bar' | 'line' | 'pie' | 'area';
  x_axis?: string;
  y_axis?: string;
  data: Record<string, unknown>[];
  row_count: number;
  answer: string;
  insights?: string[];
  follow_up_questions?: string[];
  error?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}

export interface SchemaResponse {
  schema: Record<string, {
    columns: Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string | null;
    }>;
    primary_keys: string[];
    foreign_keys: Array<{
      column_name: string;
      foreign_table: string;
      foreign_column: string;
    }>;
  }>;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) {
    throw new Error('Backend not available');
  }
  return response.json();
}

export async function getSchema(): Promise<SchemaResponse> {
  const response = await fetch(`${API_BASE}/api/schema`);
  if (!response.ok) {
    throw new Error('Failed to fetch schema');
  }
  return response.json();
}

export async function queryData(question: string): Promise<QueryResult> {
  const response = await fetch(`${API_BASE}/api/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Query failed');
  }
  
  return response.json();
}

