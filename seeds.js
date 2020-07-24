var mongoose = require('mongoose');
var Campground = require('./models/campgrounds');
var Comment = require('./models/comments');

var seeds = [
	{
		name: 'jacob',
		image: 'https://th.bing.com/th/id/OIP.kPTdQyGAsWarnGrZE93kOwHaE8?w=257&h=180&c=7&o=5&pid=1.7',
		description: 'This a vry cool cat, likes to play with everybody'
	},
	{
		name: 'Hill',
		image: 'https://th.bing.com/th/id/OIP.feVR2sSdqozVFq1rY5Fj7gHaEK?w=305&h=180&c=7&o=5&pid=1.7',
		description: 'This a vry cool cat, likes to play with everybody'
	},
	{
		name: 'Tobi',
		image: 'https://th.bing.com/th/id/OIP.kPTdQyGAsWarnGrZE93kOwHaE8?w=257&h=180&c=7&o=5&pid=1.7',
		description: 'This a vry cool cat, likes to play with everybody'
	}
];

async function seedDB() {
	try {
		await Campground.deleteMany({});
		await Comment.deleteMany({});

		for (var seed of seeds) {
			var camp = await Campground.create(seed);
			var comm = await Comment.create({
				text: 'Yeah its true that this is a pretty cool cat, agreed',
				author: 'Linda Grey'
			});
			camp.comments.push(comm);
			camp.save();
			console.log('comment added');
		}
	} catch (err) {
		console.log(err);
	}
}

module.exports = seedDB;
