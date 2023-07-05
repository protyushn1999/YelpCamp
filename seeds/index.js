const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", ()=> {
    console.log("Database connected");
})

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i<50; i++){
        const random_index = Math.floor(Math.random() * 40);
        const price = Math.floor(Math.random() * 30);
        const c = new Campground({
            location: `${cities[random_index].city}, ${cities[random_index].state}`,
            title: `${descriptors[random_index]} ${places[random_index]}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt mollitia minus repellendus assumenda amet sint quae a veniam non debitis aliquam est rem odio cumque, doloribus quod fugit tenetur earum?",
            price
        })
        await c.save();
    }
}

seedDB().then(() => {
    db.close();
});
