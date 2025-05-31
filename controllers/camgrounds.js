const Campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY || 'P3pXelq30FtYV8krKggn';
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds, maptilerApiKey: process.env.MAPTILER_API_KEY })
}
module.exports.new = (req, res) => {
    res.render('campgrounds/new')
}
module.exports.createCampground = async (req, res) => {
    //    if (!req.body.campground) next(new ExpressError('Invalid Campground', 400))
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    console.log(campground.geometry);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log('FILES:', req.files);
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.editCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Could not find the campground :(')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log('DELETE IMAGES:', req.body.deleteImages);

    }
    req.flash('success', 'Successfully edited the campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds')
}
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Could not find the campground :(')
        return res.redirect('/campgrounds')
    }
    console.log("Geometry for campground:", campground.geometry);

    res.render('campgrounds/show', { campground, maptilerApiKey: process.env.MAPTILER_API_KEY });

}