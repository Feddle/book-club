const router = require("express").Router();
const Trade = require("../models/trade-model");
const User = require("../models/user-model");

//route for homepage
router.get("/", (req, res) => {
    res.render("index.njk", {user: req.user});
});

router.get("/user/:link", (req, res, next) => {
    User.findOne({link: req.params.link}, (err, userpage) => {
        if(err) return next(err);
        else {
            Trade.find({"trader.id": userpage._id}, (err, result) => {                                            
                if(err) next(err);
                {
                    let trades = [];
                    for(let trade of result) {
                        if(trade.pending === false && trade.customer) continue;
                        trades.push(trade);
                    }
                    return res.render("user.njk", {user: req.user, userpage, trades});
                }
            });
        }
    });    
});

router.get("/books", (req, res, next) => {        
    Trade.find({pending: true}, (err, trades) => {
        if(err) next(err);
        else if(trades.length > 0) res.render("books.njk", {user: req.user, trades});
        else res.render("books.njk", {user: req.user, trades: false});
    });    
});


module.exports = router;
