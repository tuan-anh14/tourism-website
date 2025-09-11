module.exports.index = (req, res) => {
    res.render("client/pages/home.ejs", {
        pageTitle: "Home"
    })
}

module.exports.events = (req, res) => {
    res.render("client/pages/events.ejs", {
        pageTitle: "Events"
    })
}