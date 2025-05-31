const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelpers');
const Cities = require('./cities')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected');
})
const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10)
        const camp = new Campground({
            author: '680e7ce63953f3961bcd9855',
            location: `${Cities[random1000].city}, ${Cities[random1000].state}`,
            name: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    Cities[random1000].longitude, // ✅ X (lng)
                    Cities[random1000].latitude   // ✅ Y (lat)
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwopzotne/image/upload/v1746406532/YelpCamp/m0yjudppmxcfifcpx2n1.jpg',
                    filename: 'placeholder_1'
                },
                {
                    url: 'https://res.cloudinary.com/dwopzotne/image/upload/v1746406532/YelpCamp/m0yjudppmxcfifcpx2n1.jpg',
                    filename: 'placeholder_2'
                }
            ],
            discription: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In est sunt aspernatur neque, adipisci molestiae omnis qui animi, distinctio nostrum veritatis possimus rerum sequi vel eveniet, suscipit maxime dignissimos illo.',
            price
        });
        await camp.save();
    }
}
seedDB();

