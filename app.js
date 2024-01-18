if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// .env file should not be uploaded when prouduction(public) so we set that we'll use .env only during development and not during production

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const passport = require("passport")
const localStratergy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const { log } = require('console');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "greatestsecret",
    resaved: false,
    saveUninitialized: true,
    cookie: {
        expries: Date.now() + 7 * 24 * 60 * 60 * 1000, //(days, hours, minutes, seconds, milliseconds)
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// app.get("/", (req, res)=>{
//     res.send("root page");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // storing user info when the session starts
passport.deserializeUser(User.deserializeUser());  // when the session ends we need to remove the user info

main()
    .then(()=>{
        console.log("connected to db");
    }).catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  // in navbar.ejs we can't use req.user directly so we take the res.locals path
    next();
}) 


// DemoUser
// app.get("/demouser", async (req, res)=>{
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username: "phoenix",
//     });
//     let registeredUser = await User.register(fakeuser, "phoenix#12#") // phoenix#12# is the password
//     res.send(registeredUser);
// });

app.use("/listings", listingsRouter);  // use listings(required one above) whereever /listings is present,  "/listings" = "/"
app.use("/listings/:id/reviews", reviewsRouter);  // we'll take out common path from all those routes from reviews 
// implies: "/listings/:id/reviews" = "/""
app.use("/", userRouter);

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
})

app.use((err, req, res, next)=>{
    let {status=500, message="Something went wrong"} = err;
    res.status(status).render("error.ejs", {message});
});

app.listen(8080, ()=>{
    console.log("listening to port 8080");  
});