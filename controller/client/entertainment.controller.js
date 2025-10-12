const Entertainment = require('../../model/Entertainment');

module.exports.entertainment = async (req, res) => {
    try {
        // Get featured entertainments
        const featuredEntertainments = await Entertainment.find({ 
            isActive: true, 
            featured: true 
        }).limit(6).lean();

        // Get all zones for filtering
        const zones = await Entertainment.distinct('zone', { isActive: true });

        const hero = {
            title: "Giải trí & Sự kiện",
            subtitle: "Khám phá những trải nghiệm giải trí đa dạng tại Hà Nội",
            backgroundImage: "/client/img/header-bg.jfif"
        };

        // Sample events data (can be moved to database later)
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
            entertainments: featuredEntertainments,
            events: events,
            categories: categories,
            zones: zones
        });
    } catch (error) {
        console.error('Error loading entertainment page:', error);
        res.status(500).render('errors/500', {
            pageTitle: 'Lỗi Server',
            error: error.message
        });
    }
}

module.exports.detail = async (req, res) => {
    try {
        const { id } = req.params;
        
        const entertainment = await Entertainment.findById(id);
        if (!entertainment || !entertainment.isActive) {
            return res.status(404).render('errors/404', {
                pageTitle: 'Không tìm thấy',
                message: 'Không tìm thấy địa điểm giải trí này'
            });
        }

        // Transform data for the view
        const detail = {
            title: entertainment.name,
            breadcrumb: [
                { label: "Trang chủ", href: "/" },
                { label: "Giải trí", href: "/entertainment" },
                { label: entertainment.zone, href: "/entertainment" }
            ],
            heroImage: entertainment.images && entertainment.images.length > 0 
                ? entertainment.images[0] 
                : "/client/img/header-bg.jfif",
            quickInfo: [
                { icon: "📍", label: "Địa chỉ", value: entertainment.address },
                { icon: "🕐", label: "Giờ mở cửa", value: entertainment.openHours },
                { icon: "💰", label: "Giá vé", value: entertainment.ticket },
                { icon: "🎪", label: "Loại hình", value: entertainment.type }
            ],
            intro: {
                title: "Giới thiệu",
                paragraphs: [
                    `${entertainment.name} thuộc khu vực ${entertainment.zone}, là ${entertainment.type.toLowerCase()} nổi bật tại Hà Nội.`,
                    entertainment.activities && entertainment.activities.length > 0 
                        ? `Nơi đây cung cấp các hoạt động: ${entertainment.activities.join(', ')}.`
                        : "Địa điểm này mang đến những trải nghiệm giải trí đa dạng và thú vị."
                ]
            },
            sections: []
        };

        // Add history section if available
        if (entertainment.history) {
            detail.sections.push({
                title: "Lịch sử hình thành",
                paragraphs: [entertainment.history]
            });
        }

        // Add architecture section if available
        if (entertainment.architecture) {
            detail.sections.push({
                title: "Kiến trúc & Thiết kế",
                paragraphs: [entertainment.architecture]
            });
        }

        // Add activities section
        if (entertainment.activities && entertainment.activities.length > 0) {
            detail.sections.push({
                title: "Hoạt động chính",
                paragraphs: ["Các hoạt động nổi bật tại địa điểm:"],
                bullets: entertainment.activities
            });
        }

        // Add experience section
        if (entertainment.experience && entertainment.experience.length > 0) {
            detail.sections.push({
                title: "Trải nghiệm du khách",
                paragraphs: ["Những trải nghiệm đặc biệt bạn không nên bỏ qua:"],
                bullets: entertainment.experience
            });
        }

        // Add audience section
        if (entertainment.audience && entertainment.audience.length > 0) {
            detail.sections.push({
                title: "Đối tượng phù hợp",
                paragraphs: ["Địa điểm này phù hợp với:"],
                bullets: entertainment.audience
            });
        }

        // Add highlight if there are reviews
        if (entertainment.reviews && entertainment.reviews.length > 0) {
            detail.highlight = {
                title: "Đánh giá từ khách hàng",
                content: `Được đánh giá ${entertainment.averageRating}/5 sao từ ${entertainment.reviewCount} lượt đánh giá.`
            };
        }

        // Gallery
        detail.gallery = entertainment.images && entertainment.images.length > 0 
            ? entertainment.images.map((img, index) => ({
                src: img,
                alt: `${entertainment.name} - Hình ${index + 1}`
            }))
            : [
                { src: "/client/img/header-bg.jfif", alt: entertainment.name }
            ];

        // Map
        detail.mapEmbed = entertainment.map.embedUrl;

        // CTA
        detail.cta = {
            title: "Sẵn sàng khám phá?",
            subtitle: `Đặt vé để trải nghiệm ${entertainment.name}`,
            actions: [
                { label: "Đặt vé", href: "#" },
                { label: "Xem thêm", href: "#" }
            ]
        };

        res.render("client/pages/entertainment/detail.entertainment.ejs", {
            pageTitle: detail.title,
            detail: detail,
            entertainment: entertainment
        });
    } catch (error) {
        console.error('Error loading entertainment detail:', error);
        res.status(500).render('errors/500', {
            pageTitle: 'Lỗi Server',
            error: error.message
        });
    }
}