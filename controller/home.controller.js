module.exports.index = (req, res) => {
    res.render("client/pages/home")
    res.render("client/pages/home", {
        pageTitle: "Home"
    })
}