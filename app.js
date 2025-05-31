// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }
require('dotenv').config();
console.log('🧪 MAPTILER_API_KEY:', process.env.MAPTILER_API_KEY);


const express = require('express');
const app = express();
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
// const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];

const session = require('express-session');
const sessionConfig = {
    secret: 'Angel',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressErrors');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const userRoutes = require('./routes/user')
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');



mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected');
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize())
app.use(express.static(path.join(__dirname, 'public')))
// app.use(helmet({ contentSecuritypolicy: false }));

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/review', reviewRoutes)

//practise sessions

//app.get('/fakeuser', async (req, res) => {
//const user = new User({ email: 'kedarnathsreeram@gmail.com', username: 'KedarnathSreeram' });
//const newUser = await User.register(user, 'Angel')
//   res.send(newUser)
//})
//app.get('/viewcount', (req, res) => {
//   if (req.session.count) {
//        req.session.count += 1;
//    } else {
//        req.session.count = 1;
//    }
//    res.send(`You opened this for ${req.session.count}th time`)
//})
//app.get('/register', (req, res) => {
//    const { username = 'Anonymous' } = req.query;
//    req.session.username = username;
//    res.redirect('/greet')
//})
//app.get('/greet', (req, res) => {
//    const { username } = req.session;
//    res.send(`Hey there, My lovely ${username}`)
//})

// Yelp-camp
app.get('/', (req, res) => {
    res.render('home')
})
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('page not found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err;
    if (!err.message) err.message = 'Ohh Noo, Something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})





