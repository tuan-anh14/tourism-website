const Cuisine = require('../../model/Cuisine');
const CuisinePlace = require('../../model/CuisinePlace');
const { createSlug } = require('../../utils/slug');

// [GET] /cuisine
module.exports.cuisine = async (req, res) => {
    try {
        const docs = await Cuisine.find({ isActive: true, status: 'published' })
            .populate('places')
            .sort({ featured: -1, createdAt: -1 })
            .limit(60);

        const cuisines = (docs || []).map(doc => {
            const firstPlace = (doc.places && doc.places[0]) || {};
            const image = (doc.mainImages && doc.mainImages[0]) || '/client/img/img3.png';
            const district = firstPlace.address ? String(firstPlace.address).toLowerCase().replace(/\s+/g, '') : '';
            const address = firstPlace.address || '';
            const hours = firstPlace.openingHours || '';
            const form = 'street'; // Default form since we removed tags
            return {
                title: doc.name,
                image,
                area: district || 'all',
                form,
                rating: doc.avgRating || 0,
                address,
                hours,
                slug: doc.slug || String(doc._id)
            };
        });

        res.render('client/pages/cuisine/cuisine.ejs', {
            pageTitle: 'Ẩm thực',
            cuisines
        });
    } catch (error) {
        console.error('Client cuisines error:', error);
        res.render('client/pages/cuisine/cuisine.ejs', {
            pageTitle: 'Ẩm thực',
            cuisines: []
        });
    }
};

// [GET] /cuisine/:slug
module.exports.cuisineDetail = async (req, res) => {
    try {
        const slug = String(req.params.slug || '').toLowerCase();
        const isValid = /^[a-z0-9-]+$/.test(slug);
        if (!isValid) {
            return res.status(404).render('client/pages/cuisine/detail.cuisine.ejs', { pageTitle: 'Ẩm thực', food: null });
        }

        const isObjectId = /^[a-f\d]{24}$/i.test(slug);
        const findQuery = isObjectId
            ? { $or: [{ slug }, { _id: slug }], isActive: true }
            : { slug, isActive: true };
        const doc = await Cuisine.findOne(findQuery).populate('places');
        if (!doc) {
            return res.status(404).render('client/pages/cuisine/detail.cuisine.ejs', { pageTitle: 'Không tìm thấy món ăn', food: null });
        }

        const firstPlace = (doc.places && doc.places[0]) || {};
        const heroImage = (doc.mainImages && doc.mainImages[0]) || null;
        const images = [ ...(doc.mainImages || []) ];
        const addressText = firstPlace.address || '';
        const restaurants = (doc.places || []).map((p, index) => ({
            id: p._id || index,
            name: p.name,
            address: p.address || '',
            time: p.openingHours || '',
            price: p.priceRange || '',
            mapUrl: p.mapLink || '',
            lat: (p.location && Array.isArray(p.location.coordinates)) ? p.location.coordinates[1] : undefined,
            lng: (p.location && Array.isArray(p.location.coordinates)) ? p.location.coordinates[0] : undefined,
            image: (p.images && p.images[0]) || heroImage || '',
            images: p.images || []
        }));

        const similarDocs = await Cuisine.find({ _id: { $ne: doc._id }, isActive: true, status: 'published' })
            .sort({ featured: -1, createdAt: -1 })
            .limit(3);
        const similar = similarDocs.map(s => ({ name: s.name, href: `/cuisine/${s.slug}` }));

        const food = {
            title: doc.name,
            badge: undefined,
            subtitle: undefined,
            heroImage,
            seoDescription: doc.description ? String(doc.description).slice(0, 160) : undefined,
            description: doc.description ? [String(doc.description)] : [],
            highlightTitle: undefined,
            highlightText: undefined,
            ingredients: [],
            images,
            origin: 'Hà Nội',
            // Remove general priceRange and servingTime - these should be per-place specific
            spicyLevel: undefined,
            popularity: doc.avgRating ? '★'.repeat(Math.round(doc.avgRating)) : undefined,
            similar,
            restaurants,
            tips: (doc.tips && doc.tips.length) ? doc.tips : [],
            recipe: doc.recipe || undefined
        };

        res.render('client/pages/cuisine/detail.cuisine.ejs', { pageTitle: `${food.title || 'Ẩm thực'} | HÀ NỘI`, food });
    } catch (error) {
        console.error('Client cuisine detail error:', error);
        return res.status(500).render('client/pages/cuisine/detail.cuisine.ejs', { pageTitle: 'Ẩm thực', food: null });
    }
};

// [GET] /cuisine/:cuisineSlug/:restaurantSlug
module.exports.restaurantDetail = async (req, res) => {
    try {
        const cuisineSlug = String(req.params.cuisineSlug || '').toLowerCase();
        const restaurantSlug = String(req.params.restaurantSlug || '').toLowerCase();
        
        // Validate slugs
        const isValidCuisineSlug = /^[a-z0-9-]+$/.test(cuisineSlug);
        const isValidRestaurantSlug = /^[a-z0-9-]+$/.test(restaurantSlug);
        
        if (!isValidCuisineSlug || !isValidRestaurantSlug) {
            return res.status(404).render('client/pages/cuisine/restaurant-detail.ejs', { 
                pageTitle: 'Không tìm thấy nhà hàng', 
                cuisine: null, 
                restaurant: null 
            });
        }

        // Find cuisine
        const isObjectId = /^[a-f\d]{24}$/i.test(cuisineSlug);
        const findQuery = isObjectId
            ? { $or: [{ slug: cuisineSlug }, { _id: cuisineSlug }], isActive: true }
            : { slug: cuisineSlug, isActive: true };
        
        const cuisineDoc = await Cuisine.findOne(findQuery).populate('places');
        if (!cuisineDoc) {
            return res.status(404).render('client/pages/cuisine/restaurant-detail.ejs', { 
                pageTitle: 'Không tìm thấy món ăn', 
                cuisine: null, 
                restaurant: null 
            });
        }

        // Find restaurant in cuisine places
        const restaurant = cuisineDoc.places.find(place => {
            // Create slug from restaurant name using utility function
            const placeSlug = createSlug(place.name);
            return placeSlug === restaurantSlug;
        });

        if (!restaurant) {
            return res.status(404).render('client/pages/cuisine/restaurant-detail.ejs', { 
                pageTitle: 'Không tìm thấy nhà hàng', 
                cuisine: null, 
                restaurant: null 
            });
        }

        // Prepare cuisine data
        const cuisine = {
            title: cuisineDoc.name,
            slug: cuisineDoc.slug,
            description: cuisineDoc.description ? [String(cuisineDoc.description)] : [],
            heroImage: (cuisineDoc.mainImages && cuisineDoc.mainImages[0]) || null,
            images: cuisineDoc.mainImages || []
        };

        // Prepare restaurant data
        const restaurantData = {
            id: restaurant._id || restaurantSlug,
            name: restaurant.name,
            slug: restaurantSlug,
            address: restaurant.address || '',
            time: restaurant.openingHours || '',
            price: restaurant.priceRange || '',
            phone: restaurant.phone || '',
            rating: restaurant.rating || 4.5,
            mapUrl: restaurant.mapLink || '',
            lat: (restaurant.location && Array.isArray(restaurant.location.coordinates)) ? restaurant.location.coordinates[1] : undefined,
            lng: (restaurant.location && Array.isArray(restaurant.location.coordinates)) ? restaurant.location.coordinates[0] : undefined,
            image: (restaurant.images && restaurant.images[0]) || (cuisineDoc.mainImages && cuisineDoc.mainImages[0]) || '',
            images: restaurant.images || [],
            description: restaurant.description ? [String(restaurant.description)] : [],
            specialties: restaurant.specialties || [],
            menu: restaurant.menu || [],
            reviews: restaurant.reviews || []
        };

        // Compute rating from reviews
        const reviews = Array.isArray(restaurantData.reviews) ? restaurantData.reviews : [];
        const reviewCount = reviews.length;
        const rating = reviewCount > 0 ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviewCount) : 0;

        res.render('client/pages/cuisine/restaurant-detail.ejs', { 
            pageTitle: `${restaurantData.name} - ${cuisine.title} | HÀ NỘI`, 
            cuisine,
            restaurant: restaurantData,
            reviews,
            rating,
            reviewCount,
            reviewButtonUrl: restaurantData.mapUrl || ''
        });
    } catch (error) {
        console.error('Client restaurant detail error:', error);
        return res.status(500).render('client/pages/cuisine/restaurant-detail.ejs', { 
            pageTitle: 'Lỗi tải trang', 
            cuisine: null, 
            restaurant: null 
        });
    }
};