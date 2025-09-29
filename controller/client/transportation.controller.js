module.exports.transportation = (req, res) => {
    const hero = {
        title: "Hướng dẫn di chuyển",
        subtitle: "Khám phá Hà Nội một cách dễ dàng và thuận tiện",
        bannerImage: "/client/img/header-bg.jfif"
    }

    const arrivalTransports = [
        { icon: "fa-plane", title: "Máy bay", desc: "Hạ cánh tại sân bay quốc tế Nội Bài (~30 km tới trung tâm)." },
        { icon: "fa-train", title: "Tàu hỏa", desc: "Ga Hà Nội ngay trung tâm, thuận tiện kết nối Bắc – Nam." },
        { icon: "fa-bus", title: "Xe khách/Ô tô", desc: "Các bến lớn: Mỹ Đình, Giáp Bát, Nước Ngầm, Gia Lâm." },
        { icon: "fa-car", title: "Xe cá nhân", desc: "Cao tốc và quốc lộ thuận tiện cho ô tô/xe máy." },
        { icon: "fa-suitcase-rolling", title: "Tour trọn gói", desc: "Có dịch vụ xe đưa đón tận nơi." }
    ]

    const localTransports = [
        { icon: "fa-taxi", title: "Taxi & Xe công nghệ", desc: "Đặt xe nhanh qua ứng dụng.", tags: ["Grab", "Be", "XanhSM", "Gojek"] },
        { icon: "fa-bus-alt", title: "Xe bus", desc: "Mạng lưới rộng, có buýt điện 2 tầng.", tags: ["Giá rẻ", "Nhiều tuyến", "Bus 2 tầng"] },
        { icon: "fa-subway", title: "Tàu điện đô thị", desc: "Tuyến Cát Linh – Hà Đông hiện khai thác.", tags: ["Nhanh", "Hiện đại", "Tránh tắc đường"] },
        { icon: "fa-motorcycle", title: "Xe máy & Xe đạp", desc: "Dễ thuê, linh hoạt khám phá.", tags: ["Linh hoạt", "Dễ thuê", "Mobike", "TNGO"] },
        { icon: "fa-bicycle", title: "Xích lô", desc: "Trải nghiệm phố cổ truyền thống.", tags: ["Truyền thống", "Phố cổ", "Độc đáo"] },
        { icon: "fa-charging-station", title: "Xe điện du lịch", desc: "Hoạt động quanh hồ Hoàn Kiếm.", tags: ["Xe zip", "Xe điện mini", "Thân thiện MT"] },
        { icon: "fa-car-side", title: "Thuê ô tô", desc: "Tự lái hoặc có tài xế.", tags: ["Tự lái", "Có tài xế", "Gia đình"] },
        { icon: "fa-walking", title: "Đi bộ", desc: "Khám phá hồ Hoàn Kiếm, phố cổ.", tags: ["Miễn phí", "Khám phá sâu", "Sức khỏe"] }
    ]

    const apps = [
        { icon: "fa-car", name: "Grab", desc: "Xe công nghệ phổ biến" },
        { icon: "fa-taxi", name: "Be", desc: "Giá cạnh tranh" },
        { icon: "fa-bus", name: "BusMap", desc: "Tra cứu tuyến bus" },
        { icon: "fa-bicycle", name: "TNGO", desc: "Thuê xe đạp" },
        { icon: "fa-map-marked-alt", name: "Google Maps", desc: "Chỉ đường & địa điểm" },
        { icon: "fa-motorcycle", name: "Gojek", desc: "Đa dịch vụ" }
    ]

    const comparisons = [
        { label: "Grab/Be/XanhSM", icon: "fa-taxi", price: "30.000 - 150.000₫", wait: "2-5 phút", fit: "Nhanh, thoải mái" },
        { label: "Xe bus", icon: "fa-bus", price: "7.000 - 15.000₫", wait: "10-20 phút", fit: "Tiết kiệm, đi xa" },
        { label: "Tàu điện", icon: "fa-subway", price: "8.000 - 15.000₫", wait: "5-10 phút", fit: "Tránh tắc, nhanh" },
        { label: "Xe máy thuê", icon: "fa-motorcycle", price: "100.000 - 150.000₫/ngày", wait: "Ngay", fit: "Tự do khám phá" },
        { label: "Xích lô", icon: "fa-bicycle", price: "100.000 - 300.000₫/giờ", wait: "5-10 phút", fit: "Trải nghiệm văn hóa" },
        { label: "Đi bộ", icon: "fa-walking", price: "Miễn phí", wait: "Ngay", fit: "Phố cổ" }
    ]

    const tips = [
        { icon: "fa-clock", title: "Tránh giờ cao điểm", desc: "7-9h sáng, 17-19h chiều." },
        { icon: "fa-money-bill-wave", title: "Chuẩn bị tiền mặt", desc: "Một số phương tiện chỉ nhận tiền mặt." },
        { icon: "fa-mobile-alt", title: "Sử dụng app đặt xe", desc: "Biết trước giá cước, tiện đặt xe." },
        { icon: "fa-map", title: "Tải bản đồ offline", desc: "Phòng khi mất kết nối." }
    ]

    res.render("client/pages/transportation/transportation.ejs", {
        pageTitle: "Di chuyển",
        hero,
        arrivalTransports,
        localTransports,
        apps,
        comparisons,
        tips
    })
}
