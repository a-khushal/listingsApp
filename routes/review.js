const express = require("express");
const router = express.Router({mergeParams: true}); // mergeParams: Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence.
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");

// reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.newReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;