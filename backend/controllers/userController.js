const pool = require('../config/db');

exports.getWatchlist = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.* FROM watchlist w JOIN movies m ON w.movie_id = m.id WHERE w.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    await pool.query(
      'INSERT IGNORE INTO watchlist (user_id, movie_id) VALUES (?,?)',
      [req.user.id, req.params.movieId]
    );
    res.json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [req.user.id, req.params.movieId]
    );
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.* FROM favorites f JOIN movies m ON f.movie_id = m.id WHERE f.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, movie_id) VALUES (?,?)',
      [req.user.id, req.params.movieId]
    );
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?',
      [req.user.id, req.params.movieId]
    );
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};