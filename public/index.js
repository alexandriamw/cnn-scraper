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
                    const articleMarkup = `
                        <div class="eachArticle" data-id="${data[i]._id}">
                            <h2><a href="${data[i].link}">${data[i].title}</a></h2>
                            <br>
                            <p>${data[i].description}</p>
                            <button class="buttonStyle">Save Article</button>
                        </div>
                    `;
                    // Display the information on the page
                    $("#articleList").append(articleMarkup);
                }
            });
        });
});