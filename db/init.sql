-- Hermes Database Schema
-- A realistic SaaS/retail business database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    role VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    performance_score DECIMAL(3, 2), -- 0.00 to 5.00
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    sku VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer segments
CREATE TABLE customer_segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    description TEXT
);

-- Customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(100),
    segment_id INTEGER REFERENCES customer_segments(id),
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'USA',
    lifetime_value DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    employee_id INTEGER REFERENCES employees(id), -- Sales rep
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    order_date TIMESTAMP NOT NULL,
    shipped_date TIMESTAMP,
    delivered_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL
);

-- Revenue tracking (aggregated monthly for performance)
CREATE TABLE monthly_revenue (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    gross_revenue DECIMAL(14, 2) NOT NULL,
    net_revenue DECIMAL(14, 2) NOT NULL,
    total_orders INTEGER NOT NULL,
    new_customers INTEGER NOT NULL,
    returning_customers INTEGER NOT NULL,
    UNIQUE(year, month)
);

-- Expenses
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets
CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    assigned_to INTEGER REFERENCES employees(id),
    subject VARCHAR(200) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    resolution_time_hours DECIMAL(10, 2),
    satisfaction_score INTEGER, -- 1-5
    created_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP
);

-- Marketing campaigns
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    spend DECIMAL(10, 2) DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_attributed DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_employee ON orders(employee_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_support_tickets_customer ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

