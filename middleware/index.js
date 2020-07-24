var Campground = require('../models/campgrounds');
var Comment = require('../models/comments');

var middlewareObj = {};

middlewareObj.checkCommOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComm) {
			if (err) {
				req.flash('error', 'Comment Not Found');
				res.redirect('back');
			} else {
				if (foundComm.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Dont Have Permission');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You Need To Be Logged In To Do That !!!');
		res.redirect('back');
	}
};

middlewareObj.checkCampOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, updatedCamp) {
			if (err) {
				req.flash('error', 'Campground Not Found');
				res.redirect('back');
			} else {
				if (updatedCamp.author.id.equals(req.user._id)) {
					next();
				} else {
					res.flash('error', 'You Dont Have Permission To Do That');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You Need To Be Logged In To Do That !!!');
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'Please Login First!!!!');
	res.redirect('/login');
};

module.exports = middlewareObj;
