module.exports.attractions = (req, res) => {
    res.render("client/pages/attraction/attraction.ejs", {
        pageTitle: "Điểm tham quan"
    })
}

// Basic in-memory demo data. Replace with DB queries later.
const DEMO_ATTRACTIONS = {
    "van-mieu-quoc-tu-giam": {
        title: "Văn Miếu – Quốc Tử Giám",
        address: "58 P. Quốc Tử Giám, Văn Miếu – Quốc Tử Giám, Đống Đa, Hà Nội",
        heroImage: "/client/img/carousel-img5.jpg",
        shortDescription: "Biểu tượng truyền thống hiếu học của Thăng Long.",
        description: "Văn Miếu – Quốc Tử Giám là quần thể di tích lịch sử, văn hóa nổi tiếng...",
        mapEmbedUrl: "https://www.google.com/maps?q=58+Qu%E1%BB%91c+T%E1%BB%AD+Gi%C3%A1m,+H%C3%A0+N%E1%BB%99i&output=embed",
        openHours: [
            "Mùa hè (15/4 - 15/10): 7:30 - 18:00",
            "Mùa đông (còn lại): 8:00 - 18:00"
        ],
        tickets: [
            { type: "Người lớn", price: "70.000 VNĐ" },
            { type: "HSSV", price: "15.000 VNĐ", note: "Cần thẻ HSSV" },
            { type: "Người cao tuổi", price: "35.000 VNĐ" }
        ],
        experiences: [
            { icon: "fa-university", title: "Chiêm ngưỡng kiến trúc", text: "Khuê Văn Các, bia Tiến sĩ..." },
            { icon: "fa-history", title: "Tìm hiểu lịch sử", text: "Quá trình hình thành và khoa cử." },
            { icon: "fa-pencil", title: "Trải nghiệm xin chữ", text: "Xin chữ đầu năm, thư pháp." }
        ],
        images: ["/client/img/carousel-img5.jpg","/client/img/carousel-img4.jpg"],
        seoDescription: "Chi tiết Văn Miếu – Quốc Tử Giám"
    },
    "hoang-thanh-thang-long": {
        title: "Hoàng thành Thăng Long",
        address: "19C Hoàng Diệu, Ba Đình, Hà Nội",
        heroImage: "/client/img/carousel-img4.jpg",
        shortDescription: "Di sản văn hóa thế giới, dấu ấn nghìn năm Thăng Long.",
        description: "Khu di tích trung tâm Hoàng thành Thăng Long gắn liền lịch sử Thăng Long – Hà Nội.",
        mapEmbedUrl: "https://www.google.com/maps?q=Hoang+thanh+Thang+Long+Ha+Noi&output=embed",
        openHours: ["Thứ 3 - CN: 8:00 - 17:00"],
        tickets: [
            { type: "Người lớn", price: "30.000 VNĐ" },
            { type: "HSSV", price: "15.000 VNĐ" }
        ],
        experiences: [
            { icon: "fa-landmark", title: "Di tích lịch sử", text: "Khám phá dấu tích hoàng cung xưa." },
            { icon: "fa-camera", title: "Check-in cổ kính", text: "Ảnh đẹp cùng kiến trúc cổ." }
        ],
        images: ["/client/img/carousel-img4.jpg"],
        seoDescription: "Chi tiết Hoàng thành Thăng Long"
    }
};

module.exports.attractionDetail = (req, res) => {
    const slug = String(req.params.slug || '').toLowerCase();
    const isValid = /^[a-z0-9-]+$/.test(slug);
    if (!isValid) {
        return res.status(404).render("client/pages/attraction/detail.attraction.ejs", {
            attraction: {
                title: "Slug không hợp lệ",
                shortDescription: "Vui lòng quay lại danh sách.",
                address: "",
                images: []
            },
            relatedAttractions: []
        });
    }
    const attraction = DEMO_ATTRACTIONS[slug] || null;

    if (!attraction) {
        return res.status(404).render("client/pages/attraction/detail.attraction.ejs", {
            attraction: {
                title: "Không tìm thấy điểm tham quan",
                shortDescription: "Vui lòng quay lại danh sách.",
                address: "",
                images: []
            },
            relatedAttractions: []
        });
    }

    const relatedAttractions = [
        { title: "Hoàng thành Thăng Long", href: "/attraction/hoang-thanh-thang-long", image: "/client/img/carousel-img4.jpg" },
        { title: "Phố cổ Hà Nội", href: "/attraction/pho-co-ha-noi", image: "/client/img/img3.png" }
    ];

    res.render("client/pages/attraction/detail.attraction.ejs", {
        attraction,
        relatedAttractions
    });
}