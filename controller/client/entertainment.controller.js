module.exports.entertainment = (req, res) => {
    res.render("client/pages/entertainment/entertainment.ejs", {
        pageTitle: "Giải trí"
    })
}

module.exports.detail = (req, res) => {
    const { slug } = req.params

    // Placeholder mapping; later can be replaced by DB lookups
    const map = {
        "nha-hat-lon-ha-noi": {
            title: "Nhà hát Lớn Hà Nội",
            breadcrumb: [
                { label: "Trang chủ", href: "/" },
                { label: "Giải trí", href: "/entertainment" },
                { label: "Văn hóa - Nghệ thuật", href: "/entertainment" }
            ],
            heroImage: "/client/img/header-bg.jfif",
            quickInfo: [
                { icon: "📍", label: "Địa chỉ", value: "Số 1 Tràng Tiền, quận Hoàn Kiếm, Hà Nội" },
                { icon: "🕐", label: "Giờ mở cửa", value: "Tour 10:30 & 14:00; Biểu diễn theo lịch" },
                { icon: "💰", label: "Giá vé", value: "Tham quan: 120.000đ; Combo: 400.000đ" },
                { icon: "🎪", label: "Loại hình", value: "Opera, giao hưởng, ballet, sự kiện" }
            ],
            intro: {
                title: "Giới thiệu",
                paragraphs: [
                    "Nhà hát Lớn Hà Nội là công trình kiến trúc tiêu biểu thời Pháp thuộc, xây dựng 1901–1911, lấy cảm hứng từ Opéra Garnier.",
                    "Không chỉ là nơi biểu diễn nghệ thuật, địa điểm còn gắn với nhiều sự kiện lịch sử quan trọng và được bảo tồn cẩn thận.",
                ]
            },
            sections: [
                {
                    title: "Lịch sử hình thành",
                    paragraphs: [
                        "Khởi công 1901, hoàn thành 1911; qua nhiều giai đoạn trùng tu, vẫn giữ phong cách Pháp cổ điển.",
                    ]
                },
                {
                    title: "Kiến trúc & Thiết kế",
                    paragraphs: ["Điểm nhấn tân cổ điển Pháp với mặt tiền Corinthian, nội thất cầu thang xoắn, đèn chùm pha lê."],
                    bullets: [
                        "Mặt tiền: cột Corinthian, mái vòm, phù điêu tinh xảo",
                        "Nội thất: cầu thang xoắn, họa tiết mạ vàng, đèn chùm",
                        "Khán phòng: ~600 chỗ, tầm nhìn tối ưu",
                        "Âm thanh: tối ưu cho opera và giao hưởng"
                    ]
                },
                {
                    title: "Trải nghiệm du khách",
                    paragraphs: ["Tham quan kiến trúc, xem biểu diễn, chụp ảnh, tìm hiểu văn hóa."],
                    bullets: [
                        "Tour tham quan kiến trúc",
                        "Xem biểu diễn opera/giao hưởng/ballet",
                        "Check-in các góc kiến trúc",
                        "Tìm hiểu vai trò văn hóa lịch sử"
                    ]
                }
            ],
            highlight: {
                title: "Điểm đặc biệt",
                content: "Một trong ba opera phong cách Pháp còn lại ở Đông Dương."
            },
            gallery: [
                { src: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=400", alt: "Mặt tiền Nhà hát" },
                { src: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400", alt: "Nội thất" },
                { src: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400", alt: "Biểu diễn" }
            ],
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0969295847487!2d105.85251831476281!3d21.02881768599512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x47c0a745288bf07e!2zTmjDoCBow6F0IEzhu5tuIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s",
            cta: { title: "Sẵn sàng khám phá?", subtitle: "Đặt vé để trải nghiệm không gian nghệ thuật đẳng cấp", actions: [ { label: "Đặt vé tham quan", href: "#" }, { label: "Xem lịch biểu diễn", href: "#" } ] }
        }
    }

    const data = map[slug] || map["nha-hat-lon-ha-noi"]

    res.render("client/pages/entertainment/detail.entertainment.ejs", {
        pageTitle: data.title,
        detail: data
    })
}