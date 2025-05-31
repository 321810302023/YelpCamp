const express = require('express');
const catchAsync = require('../utils/catchAsync');

const campgrounds = require('../controllers/camgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


const router = express.Router()

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
router.get('/new', isLoggedIn, campgrounds.new)
router.route('/:id')
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))
module.exports = router;