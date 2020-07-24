var express = require('express');
var router = express.Router();

var middleware = require('../middleware');

var passport = require('passport');
var User = require('../models/user');

router.get('/', (req, res) => {
	res.render('campgrounds/home');
});
// **********
// AUTH ROUTES
// **********

router.get('/register', (req, res) => {
	res.render('user/register');
});

router.post('/register', (req, res) => {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash('error', 'Username Already Taken');
			res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, () => {
				req.flash('success', 'Welcome To YelpCamp ' + user.username);
				res.redirect('/campgrounds');
			});
		}
	});
});

//LOGIN AUTH

router.get('/login', (req, res) => {
	res.render('user/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	(req, res) => {}
);

// LOG OUT ROUTE

router.get('/logout', (req, res) => {
	req.logOut();
	req.flash('success', 'Logged You Out');
	res.redirect('/campgrounds');
});

module.exports = router;
