module.exports.index = (req, res) => {
    res.render("client/pages/home.ejs", {
        pageTitle: "Home"
    })
}
