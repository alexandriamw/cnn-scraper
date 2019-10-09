document.getElementById("savedArticles").addEventListener("click", function () {
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("savedArticlesPage").style.display = "block";
});

document.getElementById("home").addEventListener("click", function () {
    document.getElementById("savedArticlesPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
});

document.getElementById("scrape").addEventListener("click", function () {
    $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .then(function (data) {
            $.getJSON("/articles", function (data) {
                // For each one
                for (var i = 0; i < data.length; i++) {
                    // Display the information on the page
                    $("#articleList").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].description + "</p>");
                }
            });
        });
});