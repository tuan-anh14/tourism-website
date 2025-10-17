module.exports.index = (req, res) => {
  res.render("client/pages/blog/blog", {
    pageTitle: "Blog - Hà Nội Vibes",
    page: "blog",
  });
};

module.exports.detailOldQuarter = (req, res) => {
  res.render("client/pages/blog/detail-old-quarter", {
    pageTitle: "Khám phá phố cổ Hà Nội - Hành trình 36 phố phường",
    page: "blog",
    meta: {
      description:
        "Dạo bước qua những con phố cổ kính, khám phá văn hóa và ẩm thực đặc sắc của Hà Nội trong hành trình 36 phố phường.",
      keywords:
        "phố cổ Hà Nội, 36 phố phường, du lịch Hà Nội, văn hóa, ẩm thực",
      image: "/client/img/pho-co.jpg",
      author: "Admin",
      date: "2024-01-15",
    },
  });
};