const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")

router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login' , failureFlash: true}), userController.login);

router.get("/logout", userController.logout);


// router.get("/signup", userController.signupForm);

// router.post("/signup", wrapAsync(userController.signup));

// router.get("/login", userController.loginForm);

// // passport.authenticate is a middleware
// router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login' , failureFlash: true}), userController.login);

module.exports = router;

