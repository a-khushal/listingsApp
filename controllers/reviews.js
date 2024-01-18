const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.newReview = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new review created");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    // pull is used to delete the review array from the listing as well
    await Review.findByIdAndDelete(reviewId);   
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
};