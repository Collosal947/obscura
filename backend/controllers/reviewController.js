const pool = require('../config/db');

exports.addReview = async (req, res) => {
  try {
    const { content } = req.body;
    const { movieId } = req.params;
    await pool.query(
      'INSERT INTO reviews (user_id, movie_id, content) VALUES (?,?,?)',
      [req.user.id, movieId, content]
    );
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};