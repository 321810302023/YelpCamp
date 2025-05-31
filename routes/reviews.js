const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.newReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;