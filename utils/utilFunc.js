const crypto = require("crypto");

function authCheck(req, res, next) {
    if(!req.user){
        return res.redirect("/auth");
    } else {
        return next();
    }
}

function createTestUsers() {
    let users = [];
    for(let i = 1; i < 6; i++) {
        users.push({username: `test${i}`, password: "12345", link: crypto.randomBytes(3).toString("hex")});
    }    
    return users;    
}


//Sorts an array of trades into array containing array of pending trades and array of trade history
//if the length of either array is 0 that array will be replaced with the value false in the returned array
function sortTrades(trades) {
    let pendingTrades = [];
    let tradeHistory = [];
    for(let trade of trades) {
        if(trade.pending) pendingTrades.push(trade);
        else {
            let new_trade = {
                trader: trade.trader,
                customer: trade.customer,
                book: trade.book,
                _id: trade._id,
                pending: trade.pending,
                date: new Date(trade.date).toUTCString()
            };
            tradeHistory.push(new_trade);
        }
    }     
    return [pendingTrades.length > 0 ? pendingTrades : false, tradeHistory.length > 0 ? tradeHistory : false];
}

module.exports = {authCheck, createTestUsers, sortTrades};