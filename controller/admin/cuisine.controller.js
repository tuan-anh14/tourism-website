const Cuisine = require('../../model/Cuisine');

// [GET] /admin/cuisines
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const type = req.query.type || '';
    const status = req.query.status || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameEn: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (type) query.type = type;
    if (status) {
      if (['published', 'draft', 'hidden'].includes(status)) query.status = status;
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
      if (status === 'featured') query.featured = true;
    }

    const cuisines = await Cuisine.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Cuisine.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: {
          cuisines,
          pagination: { currentPage: page, totalPages, total, limit },
          filters: { search, type, status }
        }
      });
    }

    res.render('admin/layout', {
      pageTitle: 'Quản lý Ẩm thực',
      page: 'cuisines',
      user: req.user,
      cuisines,
      currentPage: page,
      totalPages,
      search,
      type,
      status,
      req: req,
      types: [
        { value: 'streetfood', label: 'Street food' },
        { value: 'traditional', label: 'Truyền thống' },
        { value: 'dessert', label: 'Tráng miệng' },
        { value: 'drink', label: 'Đồ uống' },
        { value: 'restaurant', label: 'Nhà hàng đặc sản' },
        { value: 'other', label: 'Khác' }
      ],
      body: 'admin/pages/cuisines/index'
    });
  } catch (error) {
    console.error('Cuisines index error:', error);
    res.render('admin/layout', {
      pageTitle: 'Quản lý Ẩm thực',
      page: 'cuisines',
      user: req.user,
      cuisines: [],
      currentPage: 1,
      totalPages: 0,
      search: '',
      type: '',
      status: '',
      req: req,
      types: [],
      body: 'admin/pages/cuisines/index'
    });
  }
};

// [GET] /admin/cuisines/create
module.exports.create = (req, res) => {
  res.render('admin/layout', {
    pageTitle: 'Thêm Ẩm thực',
    page: 'cuisines',
    body: 'admin/pages/cuisines/create',
    user: req.user,
    types: [
      { value: 'streetfood', label: 'Street food' },
      { value: 'traditional', label: 'Truyền thống' },
      { value: 'dessert', label: 'Tráng miệng' },
      { value: 'drink', label: 'Đồ uống' },
      { value: 'restaurant', label: 'Nhà hàng đặc sản' },
      { value: 'other', label: 'Khác' }
    ]
  });
};

// Validation helper
const validateCuisine = (data) => {
  const errors = [];

  if (!data.name || String(data.name).trim() === '') {
    errors.push('Tên món/ẩm thực là bắt buộc');
  }
  if (!data.description || String(data.description).trim() === '') {
    errors.push('Mô tả chi tiết là bắt buộc');
  }

  // Validate places coordinates if provided
  if (Array.isArray(data.places)) {
    data.places.forEach((p, idx) => {
      if (p && p.location && Array.isArray(p.location.coordinates) && p.location.coordinates.length === 2) {
        const [lng, lat] = p.location.coordinates;
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          errors.push(`Tọa độ không hợp lệ tại địa điểm #${idx + 1}`);
        }
      }
    });
  }

  return errors;
};

// [POST] /admin/cuisines
module.exports.store = async (req, res) => {
  try {
    const data = req.body;

    const validationErrors = validateCuisine(data);
    if (validationErrors.length > 0) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: validationErrors });
      }
      req.flash('error', validationErrors.join(', '));
      return res.redirect('/admin/cuisines/create');
    }

    // Handle images uploads -> push to mainImages
    if (req.files && req.files.length > 0) {
      const uploaded = req.files.map((f) => `/uploads/${f.filename}`);
      data.mainImages = uploaded;
    }

    // Normalize arrays
    const arrayFields = ['feature', 'tags', 'mainImages', 'gallery'];
    arrayFields.forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          data[field] = data[field].filter((v) => v && String(v).trim() !== '');
        } else {
          data[field] = [data[field]].filter((v) => v && String(v).trim() !== '');
        }
      }
    });

    // Normalize booleans
    data.isActive = data.isActive === 'on' || data.isActive === true || data.isActive === 'true';
    data.featured = data.featured === 'on' || data.featured === true || data.featured === 'true';

    const cuisine = new Cuisine(data);
    await cuisine.save();

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(201).json({ success: true, message: 'Thêm ẩm thực thành công', data: cuisine });
    }
    req.flash('success', 'Thêm ẩm thực thành công');
    res.redirect('/admin/cuisines');
  } catch (error) {
    console.error('Store cuisine error:', error);
    if (error.code === 11000) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Tên hoặc slug đã tồn tại' });
      }
      req.flash('error', 'Tên hoặc slug đã tồn tại');
    } else if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((e) => e.message);
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: validationErrors });
      }
      req.flash('error', validationErrors.join(', '));
    } else {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi thêm ẩm thực', error: error.message });
      }
      req.flash('error', 'Có lỗi xảy ra khi thêm ẩm thực: ' + error.message);
    }
    if (!(req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.redirect('/admin/cuisines/create');
    }
  }
};

// [GET] /admin/cuisines/:id
module.exports.show = async (req, res) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);
    if (!cuisine) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy ẩm thực' });
      }
      req.flash('error', 'Không tìm thấy ẩm thực');
      return res.redirect('/admin/cuisines');
    }

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, data: cuisine });
    }

    res.render('admin/layout', {
      pageTitle: `Chi tiết: ${cuisine.name}`,
      page: 'cuisines',
      body: 'admin/pages/cuisines/show',
      user: req.user,
      cuisine
    });
  } catch (error) {
    console.error('Show cuisine error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/cuisines');
  }
};

// [GET] /admin/cuisines/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const cuisine = await Cuisine.findById(id);
    if (!cuisine) {
      req.flash('error', 'Không tìm thấy ẩm thực');
      return res.redirect('/admin/cuisines');
    }

    res.render('admin/layout', {
      pageTitle: `Chỉnh sửa: ${cuisine.name}`,
      page: 'cuisines',
      body: 'admin/pages/cuisines/edit',
      user: req.user,
      cuisine,
      types: [
        { value: 'streetfood', label: 'Street food' },
        { value: 'traditional', label: 'Truyền thống' },
        { value: 'dessert', label: 'Tráng miệng' },
        { value: 'drink', label: 'Đồ uống' },
        { value: 'restaurant', label: 'Nhà hàng đặc sản' },
        { value: 'other', label: 'Khác' }
      ]
    });
  } catch (error) {
    console.error('Edit cuisine error:', error);
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/cuisines');
  }
};

// [PATCH] /admin/cuisines/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const cuisine = await Cuisine.findById(id);
    if (!cuisine) {
      req.flash('error', 'Không tìm thấy ẩm thực');
      return res.redirect('back');
    }

    // remove mainImages indexes
    if (data.removeImages) {
      const removeArray = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      const removeIndexes = removeArray.map((i) => parseInt(i));
      cuisine.mainImages = (cuisine.mainImages || []).filter((_, idx) => !removeIndexes.includes(idx));
    }

    // add new uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      cuisine.mainImages = [ ...(cuisine.mainImages || []), ...newImages ];
    }

    // normalize booleans
    data.isActive = data.isActive === 'on' || data.isActive === true || data.isActive === 'true';
    data.featured = data.featured === 'on' || data.featured === true || data.featured === 'true';

    // normalize arrays
    const arrayFields = ['feature', 'tags', 'gallery'];
    arrayFields.forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) data[field] = data[field].filter((v) => v && String(v).trim() !== '');
        else data[field] = [data[field]].filter((v) => v && String(v).trim() !== '');
      }
    });

    if (data._method) delete data._method;

    const setPayload = {};
    Object.keys(data).forEach((key) => {
      if (key !== 'removeImages' && data[key] !== undefined) setPayload[key] = data[key];
    });
    setPayload.mainImages = cuisine.mainImages;

    await Cuisine.updateOne({ _id: id }, { $set: setPayload }, { runValidators: true });
    req.flash('success', 'Đã cập nhật thành công ẩm thực!');
  } catch (error) {
    console.error('Edit cuisine PATCH error:', error);
    req.flash('error', 'Cập nhật thất bại!');
  }
  return res.redirect('back');
};

// [PUT] /admin/cuisines/:id
module.exports.update = async (req, res) => {
  try {
    const data = req.body;
    const cuisine = await Cuisine.findById(req.params.id);
    if (!cuisine) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy ẩm thực' });
      }
      req.flash('error', 'Không tìm thấy ẩm thực');
      return res.redirect('/admin/cuisines');
    }

    const wantsJson = !!(req.headers.accept && req.headers.accept.includes('application/json'));
    if (!wantsJson) {
      const validationErrors = validateCuisine(data);
      if (validationErrors.length > 0) {
        req.flash('error', validationErrors.join(', '));
        return res.redirect(`/admin/cuisines/${req.params.id}/edit`);
      }
    }

    // Handle remove indexes
    if (data.removeImages) {
      const removeArray = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      const removeIndexes = removeArray.map((i) => parseInt(i));
      cuisine.mainImages = (cuisine.mainImages || []).filter((_, idx) => !removeIndexes.includes(idx));
    }

    // Handle uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      cuisine.mainImages = [ ...(cuisine.mainImages || []), ...newImages ];
    }
    if (!data.mainImages) data.mainImages = cuisine.mainImages;

    // Normalize arrays
    const arrayFields = ['feature', 'tags', 'gallery'];
    arrayFields.forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) data[field] = data[field].filter((v) => v && String(v).trim() !== '');
        else data[field] = [data[field]].filter((v) => v && String(v).trim() !== '');
      }
    });

    // Normalize booleans
    data.isActive = data.isActive === 'on' || data.isActive === true;
    data.featured = data.featured === 'on' || data.featured === true;

    const setPayload = {};
    Object.keys(data).forEach((k) => { if (data[k] !== undefined) setPayload[k] = data[k]; });

    await Cuisine.updateOne({ _id: req.params.id }, { $set: setPayload }, { runValidators: true });
    const updated = await Cuisine.findById(req.params.id);

    if (wantsJson) {
      return res.json({ success: true, message: 'Cập nhật ẩm thực thành công', data: updated });
    }
    req.flash('success', 'Cập nhật ẩm thực thành công');
    return res.redirect('back');
  } catch (error) {
    console.error('Update cuisine error:', error);
    if (error.code === 11000) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Tên hoặc slug đã tồn tại' });
      }
      req.flash('error', 'Tên hoặc slug đã tồn tại');
    } else if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((e) => e.message);
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: validationErrors });
      }
      req.flash('error', validationErrors.join(', '));
    } else {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi cập nhật ẩm thực', error: error.message });
      }
      req.flash('error', 'Có lỗi xảy ra khi cập nhật ẩm thực: ' + error.message);
    }
    if (!(req.headers.accept && req.headers.accept.includes('application/json'))){
      return res.redirect(`/admin/cuisines/${req.params.id}/edit`);
    }
  }
};

// [DELETE] /admin/cuisines/delete/:id
module.exports.destroy = async (req, res) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);
    if (!cuisine) {
      req.flash('error', 'Không tìm thấy ẩm thực');
      return res.redirect('/admin/cuisines');
    }
    await Cuisine.findByIdAndDelete(req.params.id);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, message: 'Xóa ẩm thực thành công', data: { id: req.params.id } });
    }
    req.flash('success', 'Xóa ẩm thực thành công');
    res.redirect('/admin/cuisines');
  } catch (error) {
    console.error('Delete cuisine error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa ẩm thực', error: error.message });
    }
    req.flash('error', 'Có lỗi xảy ra khi xóa ẩm thực: ' + error.message);
    res.redirect('/admin/cuisines');
  }
};


