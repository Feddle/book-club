
require("dotenv").config();
const express = require("express");
const nunjucks = require("nunjucks");
const helmet = require("helmet");
const passport = require("passport");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes.js");
const passportSetup = require("./config/passport-setup");
const User = require("./models/user-model");
const Trade = require("./models/trade-model");

const app = express();
const url = "mongodb://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.DB_HOST+":"+process.env.DB_PORT+"/"+process.env.DB_NAME;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(helmet());
app.use(express.static("public"));
app.use(cookieParser());


nunjucks.configure("views", {
    autoescape: true,
    express: app
});

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(url, () => {
    console.log("connected to mongodb");
    createTestUsers();
});

function createTestUsers() {
    let users = [];
    for(let i = 1; i < 6; i++) {
        users.push({username: `test${i}`, password: "12345", link: crypto.randomBytes(3).toString("hex")});
    }    
    User.insertMany(users, (err) => {if(err) console.log("test users already exist, creation skipped");});
}

app.use("/auth", authRoutes);
app.use("/my", userRoutes);

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect("/auth");
    } else {
        next();
    }
};

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

app.post("/books", authCheck, urlencodedParser, (req, res, next) => {
    let trade_id = req.body.trade_id;
    if(trade_id == req.user.id) return next("trading error");
    Trade.updateOne({_id: trade_id}, {customer: {id: req.user.id, username: req.user.username, link: req.user.link}}, (err) => {
        if(err) next(err);
        else return res.redirect("/my/trades");
    });
});

//default route
app.get("*", (req, res) => {
    res.status(404).end("Page not found");
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});



const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});


