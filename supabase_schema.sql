-- 1. Table for Admin Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
);

-- 2. Table for Announcements
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Table for Youth Inquiries
CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    name TEXT,
    "hymnRequest" TEXT,
    message TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Table for Website Settings
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
);

-- 5. Seed Default Admin User (Password is 'admin123' encrypted with bcrypt)
INSERT INTO users (email, "passwordHash", role) 
VALUES ('admin@example.com', '$2a$10$tZ2.Q8nZ6.U1w1L1oX3L2eM9z1H1I8T6.Y7Y2z/rU7qGqR3wY1r1O', 'admin');

-- 6. Seed Default Settings
INSERT INTO settings (key, value) VALUES 
('friday_time', 'كل يوم جمعة الساعة 7:00 مساءً'),
('sunday_schedule', '5 دقائق - صلاة الافتتاح - البدء بالصلاة وطلب بركة الروح القدس.
15 دقيقة - كسر الجليد وتنشيط - لعبة سريعة لكسر الجليد.
60 دقيقة - محاضرة عقيدية - دراسة لاهوتية مبسطة.
30 دقيقة - ورشة عمل - تطبيق عملي.
15 دقيقة - استراحة - ضيافة.
30 دقيقة - محاضرة مهارات - تطوير المهارات الشخصية.
15 دقيقة - فقرة ترفيهية - ألعاب ختامية.');
