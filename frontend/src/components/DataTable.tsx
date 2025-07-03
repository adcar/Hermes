'use client';

interface DataTableProps {
  data: Record<string, unknown>[];
}

export function DataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-[var(--text-muted)]">
        No data to display
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '—';
    }
    if (typeof value === 'number') {
      // Check if it looks like a currency value
      if (value >= 100) {
        return value.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      }
      return value.toString();
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    // Check if it's an ISO date string
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return String(value);
  };

  const formatHeader = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{formatHeader(col)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 50).map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col}>{formatValue(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 50 && (
        <div className="text-center py-3 text-sm text-[var(--text-muted)]">
          Showing 50 of {data.length} rows
        </div>
      )}
    </div>
  );
}

