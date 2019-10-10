document.getElementById("savedArticles").addEventListener("click", function () {
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("savedArticlesPage").style.display = "block";

    $("#savedArticleList").html("");

    $.getJSON("/savedArticles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            const articleMarkup = `
                <div class="eachArticle" data-id="${data[i]._id}">
                    <h2><a href="${data[i].link}">${data[i].title}</a></h2>
                    <br>
                    <p>${data[i].description}</p>
                    <button class="buttonStyle saveArticle" data-saved="${data[i].saved ? "saved" : "unsaved"}">${data[i].saved ? "Unsave" : "Save"} Article</button>
                </div>
            `;
            // Display the information on the page
            $("#savedArticleList").append(articleMarkup);
        }
    });
});

document.getElementById("home").addEventListener("click", function () {
    document.getElementById("savedArticlesPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
});

document.getElementById("clear").addEventListener("click", function () {
    $.ajax({
        method: "GET",
        url: "/clearArticles"
    })
    .then(function (data) {
        $("#articleList").html("");
    });
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
                            <button class="buttonStyle saveArticle" data-saved="${data[i].saved ? "saved" : "unsaved"}">${data[i].saved ? "Unsave" : "Save"} Article</button>
                        </div>
                    `;
                    // Display the information on the page
                    $("#articleList").append(articleMarkup);
                }
            });
        });
});

$("#articleList, #savedArticleList").on("click", ".saveArticle", function (event) {
    const articleId = $(this).parent(".eachArticle").data("id");
    const save = $(this).data("saved") === "saved" ? false : true;
    const element = $(this);

    $.post(`/save/${articleId}`, {
        articleId,
        save
    }, function () {
        element.data("saved", save === true ? "saved" : "unsaved");
        element.text(save === true ? "Unsave Article" : "Save Article");
    });
});