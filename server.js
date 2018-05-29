
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
const passportSetup = require("./config/passport-setup");
const Book = require("./models/book-model");
const User = require("./models/user-model");

const app = express();
const url = "mongodb://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.DB_HOST+":"+process.env.DB_PORT+"/"+process.env.DB_NAME;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(helmet());
app.use(express.static("public"))
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
    console.log('connected to mongodb');
});

app.use("/auth", authRoutes);


//route for homepage
app.get("/", (req, res, next) => {
  res.render("index.html");
});




//default route
app.get("*", (req, res) => {
  res.status(404).end("Page not found");
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err);
});



const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});


