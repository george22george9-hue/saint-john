const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Ensure db directory exists
const dbDir = path.resolve(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to SQLite database
const dbPath = path.join(dbDir, 'app.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    hymnRequest TEXT,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
  );
`);

// Seed default Admin user if not exists
const adminEmail = 'admin@example.com'; // Default email, can be changed
const getAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);

if (!getAdmin) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('admin123', salt);
  db.prepare('INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)').run(adminEmail, hash, 'admin');
  console.log('Default admin user seeded: admin@example.com / admin123');
}

// Seed default settings if they don't exist
const checkSetting = db.prepare('SELECT * FROM settings WHERE key = ?');
const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');

if (!checkSetting.get('friday_time')) {
  insertSetting.run('friday_time', 'كل يوم جمعة الساعة 6:00 مساءً');
}
if (!checkSetting.get('sunday_schedule')) {
  insertSetting.run('sunday_schedule', '5 دقائق - صلاة الافتتاح - البدء بالصلاة وطلب بركة الروح القدس.\\n15 دقيقة - كسر الجليد وتنشيط - لعبة سريعة لكسر الجليد.\\n60 دقيقة - محاضرة عقيدية - دراسة لاهوتية مبسطة.\\n30 دقيقة - ورشة عمل - تطبيق عملي.\\n15 دقيقة - استراحة - ضيافة.\\n30 دقيقة - محاضرة مهارات - تطوير المهارات الشخصية.\\n15 دقيقة - فقرة ترفيهية - ألعاب ختامية.');
}

module.exports = db;
