var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var axios = require('axios');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

var User = require('./models/user');
var Campground = require('./models/campgrounds');
var Comment = require('./models/comments');

var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

const seedDB = require('./seeds');
mongoose
	.connect(
		process.env.MONGO_URL ||
			'mongodb+srv://mubariz:Hitchcloak69@@cluster0.eoedk.mongodb.net/yelp-clone?retryWrites=true&w=majority',
		{
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => console.log('Connected To DB!'))
	.catch((error) => console.log(error.message));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(flash());

//seedDB();

//PASSPORT CONFIGURATION
var session2 = require('express-session');
var MongoStore = require('connect-mongo')(session2);
const { session } = require('passport');
app.use(
	session2({
		secret: 'my apps secret',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// restful routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//*********************

app.get('/*', (req, res) => {
	res.send('<h1>This Page Does not Exist</h1>');
});

app.listen(3002, () => {
	console.log('Server started');
});
