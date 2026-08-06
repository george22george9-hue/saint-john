const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get Announcements
router.get('/announcements', (req, res) => {
  try {
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY createdAt DESC').all();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Database error while fetching announcements' });
  }
});

// Submit Inquiry/Feedback
router.post('/inquiries', (req, res) => {
  const { name, hymnRequest, message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message field is required.' });
  }

  try {
    const stmt = db.prepare('INSERT INTO inquiries (name, hymnRequest, message) VALUES (?, ?, ?)');
    const result = stmt.run(name || null, hymnRequest || null, message);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Inquiry submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Database error while submitting inquiry' });
  }
});

// Get Settings (Friday Time, Sunday Schedule)
router.get('/settings', (req, res) => {
  try {
    const settingsRows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    settingsRows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Database error while fetching settings' });
  }
});

// Admin Login
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});


// ==========================================
// PROTECTED ROUTES (Requires Admin Token)
// ==========================================

// Add Announcement
router.post('/admin/announcements', verifyToken, (req, res) => {
  const { title, date, description } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and Date are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO announcements (title, date, description) VALUES (?, ?, ?)');
    const result = stmt.run(title, date, description || '');
    res.status(201).json({ id: result.lastInsertRowid, message: 'Announcement created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Delete Announcement
router.delete('/admin/announcements/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  
  try {
    const result = db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// Get All Inquiries
router.get('/admin/inquiries', verifyToken, (req, res) => {
  try {
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY createdAt DESC').all();
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Update Settings
router.post('/admin/settings', verifyToken, (req, res) => {
  const { friday_time, sunday_schedule } = req.body;

  try {
    const stmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    
    if (friday_time) {
      stmt.run(friday_time, 'friday_time');
    }
    if (sunday_schedule) {
      stmt.run(sunday_schedule, 'sunday_schedule');
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
