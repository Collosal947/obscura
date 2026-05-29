const router = require('express').Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist, getFavorites, addToFavorites, removeFromFavorites } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/watchlist', protect, getWatchlist);
router.post('/watchlist/:movieId', protect, addToWatchlist);
router.delete('/watchlist/:movieId', protect, removeFromWatchlist);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:movieId', protect, addToFavorites);
router.delete('/favorites/:movieId', protect, removeFromFavorites);

module.exports = router;