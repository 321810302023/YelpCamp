const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const fixGeometry = async () => {
    const campgrounds = await Campground.find({
        $or: [
            { 'geometry.coordinates': { $exists: false } },
            { 'geometry.coordinates': { $size: 0 } }
        ]
    });

    for (let camp of campgrounds) {
        camp.geometry = {
            type: 'Point',
            coordinates: [-98.5795, 39.8283] // Center of USA
        };
        await camp.save();
        console.log(`Fixed: ${camp.name}`);
    }

    mongoose.connection.close();
};

fixGeometry();
