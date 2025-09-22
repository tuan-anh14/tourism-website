module.exports.index = (req, res) => {
    res.render("client/pages/home/home.ejs", {
        pageTitle: "Home"
    })
}
