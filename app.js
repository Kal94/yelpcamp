// IMPORTS
var express = require('express'),
    app = express();
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    mongoose = require('mongoose'),
    seedDB = require('./seeds'),
    User = require('./models/user'),
    Campground = require('./models/campground'),
    Comment = require("./models/comment"),
    methodOverride = require('method-override'),
    flash = require('connect-flash')
    
var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index')

// INIT REMOVE CURRENT DATA AND SEED SAMPLE DATA
// seedDB();

// MONGOOSE INITS
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: "I love Masumah",
    resave: "false",
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// EXPRESS INITS
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
app.use(methodOverride("_method"));


app.use('/', indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes)

app.listen(3000, function(){
    console.log('Server is running...');
});