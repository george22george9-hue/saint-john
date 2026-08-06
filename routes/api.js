const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../db/database');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get Announcements
router.get('/announcements', async (req, res) => {
  try {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .order('createdAt', { ascending: false });
      
    if (error) throw error;
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while fetching announcements' });
  }
});

// Submit Inquiry/Feedback
router.post('/inquiries', async (req, res) => {
  const { name, hymnRequest, message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message field is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{ name: name || null, hymnRequest: hymnRequest || null, message }])
      .select();
      
    if (error) throw error;
    res.status(201).json({ id: data[0].id, message: 'Inquiry submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while submitting inquiry' });
  }
});

// Get Settings (Friday Time, Sunday Schedule)
router.get('/settings', async (req, res) => {
  try {
    const { data: settingsRows, error } = await supabase
      .from('settings')
      .select('*');
      
    if (error) throw error;
    
    const settings = {};
    settingsRows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while fetching settings' });
  }
});

// Admin Login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);
      
    if (error) throw error;
    
    const user = users[0];
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
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// ==========================================
// PROTECTED ROUTES (Requires Admin Token)
// ==========================================

// Add Announcement
router.post('/admin/announcements', verifyToken, async (req, res) => {
  const { title, date, description } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and Date are required' });
  }

  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert([{ title, date, description: description || '' }])
      .select();
      
    if (error) throw error;
    res.status(201).json({ id: data[0].id, message: 'Announcement created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Delete Announcement
router.delete('/admin/announcements/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// Get All Inquiries
router.get('/admin/inquiries', verifyToken, async (req, res) => {
  try {
    const { data: inquiries, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('createdAt', { ascending: false });
      
    if (error) throw error;
    res.json(inquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Update Settings
router.post('/admin/settings', verifyToken, async (req, res) => {
  const { friday_time, sunday_schedule } = req.body;

  try {
    if (friday_time) {
      await supabase.from('settings').update({ value: friday_time }).eq('key', 'friday_time');
    }
    if (sunday_schedule) {
      await supabase.from('settings').update({ value: sunday_schedule }).eq('key', 'sunday_schedule');
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
