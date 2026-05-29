const router = require('express').Router();
const { getAllMovies, getMovieById, getTopRated, getTrending, createMovie, deleteMovie } = require('../controllers/movieController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllMovies);
router.get('/top-rated', getTopRated);
router.get('/trending', getTrending);
router.get('/:id', getMovieById);
router.post('/', protect, adminOnly, createMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

module.exports = router;