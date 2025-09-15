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

// Client content pages
module.exports.attractions = (req, res) => {
    res.render("client/pages/attraction.ejs", {
        pageTitle: "Điểm tham quan"
    })
}

module.exports.accommodation = (req, res) => {
    res.render("client/pages/accommodation.ejs", {
        pageTitle: "Lưu trú"
    })
}

module.exports.cuisine = (req, res) => {
    res.render("client/pages/cuisine.ejs", {
        pageTitle: "Ẩm thực"
    })
}

module.exports.transportation = (req, res) => {
    res.render("client/pages/transportation.ejs", {
        pageTitle: "Di chuyển"
    })
}

module.exports.entertainment = (req, res) => {
    res.render("client/pages/entertainment.ejs", {
        pageTitle: "Giải trí"
    })
}