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
const PORT = process.env.PORT || 3002;

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

// Mongoose
mongoose.connect("mongodb://localhost/articledb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

            // In the currently selected element, look at its parent element, then save the values for any "href" attributes that the parent element may have
            var link = $(element).parent().attr("href").trim();

            const result = {
                title: title,
                link: link,
                description: description,
                saved: false
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
    }).finally(function () {
        // Send a message to the client
        res.send("Scrape Complete");
    })
});

// Routes
app.get("/", function (req, res) {
    res.render("index");
});

app.get("/articles", function (req, res) {
    const articleCollection = [];

    db.Article.find({}, function(err, articles) {
        articles.forEach(function(article) {
            articleCollection.push(article);
        });

        res.send(articleCollection);
    })
});

app.get("/savedArticles", function (req, res) {
    const articleCollection = [];

    db.Article.find({
        saved: true
    }, function(err, articles) {
        articles.forEach(function(article) {
            articleCollection.push(article);
        });

        res.send(articleCollection);
    })
});

app.get("/clearArticles", function (req, res) {
    db.Article.deleteMany({}, function(err) {
        res.send("articles deleted");
    })
});

app.post("/save/:articleId", function (req, res) {
    const save = req.body.save;
    const articleId = req.params.articleId;

    db.Article.findOneAndUpdate({ "_id": req.body.articleId }, { saved: save }, function (err, doc) {
        if (err) {
            return res.send(500, {error: err});
        }

        return res.send("saved article: " + articleId);
    });
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});