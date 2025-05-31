const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('Mongo Connection Open!');
    })
    .catch(err => {
        console.log('Mongo Connection Error');
        console.log(err);
    });

async function fixReviews() {
    const reviews = await Review.find({});
    for (let review of reviews) {
        if (!review.author) {
            console.log(`Deleting broken review: ${review._id}`);
            await Review.findByIdAndDelete(review._id);
            await Campground.updateMany(
                { reviews: review._id },
                { $pull: { reviews: review._id } }
            );
        }
    }
    console.log('Done cleaning broken reviews.');
    mongoose.connection.close();
}

fixReviews();
