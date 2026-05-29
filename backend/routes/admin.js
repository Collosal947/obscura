const router = require('express').Router();
const pool = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ? AND role != "admin"', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/genres', protect, adminOnly, async (req, res) => {
  try {
    const [genres] = await pool.query('SELECT * FROM genres ORDER BY name');
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;