const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    trader: {
        id: Schema.Types.ObjectId,
        username: String,
        link: String
    },
    customer: {
        id: Schema.Types.ObjectId,
        username: String,
        link: String
    },          
    date: Date,
    pending: { type: Boolean, required: true },    
    book: {
        title: String,
        author: String,
        cover: String,
        link: String
    }        
});

const Trade = mongoose.model("book-club-trades", tradeSchema);


module.exports = Trade;
