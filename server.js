
require("dotenv").config();
const {createTestUsers} = require("./utils/utilFunc");
const express = require("express");
const nunjucks = require("nunjucks");
const helmet = require("helmet");
const passport = require("passport");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes.js");
require("./config/passport-setup");
const User = require("./models/user-model");
const Trade = require("./models/trade-model");

const app = express();
const url = "mongodb://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.DB_HOST+":"+process.env.DB_PORT+"/"+process.env.DB_NAME;


app.use(express.static("public"));
app.use(cookieParser());


nunjucks.configure("views", {
    autoescape: true,
    express: app
});

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
    secure: process.env.ENVIRONMENT === "production" ? true : false,
    sameSite: "lax"
}));

app.use(passport.initialize());
app.use(passport.session());

if(process.env.ENVIRONMENT === "production") {
    app.use(helmet(require("./config/helmet-setup")));  
    app.all("*", checkHttps);
}

function checkHttps(req, res, next){
    if(req.get("X-Forwarded-Proto").indexOf("https") != -1) return next();
    else res.redirect("https://" + req.hostname + req.url);
}

app.use("/auth", authRoutes);
app.use("/my", userRoutes);

mongoose.connect(url, () => {
    console.log("connected to mongodb");    
    User.insertMany(createTestUsers(), (err) => {
        if(err) console.log("Test users already exist, creation skipped");
        else console.log("Test users created");
    });
});


//route for homepage
app.get("/", (req, res) => {
    res.render("index.njk", {user: req.user});
});

app.get("/user/:link", (req, res, next) => {
    User.findOne({link: req.params.link}, (err, userpage) => {
        if(err) return next(err);
        else {
            Trade.find({"trader.id": userpage._id}, (err, trades) => {                                            
                if(err) next(err);
                else return res.render("user.njk", {user: req.user, userpage, trades});
            });
        }
    });    
});

app.get("/books", (req, res, next) => {        
    Trade.find({pending: true}, (err, trades) => {
        if(err) next(err);
        else if(trades.length > 0) res.render("books.njk", {user: req.user, trades});
        else res.render("books.njk", {user: req.user, trades: false});
    });    
});


//default route
app.get("*", (req, res) => {
    res.status(404).end("Page not found");
});


app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});



const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});


