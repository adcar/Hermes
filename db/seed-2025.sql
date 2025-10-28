-- Hermes 2025 Data Extension
-- Adds orders, expenses, tickets, and campaigns for 2025 (through December)

-- Generate orders for 2025
DO $$
DECLARE
    order_date TIMESTAMP;
    cust_id INTEGER;
    emp_id INTEGER;
    order_num INTEGER;
    num_items INTEGER;
    prod_id INTEGER;
    qty INTEGER;
    unit_price DECIMAL(10,2);
    item_discount DECIMAL(10,2);
    item_total DECIMAL(10,2);
    order_subtotal DECIMAL(12,2);
    order_total DECIMAL(12,2);
    tax_amt DECIMAL(10,2);
    discount_amt DECIMAL(10,2);
    order_status VARCHAR(20);
    sales_employees INTEGER[] := ARRAY[2, 3, 4, 5, 6];
    current_order_id INTEGER;
    i INTEGER;
    j INTEGER;
    month_orders INTEGER;
    day_offset INTEGER;
    max_day INTEGER;
BEGIN
    -- Get the next order number
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 10000) + 1 
    INTO order_num FROM orders;
    
    -- Generate orders for each month of 2025 (through December)
    FOR i IN 1..12 LOOP
        -- Determine max day for current month (handle current month)
        IF i = 12 THEN
            max_day := 14; -- Current date is Dec 14
        ELSIF i IN (4, 6, 9, 11) THEN
            max_day := 28;
        ELSIF i = 2 THEN
            max_day := 26;
        ELSE
            max_day := 28;
        END IF;
        
        -- Growth pattern: 10-15% more orders than 2024
        month_orders := (55 + (i * 16) + floor(random() * 25))::int;
        
        FOR j IN 1..month_orders LOOP
            day_offset := floor(random() * max_day)::int;
            order_date := make_timestamp(2025, i, 1 + day_offset, 
                          floor(random() * 12 + 8)::int, 
                          floor(random() * 60)::int, 
                          floor(random() * 60)::int);
            
            cust_id := floor(random() * 100 + 1)::int;
            emp_id := sales_employees[floor(random() * 5 + 1)::int];
            
            -- Order status based on date
            IF order_date < CURRENT_TIMESTAMP - INTERVAL '30 days' THEN
                order_status := 'delivered';
            ELSIF order_date < CURRENT_TIMESTAMP - INTERVAL '7 days' THEN
                order_status := (ARRAY['delivered', 'shipped'])[floor(random() * 2 + 1)::int];
            ELSIF order_date < CURRENT_TIMESTAMP - INTERVAL '2 days' THEN
                order_status := (ARRAY['shipped', 'processing'])[floor(random() * 2 + 1)::int];
            ELSE
                order_status := (ARRAY['pending', 'processing'])[floor(random() * 2 + 1)::int];
            END IF;
            
            order_num := order_num + 1;
            
            INSERT INTO orders (order_number, customer_id, employee_id, status, subtotal, tax, discount, total, order_date, shipped_date, delivered_date)
            VALUES (
                'ORD-' || order_num,
                cust_id,
                emp_id,
                order_status,
                0, 0, 0, 0,
                order_date,
                CASE WHEN order_status IN ('shipped', 'delivered') THEN order_date + INTERVAL '2 days' ELSE NULL END,
                CASE WHEN order_status = 'delivered' THEN order_date + INTERVAL '5 days' ELSE NULL END
            )
            RETURNING id INTO current_order_id;
            
            num_items := floor(random() * 5 + 1)::int;
            order_subtotal := 0;
            
            FOR k IN 1..num_items LOOP
                prod_id := floor(random() * 30 + 1)::int;
                qty := floor(random() * 3 + 1)::int;
                
                SELECT price INTO unit_price FROM products WHERE products.id = prod_id;
                item_discount := CASE WHEN random() < 0.2 THEN unit_price * qty * (random() * 0.15) ELSE 0 END;
                item_total := (unit_price * qty) - item_discount;
                
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, discount, total)
                VALUES (current_order_id, prod_id, qty, unit_price, item_discount, item_total);
                
                order_subtotal := order_subtotal + item_total;
            END LOOP;
            
            tax_amt := order_subtotal * 0.08;
            discount_amt := CASE WHEN random() < 0.1 THEN order_subtotal * (random() * 0.1) ELSE 0 END;
            order_total := order_subtotal + tax_amt - discount_amt;
            
            UPDATE orders SET 
                subtotal = order_subtotal,
                tax = tax_amt,
                discount = discount_amt,
                total = order_total
            WHERE orders.id = current_order_id;
            
        END LOOP;
    END LOOP;
END $$;

-- Update customer lifetime values
UPDATE customers c SET lifetime_value = (
    SELECT COALESCE(SUM(o.total), 0) 
    FROM orders o 
    WHERE o.customer_id = c.id AND o.status = 'delivered'
);

-- Add 2025 monthly revenue aggregation
INSERT INTO monthly_revenue (year, month, gross_revenue, net_revenue, total_orders, new_customers, returning_customers)
SELECT 
    EXTRACT(YEAR FROM order_date)::int as year,
    EXTRACT(MONTH FROM order_date)::int as month,
    SUM(total) as gross_revenue,
    SUM(subtotal - discount) as net_revenue,
    COUNT(*) as total_orders,
    COUNT(DISTINCT CASE WHEN first_order THEN customer_id END) as new_customers,
    COUNT(DISTINCT CASE WHEN NOT first_order THEN customer_id END) as returning_customers
FROM (
    SELECT 
        o.*,
        o.order_date = (SELECT MIN(o2.order_date) FROM orders o2 WHERE o2.customer_id = o.customer_id) as first_order
    FROM orders o
    WHERE EXTRACT(YEAR FROM o.order_date) = 2025
) sub
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
ON CONFLICT (year, month) DO UPDATE SET
    gross_revenue = EXCLUDED.gross_revenue,
    net_revenue = EXCLUDED.net_revenue,
    total_orders = EXCLUDED.total_orders,
    new_customers = EXCLUDED.new_customers,
    returning_customers = EXCLUDED.returning_customers;

-- 2025 Expenses
INSERT INTO expenses (category, description, amount, department_id, expense_date)
SELECT 
    category,
    description,
    base_amount * (0.85 + random() * 0.3),
    dept_id,
    make_date(2025, month, (random() * 27 + 1)::int)
FROM (
    SELECT 'Payroll' as category, 'Monthly payroll' as description, 295000.00 as base_amount, NULL as dept_id, generate_series(1, 12) as month
    UNION ALL
    SELECT 'Cloud Infrastructure', 'AWS/GCP hosting', 48000.00, 2, generate_series(1, 12)
    UNION ALL
    SELECT 'Marketing', 'Digital advertising', 28000.00, 3, generate_series(1, 12)
    UNION ALL
    SELECT 'Office Rent', 'Office space lease', 36000.00, 5, generate_series(1, 12)
    UNION ALL
    SELECT 'Software Subscriptions', 'SaaS tools', 9000.00, 2, generate_series(1, 12)
    UNION ALL
    SELECT 'Travel', 'Business travel', 14000.00, 1, generate_series(1, 12)
    UNION ALL
    SELECT 'Equipment', 'Hardware and equipment', 18000.00, 2, generate_series(1, 4)
    UNION ALL
    SELECT 'Training', 'Employee training', 6000.00, 7, generate_series(1, 4)
) expenses_template;

-- 2025 Support tickets
DO $$
DECLARE
    ticket_date TIMESTAMP;
    ticket_num INTEGER;
    cust_id INTEGER;
    support_employees INTEGER[] := ARRAY[20, 21, 22, 23];
    assigned_emp INTEGER;
    ticket_status VARCHAR(20);
    ticket_priority VARCHAR(20);
    resolution_hours DECIMAL(10,2);
    satisfaction INTEGER;
    subjects TEXT[] := ARRAY[
        'Cannot access dashboard', 'Integration not working', 'Billing question',
        'Feature request', 'Performance issue', 'Login problems', 'Data export help',
        'API error', 'Report generation issue', 'Mobile app bug', 'Password reset',
        'Account upgrade', 'Training request', 'Custom report help', 'SSO configuration'
    ];
    i INTEGER;
    j INTEGER;
    month_tickets INTEGER;
    day_offset INTEGER;
    max_day INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)), 5000) + 1 
    INTO ticket_num FROM support_tickets;
    
    FOR i IN 1..12 LOOP
        IF i = 12 THEN
            max_day := 12;
        ELSE
            max_day := 26;
        END IF;
        
        month_tickets := 35 + floor(random() * 25)::int;
        
        FOR j IN 1..month_tickets LOOP
            day_offset := floor(random() * max_day)::int;
            ticket_date := make_timestamp(2025, i, 1 + day_offset, 
                          floor(random() * 12 + 8)::int, 
                          floor(random() * 60)::int, 0);
            
            cust_id := floor(random() * 100 + 1)::int;
            assigned_emp := support_employees[floor(random() * 4 + 1)::int];
            
            ticket_priority := (ARRAY['low', 'medium', 'high', 'urgent'])[
                CASE 
                    WHEN random() < 0.3 THEN 1
                    WHEN random() < 0.7 THEN 2
                    WHEN random() < 0.9 THEN 3
                    ELSE 4
                END
            ];
            
            IF ticket_date < CURRENT_TIMESTAMP - INTERVAL '7 days' THEN
                ticket_status := 'closed';
                resolution_hours := random() * 48 + 1;
                satisfaction := floor(random() * 2 + 4)::int;
            ELSIF ticket_date < CURRENT_TIMESTAMP - INTERVAL '2 days' THEN
                ticket_status := (ARRAY['closed', 'in_progress'])[floor(random() * 2 + 1)::int];
                IF ticket_status = 'closed' THEN
                    resolution_hours := random() * 48 + 1;
                    satisfaction := floor(random() * 3 + 3)::int;
                ELSE
                    resolution_hours := NULL;
                    satisfaction := NULL;
                END IF;
            ELSE
                ticket_status := (ARRAY['open', 'in_progress'])[floor(random() * 2 + 1)::int];
                resolution_hours := NULL;
                satisfaction := NULL;
            END IF;
            
            ticket_num := ticket_num + 1;
            
            INSERT INTO support_tickets (ticket_number, customer_id, assigned_to, subject, priority, status, resolution_time_hours, satisfaction_score, created_at, resolved_at)
            VALUES (
                'TKT-' || ticket_num,
                cust_id,
                assigned_emp,
                subjects[floor(random() * 15 + 1)::int],
                ticket_priority,
                ticket_status,
                resolution_hours,
                satisfaction,
                ticket_date,
                CASE WHEN ticket_status = 'closed' THEN ticket_date + (resolution_hours || ' hours')::interval ELSE NULL END
            );
        END LOOP;
    END LOOP;
END $$;

-- 2025 Marketing campaigns
INSERT INTO campaigns (name, channel, budget, spend, impressions, clicks, conversions, revenue_attributed, start_date, end_date, status) VALUES
('2025 Kickoff Campaign', 'Google Ads', 55000.00, 54000.00, 2800000, 84000, 500, 200000.00, '2025-01-05', '2025-02-28', 'completed'),
('Spring Product Launch', 'Multi-channel', 75000.00, 72000.00, 4000000, 120000, 720, 288000.00, '2025-03-01', '2025-04-30', 'completed'),
('Q2 Growth Push', 'LinkedIn', 40000.00, 38500.00, 600000, 18000, 150, 450000.00, '2025-04-01', '2025-06-30', 'completed'),
('Summer Sale 2025', 'Facebook', 45000.00, 43000.00, 2200000, 66000, 400, 160000.00, '2025-06-15', '2025-08-15', 'completed'),
('Back to Business', 'Google Ads', 50000.00, 48000.00, 2500000, 75000, 450, 180000.00, '2025-09-01', '2025-10-31', 'completed'),
('Holiday 2025 Campaign', 'Multi-channel', 90000.00, 65000.00, 4500000, 180000, 900, 360000.00, '2025-11-15', '2025-12-31', 'active'),
('Year-Round Content', 'Blog/SEO', 24000.00, 22000.00, 950000, 47500, 240, 96000.00, '2025-01-01', '2025-12-31', 'active'),
('Retargeting 2025', 'Display', 18000.00, 16500.00, 1400000, 28000, 175, 70000.00, '2025-01-01', '2025-12-31', 'active');

