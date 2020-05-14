var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

// ROOT ROUTE (REDIRECTS TO INDEX ROUTE)
router.get('/', function(req, res){
    res.redirect('/campgrounds');
});

// REGISTER ROUTES
router.get('/register', function(req, res){
    res.render('register');
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            return res.render('register');
        }
        else{
            passport.authenticate('local')(req, res, function(){
                console.log(user);
                res.redirect('/campgrounds');
            })
        }
    });
});

// LOGIN ROUTES
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds', 
        failureRedirect: '/login'
    }), 
        function(req, res){});

// PROFILE ROUTES
router.get('/profile/:user_id', middleware.isLoggedIn, function(req, res){

    User.findById(req.params.user_id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render('profile', {user: foundUser});
        }
    });
});

// LOGOUT ROUTE
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Successfully logged out')
    res.redirect('/campgrounds');
});

module.exports = router;