'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataChartProps {
  data: Record<string, unknown>[];
  chartType: 'bar' | 'line' | 'pie' | 'area';
  xAxis: string;
  yAxis: string;
}

const COLORS = [
  '#dc2626', // Red (primary)
  '#b91c1c', // Dark Red (secondary)
  '#f87171', // Light Red
  '#ef4444', // Red 500
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#14b8a6', // Teal
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function formatAxisLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

function isMonthField(key: string): boolean {
  const lower = key.toLowerCase();
  return lower === 'month' || lower.includes('month');
}

function formatXValue(value: unknown, key: string): string {
  if (value === null || value === undefined) return '';
  
  // Convert month numbers to names
  if (isMonthField(key) && typeof value === 'number' && value >= 1 && value <= 12) {
    return MONTH_NAMES[value];
  }
  
  // Handle date strings
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  // Truncate long strings
  if (typeof value === 'string' && value.length > 15) {
    return value.substring(0, 12) + '...';
  }
  
  return String(value);
}

export function DataChart({ data, chartType, xAxis, yAxis }: DataChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        No data to display
      </div>
    );
  }

  // Find the x and y axis columns
  const keys = Object.keys(data[0]);
  
  // Helper to detect if a column is likely a value column (revenue, total, count, etc.)
  const isValueColumn = (key: string, value: unknown): boolean => {
    const lower = key.toLowerCase();
    const isNumeric = typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value.replace(/[,$]/g, ''))));
    if (!isNumeric) return false;
    
    // Prefer columns that look like values
    const valuePatterns = ['revenue', 'total', 'sum', 'count', 'amount', 'sales', 'profit', 'cost', 'value', 'price', 'avg', 'average'];
    const isValueName = valuePatterns.some(p => lower.includes(p));
    
    // Exclude columns that are clearly not values
    const excludePatterns = ['year', 'month', 'day', 'date', 'id', 'week', 'quarter'];
    const isExcluded = excludePatterns.some(p => lower === p || lower.endsWith('_id'));
    
    // Check if the value is large enough to be a currency amount
    const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[,$]/g, ''));
    const isLargeValue = numValue > 100;
    
    if (isValueName) return true;
    if (isExcluded) return false;
    return isLargeValue;
  };
  
  // Helper to detect if a column is likely a category/label column
  const isCategoryColumn = (key: string): boolean => {
    const lower = key.toLowerCase();
    const categoryPatterns = ['month', 'year', 'date', 'name', 'category', 'segment', 'type', 'status', 'day', 'week', 'quarter'];
    return categoryPatterns.some(p => lower.includes(p));
  };
  
  // Find best x-axis key (prefer provided, then category columns, then first key)
  let xKey = xAxis && keys.includes(xAxis) ? xAxis : null;
  if (!xKey) {
    xKey = keys.find(k => isCategoryColumn(k)) || keys[0];
  }
  
  // Find best y-axis key (prefer provided, then value columns)
  let yKey = yAxis && keys.includes(yAxis) && isValueColumn(yAxis, data[0][yAxis]) ? yAxis : null;
  if (!yKey) {
    yKey = keys.find(k => k !== xKey && isValueColumn(k, data[0][k])) || keys.find(k => k !== xKey) || keys[1];
  }

  // Format data for charts - ensure numeric values are actually numbers
  const formattedData = data.map(row => {
    const formatted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'number') {
        formatted[key] = value;
      } else if (typeof value === 'string') {
        // Try to parse as number if it looks like one
        const parsed = parseFloat(value.replace(/[,$]/g, ''));
        if (!isNaN(parsed) && key === yKey) {
          formatted[key] = parsed;
        } else {
          formatted[key] = formatXValue(value, key);
        }
      } else {
        formatted[key] = value;
      }
    }
    // Add formatted x-axis value (truncated for labels)
    formatted['_xFormatted'] = formatXValue(row[xKey], xKey);
    // Store original value for tooltips (not truncated)
    formatted['_xOriginal'] = String(row[xKey] ?? '');
    return formatted;
  });

  // Calculate Y-axis domain for better scaling
  const yValues = formattedData.map(d => Number(d[yKey]) || 0);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const padding = (maxY - minY) * 0.1;
  const yDomain = [Math.max(0, minY - padding), maxY + padding];

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    if (value >= 1) return `$${value.toFixed(0)}`;
    return value.toLocaleString();
  };

  const formatTooltip = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Dynamic margins based on data size
  const hasLongLabels = formattedData.length > 10;
  const commonProps = {
    data: formattedData,
    margin: { top: 10, right: 15, left: 5, bottom: hasLongLabels ? 20 : 10 },
  };

  const axisStyle = {
    fontSize: 12,
    fill: '#b0a0a0',
  };

  const gridStyle = {
    strokeDasharray: '3 3',
    stroke: 'rgba(255,200,200,0.1)',
    opacity: 0.5,
  };

  const xAxisLabel = formatAxisLabel(xKey);
  const yAxisLabel = formatAxisLabel(yKey);

  // Use formatted x value or original
  const displayXKey = isMonthField(xKey) ? '_xFormatted' : xKey;

  // Wrapper style to prevent tooltip overflow causing horizontal scrollbars
  const chartWrapperStyle = { overflow: 'hidden' as const, width: '100%' };

  if (chartType === 'pie') {
    return (
      <div style={chartWrapperStyle}>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={formattedData}
              dataKey={yKey}
              nameKey={displayXKey}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              paddingAngle={2}
              label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
              labelLine={{ stroke: '#606070' }}
            >
              {formattedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatTooltip(value)}
              contentStyle={{
                background: '#2e2222',
                border: '1px solid rgba(255,200,200,0.1)',
                borderRadius: '8px',
                color: '#f5f0f0',
              }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            />
            <Legend wrapperStyle={{ color: '#a0a0b0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === 'line') {
    return (
      <div style={chartWrapperStyle}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart {...commonProps}>
            <CartesianGrid {...gridStyle} />
            <XAxis
              dataKey={displayXKey}
              tick={axisStyle}
              axisLine={{ stroke: 'rgba(255,200,200,0.15)' }}
              tickLine={{ stroke: 'rgba(255,200,200,0.15)' }}
              angle={-35}
              textAnchor="end"
              height={30}
              interval={0}
            />
            <YAxis
              tick={axisStyle}
              axisLine={{ stroke: 'rgba(255,200,200,0.15)' }}
              tickLine={{ stroke: 'rgba(255,200,200,0.15)' }}
              tickFormatter={formatYAxis}
              domain={yDomain}
              width={50}
            />
            <Tooltip
              formatter={(value: number) => [formatTooltip(value), yAxisLabel]}
              labelFormatter={(label, payload) => {
                const original = payload?.[0]?.payload?.['_xOriginal'];
                return `${xAxisLabel}: ${original || label}`;
              }}
              contentStyle={{
                background: '#2e2222',
                border: '1px solid rgba(255,200,200,0.1)',
                borderRadius: '8px',
                color: '#f5f0f0',
              }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={COLORS[0]}
              strokeWidth={3}
              dot={{ fill: COLORS[0], strokeWidth: 0, r: 5 }}
              activeDot={{ r: 7, fill: COLORS[1] }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === 'area') {
    return (
      <div style={chartWrapperStyle}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis
              dataKey={displayXKey}
              tick={axisStyle}
              axisLine={{ stroke: 'rgba(255,200,200,0.15)' }}
              tickLine={{ stroke: 'rgba(255,200,200,0.15)' }}
              angle={-35}
              textAnchor="end"
              height={30}
              interval={0}
            />
            <YAxis
              tick={axisStyle}
              axisLine={{ stroke: 'rgba(255,200,200,0.15)' }}
              tickLine={{ stroke: 'rgba(255,200,200,0.15)' }}
              tickFormatter={formatYAxis}
              domain={yDomain}
              width={50}
            />
            <Tooltip
              formatter={(value: number) => [formatTooltip(value), yAxisLabel]}
              labelFormatter={(label, payload) => {
                const original = payload?.[0]?.payload?.['_xOriginal'];
                return `${xAxisLabel}: ${original || label}`;
              }}
              contentStyle={{
                background: '#2e2222',
                border: '1px solid rgba(255,200,200,0.1)',
                borderRadius: '8px',
                color: '#f5f0f0',
              }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={COLORS[0]}
              strokeWidth={2}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Default: bar chart - dynamic height based on data count
  const manyBars = formattedData.length > 12;
  const barChartHeight = manyBars ? 450 : 350;
  const barXAxisHeight = manyBars ? 100 : 50;
  
  return (
    <div style={chartWrapperStyle}>
      <ResponsiveContainer width="100%" height={barChartHeight}>
        <BarChart {...commonProps} margin={{ top: 10, right: 15, left: 5, bottom: manyBars ? 30 : 10 }}>
          <CartesianGrid {...gridStyle} />
          <XAxis
            dataKey={displayXKey}
            tick={{ ...axisStyle, fontSize: manyBars ? 9 : 12 }}
            axisLine={{ stroke: 'rgba(255,200,200,0.15)' }}
            tickLine={{ stroke: 'rgba(255,200,200,0.15)' }}
            angle={-55}
            textAnchor="end"
            height={barXAxisHeight}
            interval={0}
          />
          <YAxis
            tick={axisStyle}
            axisLine={{ stroke: 'rgba(255,200,200,0.15)' }}
            tickLine={{ stroke: 'rgba(255,200,200,0.15)' }}
            tickFormatter={formatYAxis}
            domain={yDomain}
            width={50}
          />
          <Tooltip
            formatter={(value: number) => [formatTooltip(value), yAxisLabel]}
            labelFormatter={(label, payload) => {
              const original = payload?.[0]?.payload?.['_xOriginal'];
              return `${xAxisLabel}: ${original || label}`;
            }}
            contentStyle={{
              background: '#2e2222',
              border: '1px solid rgba(255,200,200,0.1)',
              borderRadius: '8px',
              color: '#f5f0f0',
            }}
            wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            cursor={{ fill: 'rgba(220, 38, 38, 0.1)' }}
          />
          <Bar
            dataKey={yKey}
            fill={COLORS[0]}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
