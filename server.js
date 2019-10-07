// Dependencies
var express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');


// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// mongoose.connect("mongodb://localhost/userdb", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => console.log('DB Connected!'))
//     .catch(err => {
//         console.log("DB Connection Error:", err.message);
//     });;

axios.get("https://minnesota.cbslocal.com/category/news/").then(function (response) {

    // Load the Response into cheerio and save it to a variable
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    $("div.title-wrapper").each(function (i, element) {

        // Save the text of the element in a "title" variable
        var title = $(element).text();

        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = $(element).parent().attr("href");

        //description of each article
        //var description = $(element).children().text("?");

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            title: title,
            link: link,
            //description: description
        });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});