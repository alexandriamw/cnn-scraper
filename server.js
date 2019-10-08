// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');

// Require all models
var db = require("./models");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/articledb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB Connected!')
}).catch(err => {
    console.log("DB Connection Error:", err.message);
});

// A GET route for scraping the CBS website
app.get("/scrape", function (req, res) {
    axios.get("https://minnesota.cbslocal.com/category/news/").then(function (response) {
        // Load the Response into cheerio and save it to a variable
        var $ = cheerio.load(response.data);

        $(".layout-headline div.title-wrapper").each(function (i, element) {

            // Save the text of the element in a "title" variable
            var title = $(element).find(".title").text().trim();

            // Description of each article
            var description = $(element).find(".description").text().trim();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            var link = $(element).parent().attr("href").trim();

            const result = {
                title: title,
                link: link,
                description: description
            };

            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
    });
});



// Routes
app.get("/", function (req, res) {
    res.render("index");
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});