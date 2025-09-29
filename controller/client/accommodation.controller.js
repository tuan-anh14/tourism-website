// Demo list for accommodation listing page
const DEMO_ACCOMMODATION_LIST = [
    {
        title: "Hanoi Old Quarter Hotel",
        image: "/client/img/carousel-img2.jpg",
        type: "hotel",
        area: "center",
        priceFrom: 1800000,
        amenities: ["Wi‑Fi", "Bữa sáng", "Đỗ xe"],
        shortDescription: "Vị trí trung tâm phố cổ, phòng ốc hiện đại, gần hồ Hoàn Kiếm.",
        slug: "hanoi-old-quarter-hotel"
    },
    {
        title: "Lakeside Homestay",
        image: "/client/img/carousel-img3.jpg",
        type: "homestay",
        area: "tayho",
        priceFrom: 900000,
        amenities: ["Wi‑Fi", "Bếp", "View hồ"],
        shortDescription: "Không gian ấm cúng ven Hồ Tây, có bếp và ban công hướng hồ.",
        slug: "lakeside-homestay"
    },
    {
        title: "Budget Guesthouse",
        image: "/client/img/img1.jfif",
        type: "guesthouse",
        area: "caugiay",
        priceFrom: 600000,
        amenities: ["Wi‑Fi", "Đỗ xe", "Điều hòa"],
        shortDescription: "Giải pháp tiết kiệm, phòng sạch, đầy đủ điều hòa, chỗ đỗ xe.",
        slug: "budget-guesthouse"
    },
    {
        title: "Serviced Apartment Center",
        image: "/client/img/img2.jfif",
        type: "apartment",
        area: "haibatrung",
        priceFrom: 2500000,
        amenities: ["Wi‑Fi", "Bếp", "Máy giặt"],
        shortDescription: "Căn hộ dịch vụ đầy đủ nội thất, bếp và máy giặt, phù hợp lưu trú dài ngày.",
        slug: "serviced-apartment-center"
    },
    // Link to the new detail demo
    {
        title: "Westlake Lion Boutique Studio & Spa",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        type: "hotel",
        area: "tayho",
        priceFrom: 1000000,
        amenities: ["Wi‑Fi", "Spa", "Đưa đón sân bay"],
        shortDescription: "Khách sạn boutique hiện đại, tích hợp dịch vụ spa chất lượng.",
        slug: "westlake-lion-boutique-studio-spa"
    }
];

module.exports.accommodation = (req, res) => {
    res.render("client/pages/accommodation/accommodation.ejs", {
        pageTitle: "Lưu trú",
        accommodations: DEMO_ACCOMMODATION_LIST
    })
}

// Basic in-memory demo data for accommodation detail
const DEMO_ACCOMMODATIONS = {
    "westlake-lion-boutique-studio-spa": {
        title: "Westlake Lion Boutique Studio & Spa",
        categoryLabel: "Khách sạn 4 sao",
        rating: 4.5,
        reviewCount: 156,
        address: "15 Ngõ 45 Phố Võng Thị, Hà Nội, Việt Nam",
        priceFrom: 1000000,
        priceUnit: "đ/đêm",
        heroImage: 
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
        ],
        intro: [
            "Nằm ở Hà Nội, cách Bảo tàng dân tộc học Việt Nam 2.9 km, Westlake Lion Boutique Studio & Spa cung cấp chỗ nghỉ với phòng chờ chung, chỗ đậu xe riêng miễn phí và nhà hàng.",
            "Chỗ nghỉ cách Chùa Một Cột khoảng 3.6 km, Trung tâm thương mại Vincom Nguyễn Chí Thanh 3.9 km và Đền Quán Thánh 4 km. Khách sạn cung cấp lễ tân 24/24, dịch vụ đưa đón sân bay, dịch vụ phòng và Wi‑Fi miễn phí."
        ],
        highlights: [
            "Khách sạn boutique với thiết kế hiện đại",
            "Dịch vụ spa chất lượng cao",
            "Vị trí thuận tiện khám phá Hà Nội"
        ],
        roomFeatures: [
            "Điều hòa nhiệt độ",
            "Bàn làm việc",
            "Ấm đun nước",
            "Lò vi sóng",
            "Két an toàn",
            "TV màn hình phẳng",
            "Phòng tắm riêng với vòi xịt",
            "Ga trải giường & khăn tắm"
        ],
        services: {
            common: ["WiFi miễn phí", "Bãi đỗ xe miễn phí", "Nhà hàng", "Phòng chờ chung"],
            service: ["Lễ tân 24/24", "Đưa đón sân bay", "Dịch vụ phòng", "Spa & Massage"],
            breakfast: ["Buffet sáng", "Thực đơn à la carte", "Kiểu lục địa"]
        },
        nearbyPlaces: [
            { name: "Bảo tàng dân tộc học Việt Nam", distance: "2.9 km", icon: "fa-landmark" },
            { name: "Chùa Một Cột", distance: "3.6 km", icon: "fa-place-of-worship" },
            { name: "Vincom Nguyễn Chí Thanh", distance: "3.9 km", icon: "fa-shopping-bag" },
            { name: "Đền Quán Thánh", distance: "4.0 km", icon: "fa-torii-gate" },
            { name: "Lăng Chủ tịch Hồ Chí Minh", distance: "4.2 km", icon: "fa-monument" },
            { name: "Hoàng thành Thăng Long", distance: "4.5 km", icon: "fa-fort-awesome" }
        ],
        contacts: {
            phone: "024 xxxx xxxx",
            email: "info@westlakelion.com",
            address: "15 Ngõ 45 Phố Võng Thị, Hà Nội, Việt Nam"
        },
        map: {
            lat: 21.0666,
            lng: 105.8183,
            embedUrl: ""
        }
    }
};

module.exports.accommodationDetail = (req, res) => {
    const slug = String(req.params.slug || '').toLowerCase();
    const isValid = /^[a-z0-9-]+$/.test(slug);
    if (!isValid) {
        return res.status(404).render("client/pages/accommodation/detail.accommodation.ejs", {
            pageTitle: "Chi tiết lưu trú",
            acc: null
        });
    }
    const acc = DEMO_ACCOMMODATIONS[slug] || null;
    if (!acc) {
        return res.status(404).render("client/pages/accommodation/detail.accommodation.ejs", {
            pageTitle: "Không tìm thấy lưu trú",
            acc: null
        });
    }
    res.render("client/pages/accommodation/detail.accommodation.ejs", {
        pageTitle: acc.title + " | Lưu trú Hà Nội",
        acc
    });
}