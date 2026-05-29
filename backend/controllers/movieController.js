const pool = require('../config/db');

exports.getAllMovies = async (req, res) => {
  try {
    const { genre, year, language, search, sort = 'avg_rating', order = 'DESC', page = 1, limit = 12 } = req.query;
    
    let query = `
      SELECT m.*, GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE 1=1
    `;
    const params = [];

    if (search) { query += ' AND m.title LIKE ?'; params.push(`%${search}%`); }
    if (year) { query += ' AND m.release_year = ?'; params.push(year); }
    if (language) { query += ' AND m.language = ?'; params.push(language); }
    if (genre) {
      query += ' AND m.id IN (SELECT movie_id FROM movie_genres mg2 JOIN genres g2 ON mg2.genre_id = g2.id WHERE g2.name = ?)';
      params.push(genre);
    }

    query += ` GROUP BY m.id ORDER BY m.${sort} ${order}`;
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const [movies] = await pool.query(query, params);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const [movies] = await pool.query(
      `SELECT m.*, GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       WHERE m.id = ? GROUP BY m.id`,
      [req.params.id]
    );
    if (!movies.length) return res.status(404).json({ message: 'Movie not found' });

    const [cast] = await pool.query('SELECT * FROM cast_crew WHERE movie_id = ?', [req.params.id]);
    const [reviews] = await pool.query(
      `SELECT r.*, u.username, u.avatar FROM reviews r
       JOIN users u ON r.user_id = u.id WHERE r.movie_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    res.json({ ...movies[0], cast, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTopRated = async (req, res) => {
  try {
    const [movies] = await pool.query(
      `SELECT m.*, GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       GROUP BY m.id ORDER BY m.avg_rating DESC LIMIT 10`
    );
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const [movies] = await pool.query(
      `SELECT m.*, GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       GROUP BY m.id ORDER BY m.total_ratings DESC LIMIT 10`
    );
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const { title, description, poster, trailer_url, release_year, language, duration, genres } = req.body;
    const [result] = await pool.query(
      'INSERT INTO movies (title, description, poster, trailer_url, release_year, language, duration) VALUES (?,?,?,?,?,?,?)',
      [title, description, poster, trailer_url, release_year, language, duration]
    );
    const movieId = result.insertId;
    if (genres && genres.length) {
      for (const genreId of genres) {
        await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES (?,?)', [movieId, genreId]);
      }
    }
    res.status(201).json({ message: 'Movie created', id: movieId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};