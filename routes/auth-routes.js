const router = require("express").Router();
const passport = require("passport");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(flash());

router.get("/", (req, res) => {    
    if(req.user) res.redirect("/");
    else res.render("sign-in.njk", {message: req.flash("error")});
});

// auth logout
router.get("/signout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.post("/local", urlencodedParser, 
    passport.authenticate("local", {
        successRedirect: "/my/trades",
        failureRedirect: "/auth",
        failureFlash: true 
    })
);

router.get("/twitter", passport.authenticate("twitter"));


router.get("/twitter/redirect", passport.authenticate("twitter"), (req, res) => {    
    res.redirect("/my/trades");
});

module.exports = router;
