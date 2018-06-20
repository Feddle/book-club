const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new LocalStrategy((username, password, done) => {              
        User.findOne({ username }, (err, user) => {                
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: "Authentication failed, please try again" }); }
            if (user.password != password) { return done(null, false, { message: "Authentication failed, please try again" }); }
            return done(null, user);
        });
    })
);

passport.use(
    new TwitterStrategy({        
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET        
    }, (token, tokenSecret, profile, done) => {           
        User.findOne({twitterId: profile.id}).then((currentUser) => {
            if(currentUser){                
                done(null, currentUser);
            } else {                
                new User({
                    twitterId: profile.id,
                    username: profile.username,
                    link: crypto.randomBytes(3).toString("hex")                    
                }).save().then((newUser) => {                    
                    done(null, newUser);
                });
            }
        });
    })
);
