const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))  // Index route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)) //create route

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))  // update route
    .get(wrapAsync(listingController.showListing))  // show route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))  // delete route

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));




// Index route
// router.get("/", wrapAsync(listingController.index));

// create route
// here validateListing is being passed as a middleware
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// show route
// router.get("/:id", wrapAsync(listingController.showListing)); 

// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;