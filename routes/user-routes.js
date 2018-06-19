const router = require("express").Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("../models/user-model");
const Trade = require("../models/trade-model");
const axios = require("axios");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect("/auth");
    } else {
        next();
    }
};

router.use(authCheck);



router.get("/settings", (req, res) => {
    res.render("settings.njk", { user: req.user });
});

router.post("/settings", urlencodedParser, (req, res) => {
    let newCity = req.body.city;
    let newCountry = req.body.country;
    let newSettings = {country: newCountry, city: newCity};
    const regex = /^([a-zA-Z\u0080-\u024F]+(?:(\. )|-| |'))*[a-zA-Z\u0080-\u024F]*$/gm;
    let countries = ["Afghanistan (AF)", "Åland Islands (AX)", "Albania (AL)", "Algeria (DZ)", "American Samoa (AS)", "Andorra (AD)", "Angola (AO)", "Anguilla (AI)", "Antarctica (AQ)", "Antigua & Barbuda (AG)", "Argentina (AR)", "Armenia (AM)", "Aruba (AW)", "Ascension Island (AC)", "Australia (AU)", "Austria (AT)", "Azerbaijan (AZ)", "Bahamas (BS)", "Bahrain (BH)", "Bangladesh (BD)", "Barbados (BB)", "Belarus (BY)", "Belgium (BE)", "Belize (BZ)", "Benin (BJ)", "Bermuda (BM)", "Bhutan (BT)", "Bolivia (BO)", "Bosnia & Herzegovina (BA)", "Botswana (BW)", "Brazil (BR)", "British Indian Ocean Territory (IO)", "British Virgin Islands (VG)", "Brunei (BN)", "Bulgaria (BG)", "Burkina Faso (BF)", "Burundi (BI)", "Cambodia (KH)", "Cameroon (CM)", "Canada (CA)", "Canary Islands (IC)", "Cape Verde (CV)", "Caribbean Netherlands (BQ)", "Cayman Islands (KY)", "Central African Republic (CF)", "Ceuta & Melilla (EA)", "Chad (TD)", "Chile (CL)", "China (CN)", "Christmas Island (CX)", "Cocos (Keeling) Islands (CC)", "Colombia (CO)", "Comoros (KM)", "Congo - Brazzaville (CG)", "Congo - Kinshasa (CD)", "Cook Islands (CK)", "Costa Rica (CR)", "Côte d’Ivoire (CI)", "Croatia (HR)", "Cuba (CU)", "Curaçao (CW)", "Cyprus (CY)", "Czechia (CZ)", "Denmark (DK)", "Diego Garcia (DG)", "Djibouti (DJ)", "Dominica (DM)", "Dominican Republic (DO)", "Ecuador (EC)", "Egypt (EG)", "El Salvador (SV)", "Equatorial Guinea (GQ)", "Eritrea (ER)", "Estonia (EE)", "Ethiopia (ET)", "Eurozone (EZ)", "Falkland Islands (FK)", "Faroe Islands (FO)", "Fiji (FJ)", "Finland (FI)", "France (FR)", "French Guiana (GF)", "French Polynesia (PF)", "French Southern Territories (TF)", "Gabon (GA)", "Gambia (GM)", "Georgia (GE)", "Germany (DE)", "Ghana (GH)", "Gibraltar (GI)", "Greece (GR)", "Greenland (GL)", "Grenada (GD)", "Guadeloupe (GP)", "Guam (GU)", "Guatemala (GT)", "Guernsey (GG)", "Guinea (GN)", "Guinea-Bissau (GW)", "Guyana (GY)", "Haiti (HT)", "Honduras (HN)", "Hong Kong SAR China (HK)", "Hungary (HU)", "Iceland (IS)", "India (IN)", "Indonesia (ID)", "Iran (IR)", "Iraq (IQ)", "Ireland (IE)", "Isle of Man (IM)", "Israel (IL)", "Italy (IT)", "Jamaica (JM)", "Japan (JP)", "Jersey (JE)", "Jordan (JO)", "Kazakhstan (KZ)", "Kenya (KE)", "Kiribati (KI)", "Kosovo (XK)", "Kuwait (KW)", "Kyrgyzstan (KG)", "Laos (LA)", "Latvia (LV)", "Lebanon (LB)", "Lesotho (LS)", "Liberia (LR)", "Libya (LY)", "Liechtenstein (LI)", "Lithuania (LT)", "Luxembourg (LU)", "Macau SAR China (MO)", "Macedonia (MK)", "Madagascar (MG)", "Malawi (MW)", "Malaysia (MY)", "Maldives (MV)", "Mali (ML)", "Malta (MT)", "Marshall Islands (MH)", "Martinique (MQ)", "Mauritania (MR)", "Mauritius (MU)", "Mayotte (YT)", "Mexico (MX)", "Micronesia (FM)", "Moldova (MD)", "Monaco (MC)", "Mongolia (MN)", "Montenegro (ME)", "Montserrat (MS)", "Morocco (MA)", "Mozambique (MZ)", "Myanmar (Burma) (MM)", "Namibia (NA)", "Nauru (NR)", "Nepal (NP)", "Netherlands (NL)", "New Caledonia (NC)", "New Zealand (NZ)", "Nicaragua (NI)", "Niger (NE)", "Nigeria (NG)", "Niue (NU)", "Norfolk Island (NF)", "North Korea (KP)", "Northern Mariana Islands (MP)", "Norway (NO)", "Oman (OM)", "Pakistan (PK)", "Palau (PW)", "Palestinian Territories (PS)", "Panama (PA)", "Papua New Guinea (PG)", "Paraguay (PY)", "Peru (PE)", "Philippines (PH)", "Pitcairn Islands (PN)", "Poland (PL)", "Portugal (PT)", "Puerto Rico (PR)", "Qatar (QA)", "Réunion (RE)", "Romania (RO)", "Russia (RU)", "Rwanda (RW)", "Samoa (WS)", "San Marino (SM)", "São Tomé & Príncipe (ST)", "Saudi Arabia (SA)", "Senegal (SN)", "Serbia (RS)", "Seychelles (SC)", "Sierra Leone (SL)", "Singapore (SG)", "Sint Maarten (SX)", "Slovakia (SK)", "Slovenia (SI)", "Solomon Islands (SB)", "Somalia (SO)", "South Africa (ZA)", "South Georgia & South Sandwich Islands (GS)", "South Korea (KR)", "South Sudan (SS)", "Spain (ES)", "Sri Lanka (LK)", "St. Barthélemy (BL)", "St. Helena (SH)", "St. Kitts & Nevis (KN)", "St. Lucia (LC)", "St. Martin (MF)", "St. Pierre & Miquelon (PM)", "St. Vincent & Grenadines (VC)", "Sudan (SD)", "Suriname (SR)", "Svalbard & Jan Mayen (SJ)", "Swaziland (SZ)", "Sweden (SE)", "Switzerland (CH)", "Syria (SY)", "Taiwan (TW)", "Tajikistan (TJ)", "Tanzania (TZ)", "Thailand (TH)", "Timor-Leste (TL)", "Togo (TG)", "Tokelau (TK)", "Tonga (TO)", "Trinidad & Tobago (TT)", "Tristan da Cunha (TA)", "Tunisia (TN)", "Turkey (TR)", "Turkmenistan (TM)", "Turks & Caicos Islands (TC)", "Tuvalu (TV)", "U.S. Outlying Islands (UM)", "U.S. Virgin Islands (VI)", "Uganda (UG)", "Ukraine (UA)", "United Arab Emirates (AE)", "United Kingdom (GB)", "United Nations (UN)", "United States (US)", "Uruguay (UY)", "Uzbekistan (UZ)", "Vanuatu (VU)", "Vatican City (VA)", "Venezuela (VE)", "Vietnam (VN)", "Wallis & Futuna (WF)", "Western Sahara (EH)", "Yemen (YE)", "Zambia (ZM)", "Zimbabwe (ZW)"];
    if(newCity.match(regex) && newCity.length < 136 && newCountry == "" || countries.includes(newCountry)) {
        User.findOneAndUpdate({_id: req.user.id}, newSettings, {new: true}, (err, updatedUser) => {
            if(err) res.render("settings.njk", { user: req.user, error: "Database error, please try again"});        
            else res.render("settings.njk", { user: updatedUser, success: true});        
        });
    }
    else res.render("settings.njk", { user: req.user, error: "Please enter a valid city and try again"});        
});

router.get("/trades", (req, res, next) => {
    Trade.find({$or: [{"trader.id": req.user.id}, {"customer.id": req.user.id}]}, (err, trades) => {        
        if(err) next(err);
        else if(trades.length > 0) {
            let tradesSorted = sortTrades(trades);            
            res.render("trades.njk", { user: req.user, pendingTrades: tradesSorted[0], tradeHistory: tradesSorted[1]});
        } 
        else res.render("trades.njk", { user: req.user});
    });    
});

router.post("/trades/:response",authCheck, urlencodedParser, (req, res, next) => { 
    let trade_id = req.body.trade_id;   
    if(req.params.response == "accept") {
        let date = new Date();        
        Trade.updateOne({_id: trade_id}, {date, pending: false}, (err) => {
            if(err) next(err);
            else return res.redirect("/my/trades");
        });
    }
    else if(req.params.response == "decline") {
        Trade.updateOne({_id: trade_id}, {customer: {}}, (err) => {
            if(err) next(err);
            else return res.redirect("/my/trades");
        });
    }
});

router.get("/books", (req, res, next) => {    
    Trade.find({$and: [{"trader.id": req.user.id}, {pending: true}]}, (err, trades) => {                       
        if(err) next(err);        
        else if(trades.length > 0) res.render("mybooks.njk", { user: req.user, trades});                        
        else res.render("mybooks.njk", { user: req.user, trades: false});        
    });    
});

router.get("/books/search", (req, res) => {    
    let param = req.query.searchParam;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${param}&key=${process.env.GOOGLE_BOOKS_KEY}&fields=items/volumeInfo(title,authors,imageLinks/smallThumbnail,previewLink)`;
    axios.get(url)
        .then((response) => {            
            res.send(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
});

router.post("/books/add", urlencodedParser, (req, res, next) => {     
    new Trade({
        trader: {
            id: req.user.id,
            username: req.user.username,
            link: req.user.link
        },                            
        pending: true,        
        book: {
            title: req.body.title,
            author: req.body.author,
            cover: req.body.cover,
            link: req.body.link
        }})
        .save((err, trade) => {            
            if(err) next(err);
            else {
                User.updateOne({_id: req.user.id}, {$push: {trades: trade.id}}, (err) => {                    
                    if(err) next(err);
                    else res.send(trade);
                });
            }
        });
});

router.post("/books/remove", urlencodedParser, (req, res, next) => {       
    let tradeId = req.body.trade_id;       
    Promise.all([
        Trade.remove({_id: tradeId}),
        User.update({ _id: req.user.id}, {$pull: {trades: tradeId}})
    ]).then( () => {        
        res.redirect(req.get("Referer"));
    }).catch((error) => {
        console.log(error);
        next(error);
    });
});

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
    return [pendingTrades, tradeHistory];
}

module.exports = router;