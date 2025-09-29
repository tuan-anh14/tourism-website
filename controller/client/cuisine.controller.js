// Demo listing data for cuisine grid
const DEMO_CUISINE_LIST = [
    {
        title: "Bún Chả Hà Nội",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
        area: "dongda",
        type: "grill",
        form: "street",
        rating: 4.6,
        address: "Chùa Láng, Đống Đa",
        hours: "10:00 - 20:00",
        slug: "bun-cha-ha-noi"
    },
    {
        title: "Phở Bò Truyền Thống",
        image: "/client/img/img3.png",
        area: "center",
        type: "noodle",
        form: "street",
        rating: 4.8,
        address: "Phố cổ, Hoàn Kiếm",
        hours: "06:00 - 22:00",
        slug: "pho-ha-noi"
    },
    {
        title: "Chả Cá Lã Vọng",
        image: "/client/img/img5.png",
        area: "tayho",
        type: "grill",
        form: "restaurant",
        rating: 4.7,
        address: "Trấn Vũ, Tây Hồ",
        hours: "11:00 - 22:00",
        slug: "cha-ca-la-vong"
    },
    {
        title: "Cốm Làng Vòng",
        image: "/client/img/img6.png",
        area: "caugiay",
        type: "snack",
        form: "street",
        rating: 4.5,
        address: "Làng Vòng, Cầu Giấy",
        hours: "08:00 - 18:00",
        slug: "com-lang-vong"
    }
];

module.exports.cuisine = (req, res) => {
    res.render("client/pages/cuisine/cuisine.ejs", {
        pageTitle: "Ẩm thực",
        cuisines: DEMO_CUISINE_LIST
    })
}

// Demo detail data for cuisine page
const DEMO_CUISINES = {
    "bun-cha-ha-noi": {
        title: "Bún Chả Hà Nội",
        badge: "Món đặc sản Hà Nội",
        subtitle: "Tinh hoa ẩm thực Thủ đô - Hương vị khó quên",
        heroImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200",
        seoDescription: "Bún chả Hà Nội - đặc sản nổi tiếng với hương vị khó quên.",
        description: [
            "Bún chả là món ăn quen thuộc của người Việt gồm bún, chả nướng, nước mắm chua cay mặn ngọt.",
            "Hương vị hài hòa của thịt nướng, bún rối, rau thơm và nước mắm pha tạo nên trải nghiệm khó quên."
        ],
        highlightTitle: "Điểm đặc biệt",
        highlightText: "Bún chả từng được Tổng thống Mỹ Barack Obama thưởng thức tại Hà Nội năm 2016.",
        ingredients: [
            { name: "Bún rối", note: "Loại bún truyền thống" },
            { name: "Chả viên", note: "Tẩm ướp và nướng than" },
            { name: "Chả miếng", note: "Thịt ba chỉ nướng" },
            { name: "Nước mắm pha", note: "Chua, cay, mặn, ngọt" },
            { name: "Rau sống", note: "Rau thơm tươi mát" },
            { name: "Nộm", note: "Cà rốt, đu đủ xanh" }
        ],
        images: [
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
        ],
        origin: "Miền Bắc Việt Nam",
        priceRange: "50.000 - 120.000₫",
        servingTime: "8:00 - 21:00",
        spicyLevel: "Trung bình",
        popularity: "★★★★★ (5/5)",
        similar: [
            { name: "Phở Hà Nội", href: "/cuisine/pho-ha-noi" },
            { name: "Bún đậu mắm tôm", href: "/cuisine/bun-dau-mam-tom" },
            { name: "Bún riêu cua", href: "/cuisine/bun-rieu-cua" }
        ],
        restaurants: [
            {
                name: "Bún chả Tuyết",
                address: "34 Hàng Than, Ba Đình, Hà Nội",
                time: "8:30 - 17:30",
                price: "50.000 - 70.000₫",
                mapUrl: "https://maps.app.goo.gl/GqYe8WSaECDAyzu69?g_st=ipc",
                lat: 21.043231,
                lng: 105.842827,
                image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
            },
            {
                name: "Bún chả Đắc Kim",
                address: "Số 1 Hàng Mành, Hàng Gai, Hoàn Kiếm, Hà Nội",
                time: "8:00 - 22:00",
                price: "70.000 - 120.000₫",
                mapUrl: "https://maps.app.goo.gl/FjxahJ8LCphuGYyG8?g_st=ipc",
                lat: 21.033622,
                lng: 105.848840,
                image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800"
            },
            {
                name: "Bún chả Bà Vượng",
                address: "29 P. Ngô Sỹ Liên, Đống Đa, Hà Nội",
                time: "8:00 - 15:00",
                price: "50.000 - 70.000₫",
                mapUrl: "https://maps.app.goo.gl/iMg7pD6UdJLt3z1z7?g_st=ipc",
                lat: 21.027936,
                lng: 105.836441,
                image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
            }
        ],
        tips: [
            { icon: "fa-clock-o", title: "Thời điểm tốt nhất", text: "Nên ăn vào buổi trưa khi món ăn được chuẩn bị tươi nhất." },
            { icon: "fa-cutlery", title: "Cách ăn chuẩn", text: "Cho bún vào bát mắm, thêm chả và rau rồi trộn đều." },
            { icon: "fa-leaf", title: "Rau ăn kèm", text: "Thêm xà lách, rau thơm, húng quế để tăng hương vị." },
            { icon: "fa-fire", title: "Chọn chả ngon", text: "Chả ngon vàng nâu, thơm mùi nướng than, không bị khô." }
        ]
    }
};

module.exports.cuisineDetail = (req, res) => {
    const slug = String(req.params.slug || '').toLowerCase();
    const isValid = /^[a-z0-9-]+$/.test(slug);
    if (!isValid) {
        return res.status(404).render("client/pages/cuisine/detail.cuisine.ejs", { pageTitle: "Ẩm thực", food: null });
    }
    const food = DEMO_CUISINES[slug] || null;
    if (!food) {
        return res.status(404).render("client/pages/cuisine/detail.cuisine.ejs", { pageTitle: "Không tìm thấy món ăn", food: null });
    }
    res.render("client/pages/cuisine/detail.cuisine.ejs", { pageTitle: (food.title || 'Ẩm thực') + ' | HÀ NỘI', food });
}