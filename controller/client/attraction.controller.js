// === DANH SÁCH ĐIỂM THAM QUAN ===
module.exports.attractions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;
        const category = req.query.category || '';
        const search = req.query.search || '';
        const sort = req.query.sort || 'featured';

        let query = { isActive: true };
        
        // Lọc theo danh mục
        if (category) {
            query.category = category;
        }

        // Tìm kiếm
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { nameEn: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Sắp xếp
        let sortOption = {};
        switch (sort) {
            case 'rating':
                sortOption = { 'rating.average': -1 };
                break;
            case 'name':
                sortOption = { name: 1 };
                break;
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            default:
                sortOption = { featured: -1, 'rating.average': -1 };
        }

        const [attractions, total] = await Promise.all([
            Attraction.find(query)
                .select('name slug title shortDescription images rating category featured')
                .sort(sortOption)
                .skip(skip)
                .limit(limit),
            Attraction.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        // Lấy danh mục cho filter
        const categories = await Attraction.distinct('category', { isActive: true });

        res.render("client/pages/attraction/attraction.ejs", {
            pageTitle: "Điểm tham quan",
            attractions,
            categories,
            pagination: {
                currentPage: page,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            filters: {
                category,
                search,
                sort
            }
        });

    } catch (error) {
        console.error('Attractions list error:', error);
        res.render("client/pages/attraction/attraction.ejs", {
            pageTitle: "Điểm tham quan",
            attractions: [],
            categories: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                hasNext: false,
                hasPrev: false
            },
            filters: {
                category: '',
                search: '',
                sort: 'featured'
            }
        });
    }
}

// Demo data đã được thay thế bằng database thực tế

// Import model mới
const Attraction = require('../../model/Attraction');

module.exports.attractionDetail = async (req, res) => {
    try {
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

        // Tìm kiếm attraction theo slug
        const attraction = await Attraction.findOne({ 
            slug: slug, 
            isActive: true 
        });

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

        // Lấy các điểm tham quan liên quan (cùng danh mục)
        const relatedAttractions = await Attraction.find({
            category: attraction.category,
            _id: { $ne: attraction._id },
            isActive: true
        })
        .select('name slug title shortDescription images rating')
        .limit(4)
        .sort({ 'rating.average': -1 });

        // Cập nhật view count (nếu cần)
        // attraction.viewCount = (attraction.viewCount || 0) + 1;
        // await attraction.save();

        res.render("client/pages/attraction/detail.attraction.ejs", {
            attraction,
            relatedAttractions
        });

    } catch (error) {
        console.error('Attraction detail error:', error);
        res.status(500).render("client/pages/attraction/detail.attraction.ejs", {
            attraction: {
                title: "Lỗi hệ thống",
                shortDescription: "Có lỗi xảy ra, vui lòng thử lại sau.",
                address: "",
                images: []
            },
            relatedAttractions: []
        });
    }
}

// === API ENDPOINTS ===
// Tìm kiếm API
module.exports.search = async (req, res) => {
    try {
        const { q, category, limit = 10 } = req.query;
        
        const results = await Attraction.search(q, {
            category,
            limit: parseInt(limit)
        });

        res.json({
            success: true,
            data: results,
            total: results.length
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tìm kiếm'
        });
    }
};

// Lấy điểm nổi bật
module.exports.getFeatured = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const attractions = await Attraction.getFeatured(limit);
        
        res.json({
            success: true,
            data: attractions
        });
    } catch (error) {
        console.error('Get featured error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy dữ liệu'
        });
    }
};

// Lấy theo danh mục
module.exports.getByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        
        const attractions = await Attraction.getByCategory(category, limit);
        
        res.json({
            success: true,
            data: attractions
        });
    } catch (error) {
        console.error('Get by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy dữ liệu'
        });
    }
};

// Lấy gần vị trí
module.exports.getNearby = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const radius = parseInt(req.query.radius) || 10;
        const limit = parseInt(req.query.limit) || 10;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin vị trí'
            });
        }

        const attractions = await Attraction.getNearby(
            parseFloat(lat), 
            parseFloat(lng), 
            radius, 
            limit
        );

        res.json({
            success: true,
            data: attractions
        });
    } catch (error) {
        console.error('Get nearby error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy dữ liệu'
        });
    }
};

// Thêm đánh giá
module.exports.addReview = async (req, res) => {
    try {
        const { slug } = req.params;
        const { user, rating, comment, avatar, country } = req.body;

        if (!user || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ'
            });
        }

        const attraction = await Attraction.findOne({ slug, isActive: true });
        if (!attraction) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy điểm tham quan'
            });
        }

        const reviewData = {
            user,
            rating: parseInt(rating),
            comment,
            avatar: avatar || '/client/img/avatar.png',
            country: country || 'Việt Nam'
        };

        await attraction.addReview(reviewData);

        res.json({
            success: true,
            message: 'Đánh giá đã được thêm',
            data: {
                averageRating: attraction.rating.average,
                totalReviews: attraction.rating.count
            }
        });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi thêm đánh giá'
        });
    }
};