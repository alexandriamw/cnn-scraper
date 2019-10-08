document.getElementById("savedArticles").addEventListener("click", function () {
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("savedArticlesPage").style.display = "block";
});

document.getElementById("home").addEventListener("click", function () {
    document.getElementById("savedArticlesPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
});