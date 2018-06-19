const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, unique: true},
    twitterId: String,
    password: String,
    country: String,
    city: String,
    link: String,    
    trades: [Schema.Types.ObjectId]
});

const User = mongoose.model("book-club-users", userSchema);


module.exports = User;
