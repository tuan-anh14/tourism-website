const Entertainment = require('../../model/Entertainment');

// Get all entertainments for admin
module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const filter = {};
        if (req.query.zone) filter.zone = req.query.zone;
        if (req.query.type) filter.type = req.query.type;
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
        
        const entertainments = await Entertainment.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
            
        const total = await Entertainment.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        
        // Get unique zones and types for filter dropdowns
        const zones = await Entertainment.distinct('zone');
        const types = await Entertainment.distinct('type');
        
        res.render('admin/layout', {
            pageTitle: 'Quản lý Giải trí',
            page: 'entertainments',
            body: 'admin/pages/entertainments/index',
            entertainments,
            pagination: {
                currentPage: page,
                totalPages,
                total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1
            },
            filters: {
                zones,
                types,
                currentZone: req.query.zone,
                currentType: req.query.type,
                currentActive: req.query.isActive
            }
        });
    } catch (error) {
        console.error('Error fetching entertainments:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải danh sách giải trí');
        res.redirect('/admin/dashboard');
    }
};

// Show create form
module.exports.create = async (req, res) => {
    try {
        const zones = await Entertainment.distinct('zone');
        const types = await Entertainment.distinct('type');
        
        res.render('admin/layout', {
            pageTitle: 'Thêm mới Giải trí',
            page: 'entertainments',
            body: 'admin/pages/entertainments/create',
            zones,
            types,
            entertainment: null,
            errors: null
        });
    } catch (error) {
        console.error('Error loading create form:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải form');
        res.redirect('/admin/entertainments');
    }
};

// Store new entertainment
module.exports.store = async (req, res) => {
    try {
        // Basic validation
        const { zone, name, type, address, openHours, ticket, lat, lng, embedUrl } = req.body;
        if (!zone || !name || !type || !address || !openHours || !ticket || !lat || !lng || !embedUrl) {
            const zones = await Entertainment.distinct('zone');
            const types = await Entertainment.distinct('type');
            
            return res.render('admin/layout', {
                pageTitle: 'Thêm mới Giải trí',
                page: 'entertainments',
                body: 'admin/pages/entertainments/create',
                zones,
                types,
                entertainment: req.body,
                errors: [{ msg: 'Vui lòng điền đầy đủ các trường bắt buộc' }]
            });
        }

        const {
            activities, audience, history, architecture,
            experience, notes, images
        } = req.body;

        // Process arrays
        const activitiesArray = activities ? activities.split('\n').filter(item => item.trim()) : [];
        const audienceArray = audience ? audience.split('\n').filter(item => item.trim()) : [];
        const experienceArray = experience ? experience.split('\n').filter(item => item.trim()) : [];
        const notesArray = notes ? notes.split('\n').filter(item => item.trim()) : [];
        const imagesArray = images ? images.split('\n').filter(item => item.trim()) : [];

        const entertainmentData = {
            zone,
            name,
            type,
            address,
            openHours,
            ticket,
            activities: activitiesArray,
            audience: audienceArray,
            history: history || null,
            architecture: architecture || null,
            experience: experienceArray,
            notes: notesArray,
            images: imagesArray,
            map: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                embedUrl
            }
        };

        const entertainment = new Entertainment(entertainmentData);
        await entertainment.save();

        req.flash('success', 'Thêm mới giải trí thành công');
        res.redirect('/admin/entertainments');
    } catch (error) {
        console.error('Error creating entertainment:', error);
        req.flash('error', 'Có lỗi xảy ra khi thêm mới giải trí');
        res.redirect('/admin/entertainments/create');
    }
};

// Show entertainment details
module.exports.show = async (req, res) => {
    try {
        const entertainment = await Entertainment.findById(req.params.id);
        if (!entertainment) {
            req.flash('error', 'Không tìm thấy giải trí');
            return res.redirect('/admin/entertainments');
        }

        res.render('admin/layout', {
            pageTitle: `Chi tiết - ${entertainment.name}`,
            page: 'entertainments',
            body: 'admin/pages/entertainments/show',
            entertainment
        });
    } catch (error) {
        console.error('Error fetching entertainment:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải chi tiết');
        res.redirect('/admin/entertainments');
    }
};

// Show edit form
module.exports.edit = async (req, res) => {
    try {
        const entertainment = await Entertainment.findById(req.params.id);
        if (!entertainment) {
            req.flash('error', 'Không tìm thấy giải trí');
            return res.redirect('/admin/entertainments');
        }

        const zones = await Entertainment.distinct('zone');
        const types = await Entertainment.distinct('type');

        res.render('admin/layout', {
            pageTitle: `Chỉnh sửa - ${entertainment.name}`,
            page: 'entertainments',
            body: 'admin/pages/entertainments/edit',
            entertainment,
            zones,
            types,
            errors: null
        });
    } catch (error) {
        console.error('Error loading edit form:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải form chỉnh sửa');
        res.redirect('/admin/entertainments');
    }
};

// Update entertainment
module.exports.update = async (req, res) => {
    try {
        // Basic validation
        const { zone, name, type, address, openHours, ticket, lat, lng, embedUrl } = req.body;
        if (!zone || !name || !type || !address || !openHours || !ticket || !lat || !lng || !embedUrl) {
            const entertainment = await Entertainment.findById(req.params.id);
            const zones = await Entertainment.distinct('zone');
            const types = await Entertainment.distinct('type');
            
            return res.render('admin/layout', {
                pageTitle: `Chỉnh sửa - ${entertainment.name}`,
                page: 'entertainments',
                body: 'admin/pages/entertainments/edit',
                entertainment: { ...entertainment.toObject(), ...req.body },
                zones,
                types,
                errors: [{ msg: 'Vui lòng điền đầy đủ các trường bắt buộc' }]
            });
        }

        const {
            activities, audience, history, architecture,
            experience, notes, images,
            isActive, featured
        } = req.body;

        // Process arrays
        const activitiesArray = activities ? activities.split('\n').filter(item => item.trim()) : [];
        const audienceArray = audience ? audience.split('\n').filter(item => item.trim()) : [];
        const experienceArray = experience ? experience.split('\n').filter(item => item.trim()) : [];
        const notesArray = notes ? notes.split('\n').filter(item => item.trim()) : [];
        const imagesArray = images ? images.split('\n').filter(item => item.trim()) : [];

        const updateData = {
            zone,
            name,
            type,
            address,
            openHours,
            ticket,
            activities: activitiesArray,
            audience: audienceArray,
            history: history || null,
            architecture: architecture || null,
            experience: experienceArray,
            notes: notesArray,
            images: imagesArray,
            map: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                embedUrl
            },
            isActive: isActive === 'on',
            featured: featured === 'on'
        };

        await Entertainment.findByIdAndUpdate(req.params.id, updateData);

        req.flash('success', 'Cập nhật giải trí thành công');
        res.redirect('/admin/entertainments');
    } catch (error) {
        console.error('Error updating entertainment:', error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật giải trí');
        res.redirect(`/admin/entertainments/edit/${req.params.id}`);
    }
};

// Delete entertainment
module.exports.destroy = async (req, res) => {
    try {
        const entertainment = await Entertainment.findById(req.params.id);
        if (!entertainment) {
            req.flash('error', 'Không tìm thấy giải trí');
            return res.redirect('/admin/entertainments');
        }

        await Entertainment.findByIdAndDelete(req.params.id);
        req.flash('success', 'Xóa giải trí thành công');
        res.redirect('/admin/entertainments');
    } catch (error) {
        console.error('Error deleting entertainment:', error);
        req.flash('error', 'Có lỗi xảy ra khi xóa giải trí');
        res.redirect('/admin/entertainments');
    }
};

// Toggle active status
module.exports.toggleActive = async (req, res) => {
    try {
        const entertainment = await Entertainment.findById(req.params.id);
        if (!entertainment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giải trí' });
        }

        entertainment.isActive = !entertainment.isActive;
        await entertainment.save();

        res.json({ 
            success: true, 
            isActive: entertainment.isActive,
            message: entertainment.isActive ? 'Đã kích hoạt' : 'Đã vô hiệu hóa'
        });
    } catch (error) {
        console.error('Error toggling active status:', error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
    }
};

// Toggle featured status
module.exports.toggleFeatured = async (req, res) => {
    try {
        const entertainment = await Entertainment.findById(req.params.id);
        if (!entertainment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giải trí' });
        }

        entertainment.featured = !entertainment.featured;
        await entertainment.save();

        res.json({ 
            success: true, 
            featured: entertainment.featured,
            message: entertainment.featured ? 'Đã đánh dấu nổi bật' : 'Đã bỏ đánh dấu nổi bật'
        });
    } catch (error) {
        console.error('Error toggling featured status:', error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
    }
};
