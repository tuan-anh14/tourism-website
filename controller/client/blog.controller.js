module.exports.index = (req, res) => {
  res.render("client/pages/blog/blog", {
    pageTitle: "Blog - Hà Nội Vibes",
    page: "blog",
  });
};
