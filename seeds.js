var mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment');

var data = [
    {
        name: "Cloud's Rest",
        image: "https://www.yosemitehikes.com/images/ns/clouds-rest-trail-1100w.jpg",
        description: "Clouds Rest is a mountain in Yosemite National Park east northeast of Yosemite Village, California."
    },
    {
        name: "Forest of Deen",
        image: "https://www.holidaycottages.co.uk/assets/images/towns/Forest%20of%20Dean%20top.jpg",
        description: "The Forest of Dean is a geographical, historical and cultural region in the western part of the county of Gloucestershire, England."
    },
    {
        name: "Beryl's Campsite",
        image: "https://static.wixstatic.com/media/b692d5_6a46b51bbc3641009998c837c0b3f8bd~mv2_d_4032_3024_s_4_2.jpg/v1/fit/w_1024,h_768,al_c,q_80/file.jpg",
        description: "Known by locals simply as “the one run by Beryl”, this rustic little site is the perfect sanctuary from which to explore Devon."
    }
];

function seedDB(){
    Campground = require('./models/campground');

    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed campgrounds successfully.");

        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log('create campground');

                    Comment.create({
                        text: "This place is great but I wish there was internet",
                        author: "Homer"
                    },
                    function(err, comment){
                        if(err){
                            console.log(err)
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created comment")
                        }
                        
                    });
                }
            });
        });
    });

}

module.exports = seedDB;