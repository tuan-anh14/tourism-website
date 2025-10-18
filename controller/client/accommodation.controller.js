const Accommodation = require('../../model/Accommodation');

module.exports.accommodation = async (req, res) => {
    try {
        // Get query parameters for filtering
        const { type, area, price, search } = req.query;
        
        // Build filter object
        let filter = { 
            status: 'public', 
            isActive: true 
        };
        
        if (area && area !== 'all') {
            filter.address = { $regex: area, $options: 'i' };
        }
        
        if (price && price !== 'all') {
            switch (price) {
                case 'lt1m':
                    filter.priceFrom = { $lt: 1000000 };
                    break;
                case '1to2m':
                    filter.priceFrom = { $gte: 1000000, $lte: 2000000 };
                    break;
                case '2to3m':
                    filter.priceFrom = { $gte: 2000000, $lte: 3000000 };
                    break;
                case 'gt3m':
                    filter.priceFrom = { $gt: 3000000 };
                    break;
            }
        }
        
        if (search) {
            filter.$text = { $search: search };
        }
        
        // Get accommodations from database
        const accommodations = await Accommodation.find(filter)
            .select('name slug star address priceFrom description images amenities avgRating reviewCount')
            .sort({ featured: -1, avgRating: -1, createdAt: -1 })
            .limit(50);
        
        res.render("client/pages/accommodation/accommodation.ejs", {
            pageTitle: "Lưu trú",
            accommodations
        });
    } catch (error) {
        console.error('Error fetching accommodations:', error);
        res.render("client/pages/accommodation/accommodation.ejs", {
            pageTitle: "Lưu trú",
            accommodations: []
        });
    }
}

module.exports.accommodationDetail = async (req, res) => {
    try {
        const slug = String(req.params.slug || '').toLowerCase();
        const isValid = /^[a-z0-9-]+$/.test(slug);
        
        if (!isValid) {
            return res.status(404).render("client/pages/accommodation/detail.accommodation.ejs", {
                pageTitle: "Chi tiết lưu trú",
                acc: null
            });
        }
        
        // Find accommodation by slug
        const acc = await Accommodation.findOne({ 
            slug: slug, 
            status: 'public', 
            isActive: true 
        });
        
        if (!acc) {
            return res.status(404).render("client/pages/accommodation/detail.accommodation.ejs", {
                pageTitle: "Không tìm thấy lưu trú",
                acc: null
            });
        }
        
        // Get related accommodations (different accommodation)
        const relatedAccommodations = await Accommodation.find({
            _id: { $ne: acc._id },
            status: 'public',
            isActive: true
        })
        .select('name slug address priceFrom images amenities avgRating reviewCount')
        .sort({ avgRating: -1 })
        .limit(4);
        
        // Compute rating from embedded reviews
        const reviews = Array.isArray(acc.reviews) ? acc.reviews : [];
        const reviewCount = reviews.length;
        const rating = reviewCount > 0 ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviewCount) : 0;

        res.render("client/pages/accommodation/detail.accommodation.ejs", {
            pageTitle: acc.name + " | Lưu trú Hà Nội",
            acc,
            relatedAccommodations,
            reviews,
            rating,
            reviewCount,
            reviewButtonUrl: acc.map && acc.map.mapEmbed ? acc.map.mapEmbed : ''
        });
    } catch (error) {
        console.error('Error fetching accommodation detail:', error);
        res.status(500).render("client/pages/accommodation/detail.accommodation.ejs", {
            pageTitle: "Lỗi hệ thống",
            acc: null
        });
    }
}