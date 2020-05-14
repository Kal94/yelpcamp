var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//INDEX ROUTE
router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    })
});

//NEW FORM ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
})

//CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username.charAt(0).toUpperCase() + req.user.username.slice(1)
    }
    
    var newCampground = {name: name, image: image, description: desc, author: author}
    
    Campground.create(newCampground, function(err, addCampground){
        if(err){
            console.log(err)
        } else {
            res.redirect('/campgrounds');
        }
    })
});

//SHOW ROUTE
router.get('/:id', function(req, res){

    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
})

// EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

  

// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
})

// DELETE ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){

    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;