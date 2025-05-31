const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/user');
router.route('/register')
    .get(users.renderRegister)
    .post(users.userRegister)
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.userLogin)
router.get('/logout', users.logout)
module.exports = router;