var express = require('express');
var router = express.Router();

var middleware = require('../middleware');

var Campground = require('../models/campgrounds');

router.get('/', (req, res) => {
	Campground.find({}, (err, camp) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: camp });
		}
	});
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.post('/', middleware.isLoggedIn, (req, res) => {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var des = req.body.des;
	var au = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = { name: name, price: price, image: image, description: des, author: au };
	Campground.create(newCampground, function(err, camp) {
		if (err) {
			console.log(err);
		} else {
			req.flash('success', 'Campground Added Succesfully');
			res.redirect('/campgrounds');
		}
	});
});

router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec(function(err, camp) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/show', { camp: camp });
		}
	});
});

router.get('/:id/edit', middleware.checkCampOwnership, (req, res) => {
	Campground.findById(req.params.id, function(err, updatedCamp) {
		if (err) {
			res.flash('error', 'You Dont Have Permission To Do That');
		}
		res.render('campgrounds/edit', { camp: updatedCamp });
	});
});

router.put('/:id', middleware.checkCampOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campg, (err, updatedCamp) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect(req.params.id);
		}
	});
});

router.delete('/:id', middleware.checkCampOwnership, (req, res) => {
	Campground.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;
