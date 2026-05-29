const router = require('express').Router();
const { rateMovie } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/:movieId', protect, rateMovie);

module.exports = router;