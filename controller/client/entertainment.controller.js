module.exports.entertainment = (req, res) => {
    // Entertainment data for the main page
    const entertainments = [
        {
            slug: "nha-hat-lon-ha-noi",
            title: "Nhà hát Lớn Hà Nội",
            description: "Công trình kiến trúc tiêu biểu thời Pháp thuộc, nơi biểu diễn opera, giao hưởng và ballet",
            image: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=400",
            category: "Văn hóa - Nghệ thuật",
            price: "120.000đ - 400.000đ"
        },
        {
            slug: "nha-hat-cheo-viet-nam",
            title: "Nhà hát Chèo Việt Nam",
            description: "Trung tâm biểu diễn nghệ thuật chèo truyền thống của Việt Nam",
            image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
            category: "Văn hóa - Nghệ thuật",
            price: "100.000đ - 300.000đ"
        },
        {
            slug: "nha-hat-ca-tru",
            title: "Nhà hát Ca Trù",
            description: "Không gian biểu diễn ca trù - di sản văn hóa phi vật thể của UNESCO",
            image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
            category: "Văn hóa - Nghệ thuật",
            price: "80.000đ - 200.000đ"
        },
        {
            slug: "rap-chieu-phim-cgv",
            title: "Rạp chiếu phim CGV",
            description: "Hệ thống rạp chiếu phim hiện đại với công nghệ IMAX và 4DX",
            image: "https://images.unsplash.com/photo-1489599804343-1a0b0b0b0b0b?w=400",
            category: "Giải trí",
            price: "60.000đ - 150.000đ"
        },
        {
            slug: "karaoke-k-plus",
            title: "Karaoke K+",
            description: "Hệ thống karaoke cao cấp với phòng VIP và dịch vụ đẳng cấp",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
            category: "Giải trí",
            price: "200.000đ - 500.000đ/giờ"
        },
        {
            slug: "san-khau-ca-nhac",
            title: "Sân khấu ca nhạc",
            description: "Không gian biểu diễn ca nhạc đương đại và các sự kiện văn hóa",
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
            category: "Giải trí",
            price: "150.000đ - 400.000đ"
        }
    ];

    const hero = {
        title: "Giải trí & Sự kiện",
        subtitle: "Khám phá những trải nghiệm giải trí đa dạng tại Hà Nội",
        backgroundImage: "/client/img/header-bg.jfif"
    };

    const events = [
        {
            title: "Lễ hội âm nhạc quốc tế",
            description: "Sự kiện âm nhạc quy tụ các nghệ sĩ nổi tiếng từ khắp thế giới",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
            details: {
                time: "20:00 - 23:00",
                location: "Sân vận động Mỹ Đình",
                language: "Đa ngôn ngữ",
                price: "500.000đ - 2.000.000đ"
            },
            action: {
                label: "Đặt vé",
                href: "#"
            }
        },
        {
            title: "Triển lãm nghệ thuật đương đại",
            description: "Khám phá những tác phẩm nghệ thuật hiện đại từ các nghệ sĩ trẻ",
            image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
            details: {
                time: "09:00 - 18:00",
                location: "Bảo tàng Mỹ thuật Việt Nam",
                price: "Miễn phí"
            },
            action: {
                label: "Tham quan",
                href: "#"
            }
        },
        {
            title: "Workshop làm gốm truyền thống",
            description: "Trải nghiệm nghề gốm truyền thống với các nghệ nhân làng gốm Bát Tràng",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            details: {
                time: "14:00 - 17:00",
                location: "Làng gốm Bát Tràng",
                price: "200.000đ"
            },
            action: {
                label: "Đăng ký",
                href: "#"
            }
        },
        {
            title: "Biểu diễn múa rối nước",
            description: "Xem múa rối nước - nghệ thuật truyền thống độc đáo của Việt Nam",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
            details: {
                time: "15:00 - 16:00",
                location: "Nhà hát múa rối nước Thăng Long",
                price: "100.000đ - 200.000đ"
            },
            action: {
                label: "Đặt vé",
                href: "#"
            }
        },
        {
            title: "Hội chợ ẩm thực đường phố",
            description: "Thưởng thức các món ăn đặc sản Hà Nội và các vùng miền",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb5614a6?w=400",
            details: {
                time: "18:00 - 22:00",
                location: "Phố đi bộ Hồ Gươm",
                price: "50.000đ - 150.000đ/món"
            },
            action: {
                label: "Tham gia",
                href: "#"
            }
        },
        {
            title: "Buổi hòa nhạc cổ điển",
            description: "Thưởng thức những bản nhạc cổ điển bất hủ tại không gian sang trọng",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
            details: {
                time: "19:30 - 21:30",
                location: "Nhà hát Lớn Hà Nội",
                price: "300.000đ - 800.000đ"
            },
            action: {
                label: "Đặt vé",
                href: "#"
            }
        }
    ];

    const categories = [
        {
            icon: "fa-music",
            title: "Âm nhạc & Biểu diễn",
            description: "Opera, giao hưởng, ca nhạc và các buổi biểu diễn nghệ thuật"
        },
        {
            icon: "fa-film",
            title: "Điện ảnh & Phim ảnh",
            description: "Rạp chiếu phim, phim nghệ thuật và các sự kiện điện ảnh"
        },
        {
            icon: "fa-paint-brush",
            title: "Nghệ thuật & Triển lãm",
            description: "Triển lãm, bảo tàng và các không gian nghệ thuật"
        },
        {
            icon: "fa-microphone",
            title: "Karaoke & Ca hát",
            description: "Karaoke, quán bar và các không gian ca nhạc"
        }
    ];

    res.render("client/pages/entertainment/entertainment.ejs", {
        pageTitle: "Giải trí",
        hero: hero,
        entertainments: entertainments,
        events: events,
        categories: categories
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
        },
        "nha-hat-cheo-viet-nam": {
            title: "Nhà hát Chèo Việt Nam",
            breadcrumb: [
                { label: "Trang chủ", href: "/" },
                { label: "Giải trí", href: "/entertainment" },
                { label: "Văn hóa - Nghệ thuật", href: "/entertainment" }
            ],
            heroImage: "/client/img/header-bg.jfif",
            quickInfo: [
                { icon: "📍", label: "Địa chỉ", value: "Số 15 Nguyễn Đình Chiểu, quận Hai Bà Trưng, Hà Nội" },
                { icon: "🕐", label: "Giờ mở cửa", value: "Biểu diễn theo lịch, thường 19:30" },
                { icon: "💰", label: "Giá vé", value: "100.000đ - 300.000đ" },
                { icon: "🎪", label: "Loại hình", value: "Chèo truyền thống, nghệ thuật dân gian" }
            ],
            intro: {
                title: "Giới thiệu",
                paragraphs: [
                    "Nhà hát Chèo Việt Nam là nơi bảo tồn và phát triển nghệ thuật chèo - loại hình sân khấu truyền thống độc đáo của Việt Nam.",
                    "Đây là không gian văn hóa quan trọng giúp du khách hiểu về nghệ thuật dân gian và truyền thống văn hóa Việt Nam."
                ]
            },
            sections: [
                {
                    title: "Nghệ thuật Chèo",
                    paragraphs: [
                        "Chèo là loại hình sân khấu dân gian Việt Nam, kết hợp giữa ca, múa, diễn xuất và âm nhạc truyền thống."
                    ],
                    bullets: [
                        "Nghệ thuật biểu diễn: ca, múa, diễn xuất",
                        "Âm nhạc: đàn nguyệt, sáo, trống",
                        "Trang phục: áo tứ thân, khăn mỏ quạ",
                        "Nội dung: tích cổ, truyện dân gian"
                    ]
                }
            ],
            highlight: {
                title: "Điểm đặc biệt",
                content: "Nghệ thuật chèo được UNESCO công nhận là Di sản văn hóa phi vật thể của nhân loại."
            },
            gallery: [
                { src: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400", alt: "Biểu diễn chèo" },
                { src: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400", alt: "Nghệ sĩ chèo" }
            ],
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4795717489586!2d105.84863841476253!3d21.015244385999856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8e80fb84a3%3A0x94c537668d830cf!2zMTUgTmd1eeG7hW4gxJDDrG5oIENoaeG7g3UsIEjDoG4gVGjGsOG7o25nLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1234567890124!5m2!1svi!2s",
            cta: { title: "Trải nghiệm nghệ thuật truyền thống", subtitle: "Đặt vé để thưởng thức nghệ thuật chèo độc đáo", actions: [ { label: "Đặt vé", href: "#" }, { label: "Xem lịch biểu diễn", href: "#" } ] }
        },
        "nha-hat-ca-tru": {
            title: "Nhà hát Ca Trù",
            breadcrumb: [
                { label: "Trang chủ", href: "/" },
                { label: "Giải trí", href: "/entertainment" },
                { label: "Văn hóa - Nghệ thuật", href: "/entertainment" }
            ],
            heroImage: "/client/img/header-bg.jfif",
            quickInfo: [
                { icon: "📍", label: "Địa chỉ", value: "Số 42 Hàng Bạc, quận Hoàn Kiếm, Hà Nội" },
                { icon: "🕐", label: "Giờ mở cửa", value: "Biểu diễn theo lịch, thường 20:00" },
                { icon: "💰", label: "Giá vé", value: "80.000đ - 200.000đ" },
                { icon: "🎪", label: "Loại hình", value: "Ca trù, âm nhạc truyền thống" }
            ],
            intro: {
                title: "Giới thiệu",
                paragraphs: [
                    "Ca trù là loại hình âm nhạc truyền thống độc đáo của Việt Nam, được UNESCO công nhận là Di sản văn hóa phi vật thể cần bảo vệ khẩn cấp.",
                    "Đây là không gian văn hóa đặc biệt để thưởng thức âm nhạc truyền thống tinh tế và sâu sắc."
                ]
            },
            sections: [
                {
                    title: "Nghệ thuật Ca Trù",
                    paragraphs: [
                        "Ca trù là loại hình âm nhạc thính phòng tinh tế, kết hợp giữa ca, đàn và trống."
                    ],
                    bullets: [
                        "Nhạc cụ: đàn đáy, phách, trống chầu",
                        "Ca sĩ: ca nương với kỹ thuật ca đặc biệt",
                        "Nội dung: thơ ca cổ điển, tình yêu, thiên nhiên",
                        "Không gian: thính phòng nhỏ, ấm cúng"
                    ]
                }
            ],
            highlight: {
                title: "Điểm đặc biệt",
                content: "Ca trù được UNESCO công nhận là Di sản văn hóa phi vật thể cần bảo vệ khẩn cấp."
            },
            gallery: [
                { src: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400", alt: "Biểu diễn ca trù" },
                { src: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400", alt: "Nhạc cụ ca trù" }
            ],
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8979!2d105.85160!3d21.03563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abb8a55f04c5%3A0x5e7e3e0b1c0a0a0a!2zNDIgSMOgbmcgQuG6oWMsIEhvw6BuIEtp4bq_bSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1234567890125!5m2!1svi!2s",
            cta: { title: "Thưởng thức âm nhạc truyền thống", subtitle: "Đặt vé để trải nghiệm ca trù độc đáo", actions: [ { label: "Đặt vé", href: "#" }, { label: "Tìm hiểu thêm", href: "#" } ] }
        },
        "rap-chieu-phim-cgv": {
            title: "Rạp chiếu phim CGV",
            breadcrumb: [
                { label: "Trang chủ", href: "/" },
                { label: "Giải trí", href: "/entertainment" },
                { label: "Giải trí", href: "/entertainment" }
            ],
            heroImage: "/client/img/header-bg.jfif",
            quickInfo: [
                { icon: "📍", label: "Địa chỉ", value: "Nhiều chi nhánh tại Hà Nội" },
                { icon: "🕐", label: "Giờ mở cửa", value: "09:00 - 24:00 hàng ngày" },
                { icon: "💰", label: "Giá vé", value: "60.000đ - 150.000đ" },
                { icon: "🎪", label: "Loại hình", value: "Phim ảnh, giải trí" }
            ],
            intro: {
                title: "Giới thiệu",
                paragraphs: [
                    "CGV là hệ thống rạp chiếu phim hàng đầu Việt Nam với công nghệ hiện đại và dịch vụ chuyên nghiệp.",
                    "Trải nghiệm xem phim với công nghệ IMAX, 4DX và ScreenX độc đáo."
                ]
            },
            sections: [
                {
                    title: "Công nghệ hiện đại",
                    paragraphs: [
                        "CGV mang đến trải nghiệm xem phim đẳng cấp với các công nghệ tiên tiến nhất."
                    ],
                    bullets: [
                        "IMAX: màn hình khổng lồ, âm thanh vòm",
                        "4DX: ghế chuyển động, hiệu ứng đặc biệt",
                        "ScreenX: màn hình 270 độ",
                        "Dolby Atmos: âm thanh vòm sống động"
                    ]
                }
            ],
            highlight: {
                title: "Điểm đặc biệt",
                content: "Hệ thống rạp chiếu phim hiện đại nhất Việt Nam với công nghệ 4DX và IMAX."
            },
            gallery: [
                { src: "https://images.unsplash.com/photo-1489599804343-1a0b0b0b0b0b?w=400", alt: "Rạp chiếu phim CGV" },
                { src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", alt: "Công nghệ 4DX" }
            ],
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5!2d105.83500!3d21.01000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab75e8f3c101%3A0x5e7e3e0b1c0a0a0a!2zQ0dWIENpbmVtYSBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1234567890126!5m2!1svi!2s",
            cta: { title: "Xem phim đẳng cấp", subtitle: "Đặt vé để trải nghiệm công nghệ hiện đại", actions: [ { label: "Đặt vé", href: "#" }, { label: "Xem lịch chiếu", href: "#" } ] }
        },
        "karaoke-k-plus": {
            title: "Karaoke K+",
            breadcrumb: [
                { label: "Trang chủ", href: "/" },
                { label: "Giải trí", href: "/entertainment" },
                { label: "Giải trí", href: "/entertainment" }
            ],
            heroImage: "/client/img/header-bg.jfif",
            quickInfo: [
                { icon: "📍", label: "Địa chỉ", value: "Nhiều chi nhánh tại Hà Nội" },
                { icon: "🕐", label: "Giờ mở cửa", value: "10:00 - 02:00 hàng ngày" },
                { icon: "💰", label: "Giá vé", value: "200.000đ - 500.000đ/giờ" },
                { icon: "🎪", label: "Loại hình", value: "Karaoke, ca hát" }
            ],
            intro: {
                title: "Giới thiệu",
                paragraphs: [
                    "K+ là hệ thống karaoke cao cấp với phòng VIP sang trọng và dịch vụ đẳng cấp.",
                    "Trải nghiệm ca hát với hệ thống âm thanh chuyên nghiệp và không gian riêng tư."
                ]
            },
            sections: [
                {
                    title: "Dịch vụ cao cấp",
                    paragraphs: [
                        "K+ mang đến trải nghiệm karaoke đẳng cấp với dịch vụ chuyên nghiệp."
                    ],
                    bullets: [
                        "Phòng VIP: thiết kế sang trọng, riêng tư",
                        "Âm thanh: hệ thống loa chuyên nghiệp",
                        "Dịch vụ: đồ uống, thức ăn cao cấp",
                        "Karaoke: kho nhạc đa dạng, cập nhật"
                    ]
                }
            ],
            highlight: {
                title: "Điểm đặc biệt",
                content: "Hệ thống karaoke cao cấp nhất Hà Nội với phòng VIP và dịch vụ đẳng cấp."
            },
            gallery: [
                { src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", alt: "Phòng karaoke K+" },
                { src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400", alt: "Hệ thống âm thanh" }
            ],
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2!2d105.84200!3d21.02200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab88c1fb84a3%3A0x5e7e3e0b1c0a0a0a!2zS2FyYW9rZSBLKyBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1234567890127!5m2!1svi!2s",
            cta: { title: "Ca hát đẳng cấp", subtitle: "Đặt phòng để trải nghiệm karaoke cao cấp", actions: [ { label: "Đặt phòng", href: "#" }, { label: "Xem giá", href: "#" } ] }
        },
        "san-khau-ca-nhac": {
            title: "Sân khấu ca nhạc",
            breadcrumb: [
                { label: "Trang chủ", href: "/" },
                { label: "Giải trí", href: "/entertainment" },
                { label: "Giải trí", href: "/entertainment" }
            ],
            heroImage: "/client/img/header-bg.jfif",
            quickInfo: [
                { icon: "📍", label: "Địa chỉ", value: "Nhiều địa điểm tại Hà Nội" },
                { icon: "🕐", label: "Giờ mở cửa", value: "Biểu diễn theo lịch, thường 20:00" },
                { icon: "💰", label: "Giá vé", value: "150.000đ - 400.000đ" },
                { icon: "🎪", label: "Loại hình", value: "Ca nhạc, biểu diễn" }
            ],
            intro: {
                title: "Giới thiệu",
                paragraphs: [
                    "Các sân khấu ca nhạc tại Hà Nội là nơi quy tụ những nghệ sĩ tài năng và các buổi biểu diễn đa dạng.",
                    "Trải nghiệm âm nhạc đương đại và truyền thống trong không gian chuyên nghiệp."
                ]
            },
            sections: [
                {
                    title: "Không gian biểu diễn",
                    paragraphs: [
                        "Các sân khấu ca nhạc mang đến trải nghiệm âm nhạc đa dạng và chuyên nghiệp."
                    ],
                    bullets: [
                        "Âm nhạc đương đại: pop, rock, jazz",
                        "Âm nhạc truyền thống: dân ca, cổ điển",
                        "Không gian: sân khấu chuyên nghiệp",
                        "Nghệ sĩ: ca sĩ nổi tiếng, tài năng trẻ"
                    ]
                }
            ],
            highlight: {
                title: "Điểm đặc biệt",
                content: "Không gian biểu diễn ca nhạc đa dạng với các nghệ sĩ tài năng."
            },
            gallery: [
                { src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400", alt: "Sân khấu ca nhạc" },
                { src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", alt: "Biểu diễn ca nhạc" }
            ],
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1!2d105.84800!3d21.02500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9c1fb84a3%3A0x5e7e3e0b1c0a0a0a!2zU8OibiBraOG6pXUgY2EgbmjhuqFjIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1234567890128!5m2!1svi!2s",
            cta: { title: "Thưởng thức âm nhạc", subtitle: "Đặt vé để thưởng thức các buổi biểu diễn", actions: [ { label: "Đặt vé", href: "#" }, { label: "Xem lịch", href: "#" } ] }
        }
    }

    const data = map[slug] || map["nha-hat-lon-ha-noi"]

    res.render("client/pages/entertainment/detail.entertainment.ejs", {
        pageTitle: data.title,
        detail: data
    })
}