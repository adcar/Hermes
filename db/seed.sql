-- Hermes Seed Data
-- Realistic business data for a SaaS/E-commerce company spanning 2024

-- Departments
INSERT INTO departments (name, budget) VALUES
('Sales', 500000.00),
('Engineering', 800000.00),
('Marketing', 300000.00),
('Customer Support', 200000.00),
('Operations', 250000.00),
('Finance', 150000.00),
('Human Resources', 100000.00);

-- Employees (40 employees across departments)
INSERT INTO employees (first_name, last_name, email, department_id, role, salary, hire_date, performance_score) VALUES
-- Sales team
('Sarah', 'Johnson', 'sarah.johnson@company.com', 1, 'Sales Director', 120000.00, '2022-03-15', 4.8),
('Michael', 'Chen', 'michael.chen@company.com', 1, 'Senior Sales Rep', 85000.00, '2022-06-01', 4.5),
('Emily', 'Williams', 'emily.williams@company.com', 1, 'Sales Rep', 65000.00, '2023-01-10', 4.2),
('James', 'Rodriguez', 'james.rodriguez@company.com', 1, 'Sales Rep', 62000.00, '2023-04-20', 3.9),
('Amanda', 'Davis', 'amanda.davis@company.com', 1, 'Sales Rep', 60000.00, '2023-08-15', 4.0),
('David', 'Kim', 'david.kim@company.com', 1, 'Sales Rep', 58000.00, '2024-02-01', 3.7),
-- Engineering team
('Robert', 'Taylor', 'robert.taylor@company.com', 2, 'VP Engineering', 180000.00, '2021-01-10', 4.9),
('Jennifer', 'Martinez', 'jennifer.martinez@company.com', 2, 'Senior Engineer', 140000.00, '2021-06-15', 4.7),
('Christopher', 'Brown', 'christopher.brown@company.com', 2, 'Senior Engineer', 135000.00, '2022-01-20', 4.6),
('Lisa', 'Garcia', 'lisa.garcia@company.com', 2, 'Engineer', 110000.00, '2022-08-01', 4.3),
('Daniel', 'Wilson', 'daniel.wilson@company.com', 2, 'Engineer', 105000.00, '2023-03-15', 4.1),
('Jessica', 'Anderson', 'jessica.anderson@company.com', 2, 'Engineer', 100000.00, '2023-07-01', 4.0),
('Matthew', 'Thomas', 'matthew.thomas@company.com', 2, 'Junior Engineer', 80000.00, '2024-01-15', 3.8),
('Ashley', 'Jackson', 'ashley.jackson@company.com', 2, 'Junior Engineer', 75000.00, '2024-03-01', 3.6),
-- Marketing team
('Kevin', 'White', 'kevin.white@company.com', 3, 'Marketing Director', 110000.00, '2022-02-01', 4.4),
('Nicole', 'Harris', 'nicole.harris@company.com', 3, 'Senior Marketer', 80000.00, '2022-09-01', 4.2),
('Brian', 'Clark', 'brian.clark@company.com', 3, 'Content Specialist', 65000.00, '2023-05-15', 4.0),
('Stephanie', 'Lewis', 'stephanie.lewis@company.com', 3, 'Social Media Manager', 60000.00, '2023-11-01', 3.9),
-- Customer Support team
('Ryan', 'Robinson', 'ryan.robinson@company.com', 4, 'Support Manager', 75000.00, '2022-04-01', 4.3),
('Michelle', 'Walker', 'michelle.walker@company.com', 4, 'Senior Support', 55000.00, '2022-10-15', 4.1),
('Joshua', 'Hall', 'joshua.hall@company.com', 4, 'Support Rep', 45000.00, '2023-02-01', 3.8),
('Heather', 'Allen', 'heather.allen@company.com', 4, 'Support Rep', 44000.00, '2023-06-15', 4.0),
('Justin', 'Young', 'justin.young@company.com', 4, 'Support Rep', 43000.00, '2024-01-10', 3.5),
-- Operations team
('Andrew', 'King', 'andrew.king@company.com', 5, 'Operations Director', 100000.00, '2021-11-01', 4.5),
('Rachel', 'Wright', 'rachel.wright@company.com', 5, 'Operations Manager', 70000.00, '2022-07-01', 4.2),
('Brandon', 'Scott', 'brandon.scott@company.com', 5, 'Logistics Coordinator', 50000.00, '2023-09-01', 3.9),
-- Finance team
('Megan', 'Green', 'megan.green@company.com', 6, 'CFO', 150000.00, '2021-05-01', 4.8),
('Tyler', 'Adams', 'tyler.adams@company.com', 6, 'Accountant', 65000.00, '2022-11-01', 4.1),
('Lauren', 'Baker', 'lauren.baker@company.com', 6, 'Financial Analyst', 70000.00, '2023-04-01', 4.0),
-- HR team
('Christina', 'Nelson', 'christina.nelson@company.com', 7, 'HR Director', 90000.00, '2022-01-15', 4.3),
('Eric', 'Carter', 'eric.carter@company.com', 7, 'HR Specialist', 55000.00, '2023-08-01', 3.8);

-- Product categories
INSERT INTO categories (name, description) VALUES
('Software Licenses', 'Enterprise software licensing products'),
('Cloud Services', 'Cloud hosting and infrastructure'),
('Professional Services', 'Consulting and implementation'),
('Support Plans', 'Technical support and maintenance'),
('Training', 'Training and certification programs'),
('Hardware', 'Server and networking equipment'),
('Add-ons', 'Software add-ons and integrations');

-- Products
INSERT INTO products (name, category_id, sku, price, cost, stock_quantity) VALUES
-- Software Licenses
('Enterprise Suite - Annual', 1, 'SW-ENT-001', 12000.00, 2000.00, 999),
('Professional Suite - Annual', 1, 'SW-PRO-001', 6000.00, 1000.00, 999),
('Starter Suite - Annual', 1, 'SW-STR-001', 2400.00, 400.00, 999),
('Enterprise Suite - Monthly', 1, 'SW-ENT-M01', 1200.00, 200.00, 999),
('Professional Suite - Monthly', 1, 'SW-PRO-M01', 600.00, 100.00, 999),
-- Cloud Services
('Cloud Hosting - Enterprise', 2, 'CL-ENT-001', 5000.00, 1500.00, 999),
('Cloud Hosting - Standard', 2, 'CL-STD-001', 2000.00, 600.00, 999),
('Cloud Hosting - Basic', 2, 'CL-BAS-001', 500.00, 150.00, 999),
('Data Storage - 1TB', 2, 'CL-STO-1TB', 100.00, 30.00, 999),
('Data Storage - 10TB', 2, 'CL-STO-10T', 800.00, 240.00, 999),
-- Professional Services
('Implementation - Full', 3, 'PS-IMP-FUL', 25000.00, 15000.00, 999),
('Implementation - Standard', 3, 'PS-IMP-STD', 10000.00, 6000.00, 999),
('Custom Development - Day', 3, 'PS-DEV-DAY', 2000.00, 1200.00, 999),
('Integration Services', 3, 'PS-INT-001', 5000.00, 3000.00, 999),
('Migration Services', 3, 'PS-MIG-001', 8000.00, 4800.00, 999),
-- Support Plans
('Premium Support - Annual', 4, 'SP-PRM-001', 6000.00, 1200.00, 999),
('Standard Support - Annual', 4, 'SP-STD-001', 2400.00, 480.00, 999),
('Basic Support - Annual', 4, 'SP-BAS-001', 1200.00, 240.00, 999),
-- Training
('Admin Certification', 5, 'TR-ADM-001', 1500.00, 300.00, 999),
('Developer Certification', 5, 'TR-DEV-001', 2000.00, 400.00, 999),
('End User Training - Group', 5, 'TR-USR-GRP', 3000.00, 600.00, 999),
('Custom Workshop', 5, 'TR-CUS-001', 5000.00, 1500.00, 999),
-- Hardware
('Application Server', 6, 'HW-SRV-001', 15000.00, 10000.00, 50),
('Database Server', 6, 'HW-SRV-002', 25000.00, 17000.00, 30),
('Network Switch', 6, 'HW-NET-001', 3000.00, 2000.00, 100),
-- Add-ons
('Analytics Module', 7, 'AO-ANL-001', 1200.00, 200.00, 999),
('Security Module', 7, 'AO-SEC-001', 1800.00, 300.00, 999),
('API Access', 7, 'AO-API-001', 600.00, 100.00, 999),
('SSO Integration', 7, 'AO-SSO-001', 1000.00, 150.00, 999),
('Mobile Access', 7, 'AO-MOB-001', 500.00, 80.00, 999);

-- Customer segments
INSERT INTO customer_segments (name, discount_percentage, description) VALUES
('Enterprise', 15.00, 'Large enterprise customers with 500+ employees'),
('Mid-Market', 10.00, 'Medium businesses with 100-499 employees'),
('Small Business', 5.00, 'Small businesses with 10-99 employees'),
('Startup', 20.00, 'Early-stage startups with special pricing'),
('Government', 12.00, 'Government and public sector'),
('Education', 25.00, 'Educational institutions'),
('Non-Profit', 30.00, 'Non-profit organizations');

-- Customers (100 customers)
INSERT INTO customers (first_name, last_name, email, phone, company_name, segment_id, city, state, country) VALUES
('John', 'Smith', 'jsmith@acmecorp.com', '555-0101', 'Acme Corporation', 1, 'New York', 'NY', 'USA'),
('Mary', 'Johnson', 'mjohnson@techstart.io', 'mj@techstart.io', 'TechStart Inc', 4, 'San Francisco', 'CA', 'USA'),
('Robert', 'Williams', 'rwilliams@globalind.com', '555-0103', 'Global Industries', 1, 'Chicago', 'IL', 'USA'),
('Patricia', 'Brown', 'pbrown@innovate.co', '555-0104', 'Innovate Co', 2, 'Austin', 'TX', 'USA'),
('David', 'Jones', 'djones@nexgen.com', '555-0105', 'NexGen Solutions', 2, 'Seattle', 'WA', 'USA'),
('Jennifer', 'Garcia', 'jgarcia@cityschools.edu', '555-0106', 'City Schools District', 6, 'Los Angeles', 'CA', 'USA'),
('Michael', 'Miller', 'mmiller@stateagency.gov', '555-0107', 'State Agency', 5, 'Sacramento', 'CA', 'USA'),
('Linda', 'Davis', 'ldavis@helpinghands.org', '555-0108', 'Helping Hands Foundation', 7, 'Portland', 'OR', 'USA'),
('William', 'Rodriguez', 'wrodriguez@megamart.com', '555-0109', 'MegaMart Retail', 1, 'Dallas', 'TX', 'USA'),
('Elizabeth', 'Martinez', 'emartinez@quickship.com', '555-0110', 'QuickShip Logistics', 2, 'Miami', 'FL', 'USA'),
('Richard', 'Hernandez', 'rhernandez@dataflow.io', '555-0111', 'DataFlow Systems', 3, 'Denver', 'CO', 'USA'),
('Barbara', 'Lopez', 'blopez@creativeminds.com', '555-0112', 'Creative Minds Agency', 3, 'Phoenix', 'AZ', 'USA'),
('Joseph', 'Gonzalez', 'jgonzalez@buildright.com', '555-0113', 'BuildRight Construction', 2, 'Houston', 'TX', 'USA'),
('Susan', 'Wilson', 'swilson@healthplus.com', '555-0114', 'HealthPlus Medical', 1, 'Boston', 'MA', 'USA'),
('Thomas', 'Anderson', 'tanderson@finserve.com', '555-0115', 'FinServe Bank', 1, 'Charlotte', 'NC', 'USA'),
('Jessica', 'Thomas', 'jthomas@greenearth.org', '555-0116', 'Green Earth Initiative', 7, 'Seattle', 'WA', 'USA'),
('Charles', 'Taylor', 'ctaylor@automax.com', '555-0117', 'AutoMax Dealers', 2, 'Detroit', 'MI', 'USA'),
('Sarah', 'Moore', 'smoore@techuniv.edu', '555-0118', 'Tech University', 6, 'Atlanta', 'GA', 'USA'),
('Christopher', 'Jackson', 'cjackson@lawfirm.com', '555-0119', 'Jackson & Partners Law', 3, 'Philadelphia', 'PA', 'USA'),
('Karen', 'Martin', 'kmartin@mediapro.com', '555-0120', 'MediaPro Studios', 2, 'Los Angeles', 'CA', 'USA'),
('Daniel', 'Lee', 'dlee@cloudnine.io', '555-0121', 'CloudNine Tech', 4, 'San Jose', 'CA', 'USA'),
('Nancy', 'Perez', 'nperez@retailplus.com', '555-0122', 'RetailPlus Stores', 2, 'Chicago', 'IL', 'USA'),
('Matthew', 'Thompson', 'mthompson@energycorp.com', '555-0123', 'Energy Corp', 1, 'Houston', 'TX', 'USA'),
('Betty', 'White', 'bwhite@foodchain.com', '555-0124', 'FoodChain Restaurants', 2, 'New York', 'NY', 'USA'),
('Anthony', 'Harris', 'aharris@sportsgear.com', '555-0125', 'SportsGear Inc', 3, 'Portland', 'OR', 'USA'),
('Margaret', 'Sanchez', 'msanchez@beautybox.com', '555-0126', 'BeautyBox Cosmetics', 3, 'Miami', 'FL', 'USA'),
('Mark', 'Clark', 'mclark@techforge.io', '555-0127', 'TechForge Labs', 4, 'Austin', 'TX', 'USA'),
('Sandra', 'Ramirez', 'sramirez@petcare.com', '555-0128', 'PetCare Supplies', 3, 'San Diego', 'CA', 'USA'),
('Steven', 'Lewis', 'slewis@consulting.com', '555-0129', 'Lewis Consulting Group', 3, 'Washington', 'DC', 'USA'),
('Ashley', 'Robinson', 'arobinson@artmuseum.org', '555-0130', 'City Art Museum', 7, 'Chicago', 'IL', 'USA'),
('Andrew', 'Walker', 'awalker@pharmatech.com', '555-0131', 'PharmaTech Labs', 1, 'Boston', 'MA', 'USA'),
('Kimberly', 'Young', 'kyoung@fashionhouse.com', '555-0132', 'Fashion House', 2, 'New York', 'NY', 'USA'),
('Joshua', 'Allen', 'jallen@realestate.com', '555-0133', 'Prime Real Estate', 2, 'Las Vegas', 'NV', 'USA'),
('Emily', 'King', 'eking@bookworld.com', '555-0134', 'BookWorld Publishing', 3, 'Seattle', 'WA', 'USA'),
('Kevin', 'Wright', 'kwright@aerotech.com', '555-0135', 'AeroTech Aviation', 1, 'Dallas', 'TX', 'USA'),
('Donna', 'Scott', 'dscott@travelmore.com', '555-0136', 'TravelMore Agency', 3, 'Orlando', 'FL', 'USA'),
('Brian', 'Torres', 'btorres@securitypro.com', '555-0137', 'SecurityPro Services', 2, 'Phoenix', 'AZ', 'USA'),
('Michelle', 'Nguyen', 'mnguyen@freshfoods.com', '555-0138', 'FreshFoods Market', 2, 'San Francisco', 'CA', 'USA'),
('George', 'Hill', 'ghill@mfgindustry.com', '555-0139', 'Manufacturing Industries', 1, 'Cleveland', 'OH', 'USA'),
('Carol', 'Flores', 'cflores@eventplanner.com', '555-0140', 'Perfect Events Planning', 3, 'Denver', 'CO', 'USA'),
('Edward', 'Green', 'egreen@biotech.com', '555-0141', 'BioTech Research', 1, 'San Diego', 'CA', 'USA'),
('Ruth', 'Adams', 'radams@publiclib.org', '555-0142', 'City Public Library', 7, 'Minneapolis', 'MN', 'USA'),
('Ronald', 'Nelson', 'rnelson@insureco.com', '555-0143', 'InsureCo Insurance', 1, 'Hartford', 'CT', 'USA'),
('Sharon', 'Hill', 'shill@homegoods.com', '555-0144', 'HomeGoods Store', 3, 'Atlanta', 'GA', 'USA'),
('Timothy', 'Ramirez', 'tramirez@logisticspro.com', '555-0145', 'Logistics Pro', 2, 'Memphis', 'TN', 'USA'),
('Laura', 'Campbell', 'lcampbell@designstudio.com', '555-0146', 'Design Studio Co', 3, 'Brooklyn', 'NY', 'USA'),
('Jeffrey', 'Mitchell', 'jmitchell@autodealer.com', '555-0147', 'Auto Dealer Network', 2, 'Detroit', 'MI', 'USA'),
('Catherine', 'Roberts', 'croberts@healthclinic.com', '555-0148', 'Community Health Clinic', 7, 'Baltimore', 'MD', 'USA'),
('Gary', 'Carter', 'gcarter@steelworks.com', '555-0149', 'SteelWorks Manufacturing', 1, 'Pittsburgh', 'PA', 'USA'),
('Debra', 'Phillips', 'dphillips@edutech.com', '555-0150', 'EduTech Solutions', 4, 'Austin', 'TX', 'USA');

-- More customers (51-100)
INSERT INTO customers (first_name, last_name, email, phone, company_name, segment_id, city, state, country) VALUES
('Jason', 'Evans', 'jevans@cleanenergy.com', '555-0151', 'CleanEnergy Solutions', 2, 'Denver', 'CO', 'USA'),
('Amy', 'Turner', 'aturner@mediagroup.com', '555-0152', 'Media Group Inc', 2, 'Los Angeles', 'CA', 'USA'),
('Ryan', 'Torres', 'rtorres@citycouncil.gov', '555-0153', 'City Council Office', 5, 'Phoenix', 'AZ', 'USA'),
('Melissa', 'Parker', 'mparker@techventures.io', '555-0154', 'Tech Ventures', 4, 'San Francisco', 'CA', 'USA'),
('Jacob', 'Collins', 'jcollins@lawgroup.com', '555-0155', 'Collins Law Group', 3, 'Chicago', 'IL', 'USA'),
('Angela', 'Edwards', 'aedwards@retailchain.com', '555-0156', 'Retail Chain Corp', 1, 'Dallas', 'TX', 'USA'),
('Nicholas', 'Stewart', 'nstewart@marineship.com', '555-0157', 'Marine Shipping Co', 2, 'New Orleans', 'LA', 'USA'),
('Stephanie', 'Sanchez', 'ssanchez@beautychain.com', '555-0158', 'Beauty Chain', 2, 'Miami', 'FL', 'USA'),
('Brandon', 'Morris', 'bmorris@agritech.com', '555-0159', 'AgriTech Farms', 2, 'Kansas City', 'KS', 'USA'),
('Rebecca', 'Rogers', 'rrogers@charityorg.org', '555-0160', 'Charity Organization', 7, 'Atlanta', 'GA', 'USA'),
('Justin', 'Reed', 'jreed@constructpro.com', '555-0161', 'ConstructPro Builders', 2, 'Houston', 'TX', 'USA'),
('Nicole', 'Cook', 'ncook@fitnesscenter.com', '555-0162', 'FitnessCenter Chain', 3, 'San Diego', 'CA', 'USA'),
('Samuel', 'Morgan', 'smorgan@investbank.com', '555-0163', 'Investment Bank Corp', 1, 'New York', 'NY', 'USA'),
('Rachel', 'Bell', 'rbell@artgallery.com', '555-0164', 'Modern Art Gallery', 3, 'Santa Fe', 'NM', 'USA'),
('Benjamin', 'Murphy', 'bmurphy@techdata.com', '555-0165', 'TechData Systems', 2, 'Seattle', 'WA', 'USA'),
('Hannah', 'Bailey', 'hbailey@communitybank.com', '555-0166', 'Community Bank', 2, 'Portland', 'OR', 'USA'),
('Gregory', 'Rivera', 'grivera@metalworks.com', '555-0167', 'MetalWorks Industry', 2, 'Cleveland', 'OH', 'USA'),
('Samantha', 'Cooper', 'scooper@luxuryhotels.com', '555-0168', 'Luxury Hotels Chain', 1, 'Las Vegas', 'NV', 'USA'),
('Alexander', 'Richardson', 'arichardson@airfreight.com', '555-0169', 'AirFreight Express', 1, 'Memphis', 'TN', 'USA'),
('Victoria', 'Cox', 'vcox@onlinestore.com', '555-0170', 'OnlineStore Inc', 3, 'Austin', 'TX', 'USA'),
('Patrick', 'Howard', 'phoward@sportsclub.com', '555-0171', 'Sports Club Network', 2, 'Phoenix', 'AZ', 'USA'),
('Amanda', 'Ward', 'award@schooldistrict.edu', '555-0172', 'Regional School District', 6, 'Sacramento', 'CA', 'USA'),
('Jack', 'Torres', 'jtorres@autoparts.com', '555-0173', 'AutoParts Wholesale', 2, 'Detroit', 'MI', 'USA'),
('Christina', 'Peterson', 'cpeterson@winemakers.com', '555-0174', 'Fine Winemakers', 3, 'Napa', 'CA', 'USA'),
('Dylan', 'Gray', 'dgray@gamestudio.com', '555-0175', 'Game Studio Interactive', 4, 'Los Angeles', 'CA', 'USA'),
('Olivia', 'Ramirez', 'oramirez@coffeechain.com', '555-0176', 'Coffee Chain Inc', 2, 'Seattle', 'WA', 'USA'),
('Ethan', 'James', 'ejames@dataanalytics.io', '555-0177', 'Data Analytics Co', 4, 'Boston', 'MA', 'USA'),
('Natalie', 'Watson', 'nwatson@fashionretail.com', '555-0178', 'Fashion Retail Group', 2, 'New York', 'NY', 'USA'),
('Aaron', 'Brooks', 'abrooks@chemcorp.com', '555-0179', 'Chemical Corporation', 1, 'Houston', 'TX', 'USA'),
('Grace', 'Kelly', 'gkelly@lawoffice.com', '555-0180', 'Kelly Law Office', 3, 'Philadelphia', 'PA', 'USA'),
('Henry', 'Price', 'hprice@plasticsinc.com', '555-0181', 'Plastics Inc', 2, 'Indianapolis', 'IN', 'USA'),
('Zoe', 'Bennett', 'zbennett@animalshelter.org', '555-0182', 'City Animal Shelter', 7, 'Portland', 'OR', 'USA'),
('Nathan', 'Wood', 'nwood@railfreight.com', '555-0183', 'Rail Freight Corp', 1, 'Chicago', 'IL', 'USA'),
('Madison', 'Barnes', 'mbarnes@grocerymart.com', '555-0184', 'GroceryMart Stores', 2, 'Atlanta', 'GA', 'USA'),
('Christian', 'Ross', 'cross@oilgas.com', '555-0185', 'Oil & Gas Explorers', 1, 'Houston', 'TX', 'USA'),
('Alyssa', 'Henderson', 'ahenderson@meddevice.com', '555-0186', 'Medical Devices Inc', 1, 'Minneapolis', 'MN', 'USA'),
('Logan', 'Coleman', 'lcoleman@webservices.io', '555-0187', 'Web Services Pro', 4, 'San Jose', 'CA', 'USA'),
('Taylor', 'Jenkins', 'tjenkins@printshop.com', '555-0188', 'PrintShop Express', 3, 'Columbus', 'OH', 'USA'),
('Connor', 'Perry', 'cperry@electronics.com', '555-0189', 'Electronics Depot', 2, 'San Diego', 'CA', 'USA'),
('Julia', 'Powell', 'jpowell@nonprofithelp.org', '555-0190', 'NonProfit Helper', 7, 'Denver', 'CO', 'USA'),
('Luke', 'Long', 'llong@furnitureworld.com', '555-0191', 'Furniture World', 2, 'Charlotte', 'NC', 'USA'),
('Chloe', 'Patterson', 'cpatterson@bakerychain.com', '555-0192', 'Bakery Chain', 3, 'Nashville', 'TN', 'USA'),
('Owen', 'Hughes', 'ohughes@telecomco.com', '555-0193', 'Telecom Corporation', 1, 'Atlanta', 'GA', 'USA'),
('Lily', 'Flores', 'lflores@dancestudio.com', '555-0194', 'Dance Studio Academy', 3, 'Miami', 'FL', 'USA'),
('Isaac', 'Washington', 'iwashington@countygov.gov', '555-0195', 'County Government', 5, 'Austin', 'TX', 'USA'),
('Sophie', 'Butler', 'sbutler@jewelrystore.com', '555-0196', 'Jewelry Store Chain', 3, 'Las Vegas', 'NV', 'USA'),
('Liam', 'Simmons', 'lsimmons@aitech.io', '555-0197', 'AI Tech Innovations', 4, 'San Francisco', 'CA', 'USA'),
('Emma', 'Foster', 'efoster@yogastudio.com', '555-0198', 'Yoga Studio Network', 3, 'Los Angeles', 'CA', 'USA'),
('Mason', 'Gonzales', 'mgonzales@roofingpro.com', '555-0199', 'Roofing Professionals', 3, 'Phoenix', 'AZ', 'USA'),
('Ava', 'Bryant', 'abryant@clothingbrand.com', '555-0200', 'Clothing Brand Co', 2, 'New York', 'NY', 'USA');

-- Generate orders for entire year 2024 (this creates realistic order distribution)
-- Using a function to generate orders

DO $$
DECLARE
    order_date TIMESTAMP;
    cust_id INTEGER;
    emp_id INTEGER;
    order_num INTEGER := 10000;
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
    sales_employees INTEGER[] := ARRAY[2, 3, 4, 5, 6]; -- Sales rep IDs
    current_order_id INTEGER;
    i INTEGER;
    j INTEGER;
    month_orders INTEGER;
    day_offset INTEGER;
BEGIN
    -- Generate orders for each month of 2024
    FOR i IN 1..12 LOOP
        -- More orders in later months (growth pattern)
        month_orders := 50 + (i * 15) + floor(random() * 20);
        
        FOR j IN 1..month_orders LOOP
            -- Random day in the month
            day_offset := floor(random() * 28);
            order_date := make_timestamp(2024, i, 1 + day_offset, 
                          floor(random() * 12 + 8)::int, 
                          floor(random() * 60)::int, 
                          floor(random() * 60)::int);
            
            -- Random customer (1-100)
            cust_id := floor(random() * 100 + 1);
            
            -- Random sales rep
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
            
            -- Create order with placeholder totals
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
            
            -- Add 1-5 items to each order
            num_items := floor(random() * 5 + 1);
            order_subtotal := 0;
            
            FOR k IN 1..num_items LOOP
                -- Random product (1-30)
                prod_id := floor(random() * 30 + 1);
                qty := floor(random() * 3 + 1);
                
                SELECT price INTO unit_price FROM products WHERE products.id = prod_id;
                item_discount := CASE WHEN random() < 0.2 THEN unit_price * qty * (random() * 0.15) ELSE 0 END;
                item_total := (unit_price * qty) - item_discount;
                
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, discount, total)
                VALUES (current_order_id, prod_id, qty, unit_price, item_discount, item_total);
                
                order_subtotal := order_subtotal + item_total;
            END LOOP;
            
            -- Calculate totals
            tax_amt := order_subtotal * 0.08;
            discount_amt := CASE WHEN random() < 0.1 THEN order_subtotal * (random() * 0.1) ELSE 0 END;
            order_total := order_subtotal + tax_amt - discount_amt;
            
            -- Update order with actual totals
            UPDATE orders SET 
                subtotal = order_subtotal,
                tax = tax_amt,
                discount = discount_amt,
                total = order_total
            WHERE orders.id = current_order_id;
            
        END LOOP;
    END LOOP;
END $$;

-- Update customer lifetime values based on orders
UPDATE customers c SET lifetime_value = (
    SELECT COALESCE(SUM(o.total), 0) 
    FROM orders o 
    WHERE o.customer_id = c.id AND o.status = 'delivered'
);

-- Monthly revenue aggregation
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
) sub
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
ORDER BY year, month;

-- Expenses throughout the year
INSERT INTO expenses (category, description, amount, department_id, expense_date)
SELECT 
    category,
    description,
    base_amount * (0.8 + random() * 0.4),
    dept_id,
    make_date(2024, month, (random() * 27 + 1)::int)
FROM (
    SELECT 'Payroll' as category, 'Monthly payroll' as description, 280000.00 as base_amount, NULL as dept_id, generate_series(1, 12) as month
    UNION ALL
    SELECT 'Cloud Infrastructure', 'AWS/GCP hosting', 45000.00, 2, generate_series(1, 12)
    UNION ALL
    SELECT 'Marketing', 'Digital advertising', 25000.00, 3, generate_series(1, 12)
    UNION ALL
    SELECT 'Office Rent', 'Office space lease', 35000.00, 5, generate_series(1, 12)
    UNION ALL
    SELECT 'Software Subscriptions', 'SaaS tools', 8000.00, 2, generate_series(1, 12)
    UNION ALL
    SELECT 'Travel', 'Business travel', 12000.00, 1, generate_series(1, 12)
    UNION ALL
    SELECT 'Equipment', 'Hardware and equipment', 15000.00, 2, generate_series(1, 4)
    UNION ALL
    SELECT 'Training', 'Employee training', 5000.00, 7, generate_series(1, 4)
    UNION ALL
    SELECT 'Legal', 'Legal services', 8000.00, 6, generate_series(1, 4)
    UNION ALL
    SELECT 'Insurance', 'Business insurance', 12000.00, 6, generate_series(1, 4)
) expenses_template;

-- Support tickets throughout the year
DO $$
DECLARE
    ticket_date TIMESTAMP;
    ticket_num INTEGER := 5000;
    cust_id INTEGER;
    support_employees INTEGER[] := ARRAY[20, 21, 22, 23]; -- Support rep IDs
    assigned_emp INTEGER;
    ticket_status VARCHAR(20);
    ticket_priority VARCHAR(20);
    resolution_hours DECIMAL(10,2);
    satisfaction INTEGER;
    subjects TEXT[] := ARRAY[
        'Cannot access dashboard',
        'Integration not working',
        'Billing question',
        'Feature request',
        'Performance issue',
        'Login problems',
        'Data export help',
        'API error',
        'Report generation issue',
        'Mobile app bug',
        'Password reset',
        'Account upgrade',
        'Training request',
        'Custom report help',
        'SSO configuration'
    ];
    i INTEGER;
    j INTEGER;
    month_tickets INTEGER;
    day_offset INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        month_tickets := 30 + floor(random() * 20);
        
        FOR j IN 1..month_tickets LOOP
            day_offset := floor(random() * 28);
            ticket_date := make_timestamp(2024, i, 1 + day_offset, 
                          floor(random() * 12 + 8)::int, 
                          floor(random() * 60)::int, 0);
            
            cust_id := floor(random() * 100 + 1);
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
                satisfaction := floor(random() * 2 + 4); -- 4-5 mostly
            ELSIF ticket_date < CURRENT_TIMESTAMP - INTERVAL '2 days' THEN
                ticket_status := (ARRAY['closed', 'in_progress'])[floor(random() * 2 + 1)::int];
                IF ticket_status = 'closed' THEN
                    resolution_hours := random() * 48 + 1;
                    satisfaction := floor(random() * 3 + 3);
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

-- Marketing campaigns throughout the year
INSERT INTO campaigns (name, channel, budget, spend, impressions, clicks, conversions, revenue_attributed, start_date, end_date, status) VALUES
('Q1 Product Launch', 'Google Ads', 50000.00, 48500.00, 2500000, 75000, 450, 180000.00, '2024-01-15', '2024-03-31', 'completed'),
('Spring Sale', 'Facebook', 30000.00, 29800.00, 1800000, 54000, 320, 128000.00, '2024-03-01', '2024-03-31', 'completed'),
('Enterprise Webinar Series', 'LinkedIn', 25000.00, 24200.00, 500000, 15000, 120, 360000.00, '2024-02-01', '2024-04-30', 'completed'),
('Summer Campaign', 'Google Ads', 60000.00, 58000.00, 3000000, 90000, 540, 216000.00, '2024-06-01', '2024-08-31', 'completed'),
('Partner Promotion', 'Email', 10000.00, 9500.00, 150000, 22500, 180, 72000.00, '2024-05-01', '2024-05-31', 'completed'),
('Black Friday Deals', 'Multi-channel', 80000.00, 78000.00, 5000000, 200000, 1200, 480000.00, '2024-11-20', '2024-12-02', 'completed'),
('Year-End Push', 'Google Ads', 45000.00, 35000.00, 2000000, 60000, 350, 140000.00, '2024-12-01', '2024-12-31', 'active'),
('Content Marketing', 'Blog/SEO', 20000.00, 18000.00, 800000, 40000, 200, 80000.00, '2024-01-01', '2024-12-31', 'active'),
('Retargeting Campaign', 'Display', 15000.00, 14000.00, 1200000, 24000, 150, 60000.00, '2024-04-01', '2024-12-31', 'active'),
('Podcast Sponsorship', 'Audio', 35000.00, 35000.00, 400000, 8000, 80, 120000.00, '2024-03-01', '2024-09-30', 'completed'),
('Trade Show Presence', 'Events', 100000.00, 95000.00, 50000, 5000, 200, 600000.00, '2024-09-15', '2024-09-20', 'completed'),
('Holiday Email Blast', 'Email', 5000.00, 4800.00, 100000, 15000, 90, 36000.00, '2024-12-15', '2024-12-25', 'active');

-- Grant read-only access (for security - AI can only SELECT)
-- In production, create a read-only user for the AI queries

