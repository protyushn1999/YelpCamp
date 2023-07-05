const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const Campground = require('./models/campground');
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

// create a campground
app.get('/campgrounds/new', async(req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds', async(req, res) => {
    const data = req.body.campground;
    console.log(data);
    const campground = new Campground(data);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});
// update a campground
app.get('/campgrounds/:id/edit', async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});
app.put('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
});
// delete a campgrounds
app.delete('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

// show a campground
app.get('/campgrounds/:id', async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

// show all campgrounds
app.get('/campgrounds', async(req, res) => {
    // sort aplhabetically

    const campgrounds = await Campground.find({}).sort({ location: 1 });
    res.render('campgrounds/index', { campgrounds });
});
app.listen(PORT, () =>{
    console.log(`Yelpcamp app listening on port ${PORT}!`);

})
