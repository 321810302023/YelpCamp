const User = require('../models/user');
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'we are very happy to Welcome, here to the  Yelpcamp')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/login')

    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.userLogin = (req, res) => {
    req.flash('success', 'Welcome back!!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'you have been logged out, See you again my FRIEND');
        res.redirect('/campgrounds')
    });
}