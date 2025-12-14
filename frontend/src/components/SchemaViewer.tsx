'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Table2, Key, Link2, X, ChevronDown, ChevronRight } from 'lucide-react';

interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface ForeignKey {
  column_name: string;
  foreign_table: string;
  foreign_column: string;
}

interface TableSchema {
  columns: Column[];
  primary_keys: string[];
  foreign_keys: ForeignKey[];
}

interface Schema {
  [tableName: string]: TableSchema;
}

// Hardcoded schema for production security
const HARDCODED_SCHEMA: Schema = {
  departments: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'budget', data_type: 'numeric', is_nullable: 'NO', column_default: '0' },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: 'CURRENT_TIMESTAMP' },
    ],
    primary_keys: ['id'],
    foreign_keys: [],
  },
  employees: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'first_name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'last_name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'email', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'department_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'role', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'salary', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'hire_date', data_type: 'date', is_nullable: 'NO', column_default: null },
      { column_name: 'is_active', data_type: 'boolean', is_nullable: 'YES', column_default: 'true' },
      { column_name: 'performance_score', data_type: 'numeric', is_nullable: 'YES', column_default: null },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: 'CURRENT_TIMESTAMP' },
    ],
    primary_keys: ['id'],
    foreign_keys: [{ column_name: 'department_id', foreign_table: 'departments', foreign_column: 'id' }],
  },
  categories: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'description', data_type: 'text', is_nullable: 'YES', column_default: null },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: 'CURRENT_TIMESTAMP' },
    ],
    primary_keys: ['id'],
    foreign_keys: [],
  },
  products: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'category_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'sku', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'price', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'cost', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'stock_quantity', data_type: 'integer', is_nullable: 'YES', column_default: '0' },
      { column_name: 'is_active', data_type: 'boolean', is_nullable: 'YES', column_default: 'true' },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: 'CURRENT_TIMESTAMP' },
    ],
    primary_keys: ['id'],
    foreign_keys: [{ column_name: 'category_id', foreign_table: 'categories', foreign_column: 'id' }],
  },
  customer_segments: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'discount_percentage', data_type: 'numeric', is_nullable: 'YES', column_default: '0' },
      { column_name: 'description', data_type: 'text', is_nullable: 'YES', column_default: null },
    ],
    primary_keys: ['id'],
    foreign_keys: [],
  },
  customers: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'first_name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'last_name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'email', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'phone', data_type: 'character varying', is_nullable: 'YES', column_default: null },
      { column_name: 'company_name', data_type: 'character varying', is_nullable: 'YES', column_default: null },
      { column_name: 'segment_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'city', data_type: 'character varying', is_nullable: 'YES', column_default: null },
      { column_name: 'state', data_type: 'character varying', is_nullable: 'YES', column_default: null },
      { column_name: 'country', data_type: 'character varying', is_nullable: 'YES', column_default: "'USA'" },
      { column_name: 'lifetime_value', data_type: 'numeric', is_nullable: 'YES', column_default: '0' },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: 'CURRENT_TIMESTAMP' },
    ],
    primary_keys: ['id'],
    foreign_keys: [{ column_name: 'segment_id', foreign_table: 'customer_segments', foreign_column: 'id' }],
  },
  orders: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'order_number', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'customer_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'employee_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'status', data_type: 'character varying', is_nullable: 'NO', column_default: "'pending'" },
      { column_name: 'subtotal', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'tax', data_type: 'numeric', is_nullable: 'NO', column_default: '0' },
      { column_name: 'discount', data_type: 'numeric', is_nullable: 'NO', column_default: '0' },
      { column_name: 'total', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'order_date', data_type: 'timestamp without time zone', is_nullable: 'NO', column_default: null },
      { column_name: 'shipped_date', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: null },
      { column_name: 'delivered_date', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: null },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: 'CURRENT_TIMESTAMP' },
    ],
    primary_keys: ['id'],
    foreign_keys: [
      { column_name: 'customer_id', foreign_table: 'customers', foreign_column: 'id' },
      { column_name: 'employee_id', foreign_table: 'employees', foreign_column: 'id' },
    ],
  },
  order_items: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'order_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'product_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'quantity', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'unit_price', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'discount', data_type: 'numeric', is_nullable: 'YES', column_default: '0' },
      { column_name: 'total', data_type: 'numeric', is_nullable: 'NO', column_default: null },
    ],
    primary_keys: ['id'],
    foreign_keys: [
      { column_name: 'order_id', foreign_table: 'orders', foreign_column: 'id' },
      { column_name: 'product_id', foreign_table: 'products', foreign_column: 'id' },
    ],
  },
  monthly_revenue: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'year', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'month', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'gross_revenue', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'net_revenue', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'total_orders', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'new_customers', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'returning_customers', data_type: 'integer', is_nullable: 'NO', column_default: null },
    ],
    primary_keys: ['id'],
    foreign_keys: [],
  },
  expenses: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'category', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'description', data_type: 'text', is_nullable: 'YES', column_default: null },
      { column_name: 'amount', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'department_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'expense_date', data_type: 'date', is_nullable: 'NO', column_default: null },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: 'CURRENT_TIMESTAMP' },
    ],
    primary_keys: ['id'],
    foreign_keys: [{ column_name: 'department_id', foreign_table: 'departments', foreign_column: 'id' }],
  },
  support_tickets: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'ticket_number', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'customer_id', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'assigned_to', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'subject', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'priority', data_type: 'character varying', is_nullable: 'NO', column_default: "'medium'" },
      { column_name: 'status', data_type: 'character varying', is_nullable: 'NO', column_default: "'open'" },
      { column_name: 'resolution_time_hours', data_type: 'numeric', is_nullable: 'YES', column_default: null },
      { column_name: 'satisfaction_score', data_type: 'integer', is_nullable: 'YES', column_default: null },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'NO', column_default: null },
      { column_name: 'resolved_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: null },
    ],
    primary_keys: ['id'],
    foreign_keys: [
      { column_name: 'customer_id', foreign_table: 'customers', foreign_column: 'id' },
      { column_name: 'assigned_to', foreign_table: 'employees', foreign_column: 'id' },
    ],
  },
  campaigns: {
    columns: [
      { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null },
      { column_name: 'name', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'channel', data_type: 'character varying', is_nullable: 'NO', column_default: null },
      { column_name: 'budget', data_type: 'numeric', is_nullable: 'NO', column_default: null },
      { column_name: 'spend', data_type: 'numeric', is_nullable: 'YES', column_default: '0' },
      { column_name: 'impressions', data_type: 'integer', is_nullable: 'YES', column_default: '0' },
      { column_name: 'clicks', data_type: 'integer', is_nullable: 'YES', column_default: '0' },
      { column_name: 'conversions', data_type: 'integer', is_nullable: 'YES', column_default: '0' },
      { column_name: 'revenue_attributed', data_type: 'numeric', is_nullable: 'YES', column_default: '0' },
      { column_name: 'start_date', data_type: 'date', is_nullable: 'NO', column_default: null },
      { column_name: 'end_date', data_type: 'date', is_nullable: 'YES', column_default: null },
      { column_name: 'status', data_type: 'character varying', is_nullable: 'YES', column_default: "'active'" },
      { column_name: 'created_at', data_type: 'timestamp without time zone', is_nullable: 'YES', column_default: 'CURRENT_TIMESTAMP' },
    ],
    primary_keys: ['id'],
    foreign_keys: [],
  },
};

interface SchemaViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchemaViewer({ isOpen, onClose }: SchemaViewerProps) {
  const [schema] = useState<Schema>(HARDCODED_SCHEMA);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set(['campaigns']));
  const [activeTab, setActiveTab] = useState<'tables' | 'erd'>('tables');

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const formatDataType = (type: string) => {
    const typeMap: Record<string, string> = {
      'integer': 'INT',
      'character varying': 'VARCHAR',
      'numeric': 'DECIMAL',
      'timestamp without time zone': 'TIMESTAMP',
      'date': 'DATE',
      'boolean': 'BOOL',
      'text': 'TEXT',
    };
    return typeMap[type] || type.toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl w-[90vw] max-w-5xl h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)] flex items-center justify-center p-2">
              <Image src="/hermes-icon.svg" alt="Hermes" width={24} height={24} className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Database Schema</h2>
              <p className="text-sm text-[var(--text-muted)]">
                {Object.keys(schema).length} tables
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-[var(--bg-tertiary)] rounded-lg p-1">
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer ${
                  activeTab === 'tables'
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Tables
              </button>
              <button
                onClick={() => setActiveTab('erd')}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer ${
                  activeTab === 'erd'
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                ERD
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'tables' ? (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(schema).sort(([a], [b]) => a.localeCompare(b)).map(([tableName, tableSchema]) => (
                  <div
                    key={tableName}
                    className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden"
                  >
                    {/* Table Header */}
                    <button
                      onClick={() => toggleTable(tableName)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
                    >
                      {expandedTables.has(tableName) ? (
                        <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                      <Table2 className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span className="font-medium text-[var(--text-primary)]">{tableName}</span>
                      <span className="ml-auto text-xs text-[var(--text-muted)]">
                        {tableSchema.columns.length} columns
                      </span>
                    </button>

                    {/* Columns */}
                    {expandedTables.has(tableName) && (
                      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                        <div className="divide-y divide-[var(--border-subtle)]">
                          {tableSchema.columns.map((col) => {
                            const isPK = tableSchema.primary_keys.includes(col.column_name);
                            const fk = tableSchema.foreign_keys.find(f => f.column_name === col.column_name);
                            
                            return (
                              <div key={col.column_name} className="flex items-center gap-2 px-4 py-2 text-sm">
                                <div className="w-5 flex justify-center">
                                  {isPK ? (
                                    <Key className="w-3.5 h-3.5 text-yellow-500" />
                                  ) : fk ? (
                                    <Link2 className="w-3.5 h-3.5 text-blue-400" />
                                  ) : null}
                                </div>
                                <span className={`font-mono ${isPK ? 'text-yellow-500' : fk ? 'text-blue-400' : 'text-[var(--text-primary)]'}`}>
                                  {col.column_name}
                                </span>
                                <span className="ml-auto font-mono text-xs text-[var(--text-muted)]">
                                  {formatDataType(col.data_type)}
                                </span>
                                {col.is_nullable === 'NO' && (
                                  <span className="text-xs text-[var(--accent-primary)]">NOT NULL</span>
                                )}
                              </div>
                            );
                          })}
                          {/* Foreign Key References */}
                          {tableSchema.foreign_keys.length > 0 && (
                            <div className="px-4 py-2 bg-[var(--bg-secondary)]">
                              <div className="text-xs text-[var(--text-muted)] mb-1">References:</div>
                              {tableSchema.foreign_keys.map((fk, i) => (
                                <div key={i} className="text-xs font-mono text-blue-400">
                                  {fk.column_name} → {fk.foreign_table}.{fk.foreign_column}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ERD View */
            <div className="h-full overflow-auto p-6">
              <div className="min-w-[800px]">
                <ERDiagram schema={schema} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ERDiagram({ schema }: { schema: Schema }) {
  const tables = Object.entries(schema);
  const relationships: { from: string; to: string; fromCol: string; toCol: string }[] = [];

  // Collect all relationships
  tables.forEach(([tableName, tableSchema]) => {
    tableSchema.foreign_keys.forEach(fk => {
      relationships.push({
        from: tableName,
        to: fk.foreign_table,
        fromCol: fk.column_name,
        toCol: fk.foreign_column,
      });
    });
  });

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-yellow-500" />
          <span className="text-[var(--text-muted)]">Primary Key</span>
        </div>
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-blue-400" />
          <span className="text-[var(--text-muted)]">Foreign Key</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[var(--accent-primary)]" />
          <span className="text-[var(--text-muted)]">Relationship</span>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-4 gap-6">
        {tables.sort(([a], [b]) => a.localeCompare(b)).map(([tableName, tableSchema]) => (
          <div
            key={tableName}
            className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg overflow-hidden"
          >
            <div className="bg-[var(--accent-primary)] px-3 py-2">
              <div className="flex items-center gap-2">
                <Table2 className="w-4 h-4 text-white" />
                <span className="font-medium text-white text-sm">{tableName}</span>
              </div>
            </div>
            <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
              {tableSchema.columns.slice(0, 8).map((col) => {
                const isPK = tableSchema.primary_keys.includes(col.column_name);
                const isFK = tableSchema.foreign_keys.some(f => f.column_name === col.column_name);
                
                return (
                  <div key={col.column_name} className="flex items-center gap-1.5 text-xs">
                    <span className="w-3">
                      {isPK && <Key className="w-3 h-3 text-yellow-500" />}
                      {isFK && !isPK && <Link2 className="w-3 h-3 text-blue-400" />}
                    </span>
                    <span className={`font-mono truncate ${isPK ? 'text-yellow-500' : isFK ? 'text-blue-400' : 'text-[var(--text-secondary)]'}`}>
                      {col.column_name}
                    </span>
                  </div>
                );
              })}
              {tableSchema.columns.length > 8 && (
                <div className="text-xs text-[var(--text-muted)] pl-4">
                  +{tableSchema.columns.length - 8} more...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Relationships List */}
      {relationships.length > 0 && (
        <div className="mt-8 p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-subtle)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Relationships</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {relationships.map((rel, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[var(--text-primary)]">{rel.from}</span>
                <span className="text-[var(--accent-primary)]">→</span>
                <span className="text-blue-400">{rel.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

