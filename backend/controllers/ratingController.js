const pool = require('../config/db');

exports.rateMovie = async (req, res) => {
  try {
    const { rating } = req.body;
    const { movieId } = req.params;

    console.log('Rating request:', { userId: req.user.id, movieId, rating });

    if (!rating || rating < 1 || rating > 10)
      return res.status(400).json({ message: 'Rating must be between 1 and 10' });

    await pool.query(
      'INSERT INTO ratings (user_id, movie_id, rating) VALUES (?,?,?) ON DUPLICATE KEY UPDATE rating = ?',
      [req.user.id, movieId, rating, rating]
    );

    const [rows] = await pool.query(
      'SELECT AVG(rating) as avg, COUNT(*) as total FROM ratings WHERE movie_id = ?',
      [movieId]
    );

    await pool.query(
      'UPDATE movies SET avg_rating = ?, total_ratings = ? WHERE id = ?',
      [parseFloat(rows[0].avg).toFixed(1), rows[0].total, movieId]
    );

    res.json({ message: 'Rating saved', avg_rating: rows[0].avg });
  } catch (err) {
    console.error('Rating error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: err.message });
  }
};