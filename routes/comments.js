var express = require('express');
var router = express.Router({ mergeParams: true });

var middleware = require('../middleware');

var Campground = require('../models/campgrounds');
var Comment = require('../models/comments');

router.get('/new', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, camp) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.render('comments/new', { camp: camp });
		}
	});
});

router.post('/', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, camp) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, (err, comm) => {
				if (err) {
					res.flash('error', 'You Dont Have Permission To Do That');
					res.redirect('/campgrounds');
				} else {
					comm.author.id = req.user._id;
					comm.author.username = req.user.username;
					comm.save();
					camp.comments.push(comm);
					camp.save();
					req.flash('success', 'Successfully Added A Comment');
					res.redirect('/campgrounds/' + camp._id);
				}
			});
		}
	});
});

router.get('/:comment_id/edit', middleware.checkCommOwnership, (req, res) => {
	var camp_id = req.params.id;
	Comment.findById(req.params.comment_id, (err, foundComm) => {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { camp_id: camp_id, comm: foundComm });
		}
	});
});

router.put('/:comment_id', middleware.checkCommOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComm) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

router.delete('/:comment_id', middleware.checkCommOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Successfully Deleted A Comment');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
