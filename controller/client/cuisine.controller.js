const Cuisine = require('../../model/Cuisine');

// [GET] /cuisine
module.exports.cuisine = async (req, res) => {
    try {
        const docs = await Cuisine.find({ isActive: true, status: 'published' })
            .sort({ featured: -1, createdAt: -1 })
            .limit(60);

        const cuisines = (docs || []).map(doc => {
            const firstPlace = (doc.places && doc.places[0]) || {};
            const image = (doc.mainImages && doc.mainImages[0]) || (doc.gallery && doc.gallery[0]) || '/client/img/img3.png';
            const district = (firstPlace.address && firstPlace.address.district) ? String(firstPlace.address.district).toLowerCase().replace(/\s+/g, '') : '';
            const address = firstPlace.address ? [firstPlace.address.street, firstPlace.address.ward, firstPlace.address.district].filter(Boolean).join(', ') : '';
            const hours = firstPlace.openingHours || '';
            const form = (doc.tags || []).includes('restaurant') ? 'restaurant' : 'street';
            return {
                title: doc.name,
                image,
                area: district || 'all',
                type: doc.type || 'other',
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
        const doc = await Cuisine.findOne(findQuery);
        if (!doc) {
            return res.status(404).render('client/pages/cuisine/detail.cuisine.ejs', { pageTitle: 'Không tìm thấy món ăn', food: null });
        }

        const firstPlace = (doc.places && doc.places[0]) || {};
        const heroImage = (doc.mainImages && doc.mainImages[0]) || (doc.gallery && doc.gallery[0]) || null;
        const images = [ ...(doc.mainImages || []), ...(doc.gallery || []) ];
        const addressText = firstPlace.address ? [firstPlace.address.street, firstPlace.address.ward, firstPlace.address.district, firstPlace.address.city].filter(Boolean).join(', ') : '';
        const restaurants = (doc.places || []).map(p => ({
            name: p.name,
            address: p.address ? [p.address.street, p.address.ward, p.address.district, p.address.city].filter(Boolean).join(', ') : '',
            time: p.openingHours || '',
            price: p.priceRange || '',
            mapUrl: p.mapLink || '',
            lat: (p.location && Array.isArray(p.location.coordinates)) ? p.location.coordinates[1] : undefined,
            lng: (p.location && Array.isArray(p.location.coordinates)) ? p.location.coordinates[0] : undefined,
            image: (p.images && p.images[0]) || heroImage || ''
        }));

        const similarDocs = await Cuisine.find({ _id: { $ne: doc._id }, type: doc.type, isActive: true, status: 'published' })
            .sort({ featured: -1, createdAt: -1 })
            .limit(3);
        const similar = similarDocs.map(s => ({ name: s.name, href: `/cuisine/${s.slug}` }));

        const food = {
            title: doc.name,
            badge: (doc.feature && doc.feature[0]) || undefined,
            subtitle: undefined,
            heroImage,
            seoDescription: doc.description ? String(doc.description).slice(0, 160) : undefined,
            description: doc.description ? [String(doc.description)] : [],
            highlightTitle: 'Điểm đặc biệt',
            highlightText: (doc.feature && doc.feature.length) ? doc.feature.join(', ') : undefined,
            ingredients: [],
            images,
            origin: (firstPlace.address && firstPlace.address.city) || 'Hà Nội',
            priceRange: firstPlace.priceRange || undefined,
            servingTime: firstPlace.openingHours || undefined,
            spicyLevel: undefined,
            popularity: doc.avgRating ? '★'.repeat(Math.round(doc.avgRating)) : undefined,
            similar,
            restaurants,
            tips: (doc.feature || []).slice(0, 4).map(f => ({ icon: 'fa-check', title: f, text: '' }))
        };

        res.render('client/pages/cuisine/detail.cuisine.ejs', { pageTitle: `${food.title || 'Ẩm thực'} | HÀ NỘI`, food });
    } catch (error) {
        console.error('Client cuisine detail error:', error);
        return res.status(500).render('client/pages/cuisine/detail.cuisine.ejs', { pageTitle: 'Ẩm thực', food: null });
    }
};