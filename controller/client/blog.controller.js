module.exports.index = (req, res) => {
  res.render("client/pages/blog/blog", {
    pageTitle: "Blog - Hà Nội Vibes",
    page: "blog",
  });
};

module.exports.articleOne = (req, res) => {
  res.render("client/pages/blog/blog1-seo", {
    pageTitle: "Top 10 địa điểm du lịch Hà Nội đẹp và hấp dẫn",
    page: "blog",
    meta: {
      description:
        "Top 10 địa điểm du lịch Hà Nội hấp dẫn nhất cho chuyến đi trọn vẹn.",
      keywords:
        "địa điểm du lịch Hà Nội, top 10, Hồ Hoàn Kiếm, Văn Miếu, phố cổ",
      image: "/client/img/ho-tay.jpg",
      author: "Admin",
      date: "15/01/2024",
      dateISO: "2024-01-15",
      siteUrl: (req && req.protocol && req.get) ? `${req.protocol}://${req.get('host')}` : ''
    },
  });
};

module.exports.articleTwo = (req, res) => {
  res.render("client/pages/blog/blog2-seo", {
    pageTitle: "Top 10 quán cafe view đẹp ở Hà Nội",
    page: "blog",
    meta: {
      description:
        "Check-in 10 quán cafe Hà Nội view siêu đẹp, chill hết nấc.",
      keywords:
        "quán cafe Hà Nội, cafe view đẹp, rooftop Hà Nội, Xofa, Lofita",
      image: "/client/img/banner-home.jpg",
      author: "Admin",
      date: "15/02/2024",
      dateISO: "2024-02-15",
      siteUrl: (req && req.protocol && req.get) ? `${req.protocol}://${req.get('host')}` : ''
    },
  });
};

module.exports.articleThree = (req, res) => {
  res.render("client/pages/blog/blog3-seo", {
    pageTitle: "Top 10 địa điểm sống ảo hot ở Hà Nội",
    page: "blog",
    meta: {
      description:
        "Khám phá 10 địa điểm sống ảo hot nhất Hà Nội dành cho giới trẻ.",
      keywords:
        "địa điểm sống ảo Hà Nội, check-in Hà Nội, cầu Long Biên, hồ Tây",
      image: "/client/img/banner-attraction.jpg",
      author: "Admin",
      date: "01/03/2024",
      dateISO: "2024-03-01",
      siteUrl: (req && req.protocol && req.get) ? `${req.protocol}://${req.get('host')}` : ''
    },
  });
};