const Transportation = require('../../model/Transportation');

// [GET] /admin/transportations
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
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
    if (category) query.category = category;
    if (type) query.type = type;
    if (status) {
      if (status === 'active') query.isActive = true;
      else if (status === 'inactive') query.isActive = false;
      else if (status === 'featured') query.featured = true;
    }

    const transportations = await Transportation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Transportation.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, data: { transportations, pagination: { currentPage: page, totalPages, total, limit }, filters: { search, category, type, status } } });
    }

    res.render('admin/layout', {
      pageTitle: 'Quản lý Di chuyển',
      page: 'transportations',
      user: req.user,
      transportations,
      currentPage: page,
      totalPages,
      search,
      category,
      type,
      status,
      req: req,
      categories: [
        { value: 'den-ha-noi', label: 'Đến Hà Nội' },
        { value: 'trong-ha-noi', label: 'Trong Hà Nội' }
      ],
      types: [
        { value: 'may-bay', label: 'Máy bay' },
        { value: 'tau-hoa', label: 'Tàu hỏa' },
        { value: 'xe-khach', label: 'Xe khách' },
        { value: 'xe-ca-nhan', label: 'Xe cá nhân' },
        { value: 'taxi', label: 'Taxi' },
        { value: 'xe-cong-nghe', label: 'Xe công nghệ' },
        { value: 'xe-bus', label: 'Xe bus' },
        { value: 'tau-dien', label: 'Tàu điện' },
        { value: 'xe-may', label: 'Xe máy' },
        { value: 'xe-dap', label: 'Xe đạp' },
        { value: 'xich-lo', label: 'Xích lô' },
        { value: 'xe-dien-du-lich', label: 'Xe điện du lịch' },
        { value: 'thue-o-to', label: 'Thuê ô tô' },
        { value: 'di-bo', label: 'Đi bộ' },
        { value: 'xe-bus-2-tang', label: 'Xe bus 2 tầng' },
        { value: 'xe-dien-mini', label: 'Xe điện mini' }
      ],
      body: 'admin/pages/transportations/index'
    });
  } catch (error) {
    console.error('Transportations index error:', error);
    res.render('admin/layout', {
      pageTitle: 'Quản lý Di chuyển',
      page: 'transportations',
      user: req.user,
      transportations: [],
      currentPage: 1,
      totalPages: 0,
      search: '',
      category: '',
      type: '',
      status: '',
      req: req,
      categories: [],
      types: [],
      body: 'admin/pages/transportations/index'
    });
  }
};

// [GET] /admin/transportations/create
module.exports.create = (req, res) => {
  res.render('admin/layout', {
    pageTitle: 'Thêm phương tiện',
    page: 'transportations',
    body: 'admin/pages/transportations/create',
    user: req.user,
    categories: [
      { value: 'den-ha-noi', label: 'Đến Hà Nội' },
      { value: 'trong-ha-noi', label: 'Trong Hà Nội' }
    ],
    types: [
      { value: 'may-bay', label: 'Máy bay' },
      { value: 'tau-hoa', label: 'Tàu hỏa' },
      { value: 'xe-khach', label: 'Xe khách' },
      { value: 'xe-ca-nhan', label: 'Xe cá nhân' },
      { value: 'taxi', label: 'Taxi' },
      { value: 'xe-cong-nghe', label: 'Xe công nghệ' },
      { value: 'xe-bus', label: 'Xe bus' },
      { value: 'tau-dien', label: 'Tàu điện' },
      { value: 'xe-may', label: 'Xe máy' },
      { value: 'xe-dap', label: 'Xe đạp' },
      { value: 'xich-lo', label: 'Xích lô' },
      { value: 'xe-dien-du-lich', label: 'Xe điện du lịch' },
      { value: 'thue-o-to', label: 'Thuê ô tô' },
      { value: 'di-bo', label: 'Đi bộ' },
      { value: 'xe-bus-2-tang', label: 'Xe bus 2 tầng' },
      { value: 'xe-dien-mini', label: 'Xe điện mini' }
    ]
  });
};

// Validation helper
const validateTransportation = (data) => {
  const errors = [];
  if (!data.name || String(data.name).trim() === '') errors.push('Tên phương tiện là bắt buộc');
  if (!data.category) errors.push('Danh mục là bắt buộc');
  if (!data.type) errors.push('Loại phương tiện là bắt buộc');
  if (!data.description || String(data.description).trim() === '') errors.push('Mô tả là bắt buộc');
  return errors;
};

// [POST] /admin/transportations
module.exports.store = async (req, res) => {
  try {
    const data = req.body;

    const validationErrors = validateTransportation(data);
    if (validationErrors.length > 0) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: validationErrors });
      }
      req.flash('error', validationErrors.join(', '));
      return res.redirect('/admin/transportations/create');
    }

    // Handle images
    if (req.files && req.files.length > 0) {
      const uploaded = req.files.map(f => ({ url: `/uploads/${f.filename}`, alt: '', isMain: false }));
      data.images = uploaded;
    }

    // Normalize arrays
    const arrayFields = ['features', 'featuresEn', 'tips', 'tipsEn', 'tags'];
    arrayFields.forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) data[field] = data[field].filter(v => v && String(v).trim() !== '');
        else data[field] = [data[field]].filter(v => v && String(v).trim() !== '');
      }
    });

    // Normalize nested numbers
    if (data.priceRange) {
      if (data.priceRange.from) data.priceRange.from = parseFloat(data.priceRange.from);
      if (data.priceRange.to) data.priceRange.to = parseFloat(data.priceRange.to);
    }
    if (data.routes) {
      if (!Array.isArray(data.routes)) data.routes = [data.routes];
    }

    // Booleans
    data.isActive = data.isActive === 'on' || data.isActive === true || data.isActive === 'true';
    data.featured = data.featured === 'on' || data.featured === true || data.featured === 'true';

    const item = new Transportation(data);
    await item.save();

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(201).json({ success: true, message: 'Thêm phương tiện thành công', data: item });
    }
    req.flash('success', 'Thêm phương tiện thành công');
    res.redirect('/admin/transportations');
  } catch (error) {
    console.error('Store transportation error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi thêm phương tiện', error: error.message });
    }
    req.flash('error', 'Có lỗi xảy ra khi thêm phương tiện: ' + error.message);
    res.redirect('/admin/transportations/create');
  }
};

// [GET] /admin/transportations/:id
module.exports.show = async (req, res) => {
  try {
    const item = await Transportation.findById(req.params.id);
    if (!item) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phương tiện' });
      }
      req.flash('error', 'Không tìm thấy phương tiện');
      return res.redirect('/admin/transportations');
    }

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, data: item });
    }

    res.render('admin/layout', {
      pageTitle: `Chi tiết: ${item.name}`,
      page: 'transportations',
      body: 'admin/pages/transportations/show',
      user: req.user,
      item
    });
  } catch (error) {
    console.error('Show transportation error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/transportations');
  }
};

// [GET] /admin/transportations/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const item = await Transportation.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Không tìm thấy phương tiện');
      return res.redirect('/admin/transportations');
    }
    res.render('admin/layout', {
      pageTitle: `Chỉnh sửa: ${item.name}`,
      page: 'transportations',
      body: 'admin/pages/transportations/edit',
      user: req.user,
      item,
      categories: [
        { value: 'den-ha-noi', label: 'Đến Hà Nội' },
        { value: 'trong-ha-noi', label: 'Trong Hà Nội' }
      ],
      types: [
        { value: 'may-bay', label: 'Máy bay' },
        { value: 'tau-hoa', label: 'Tàu hỏa' },
        { value: 'xe-khach', label: 'Xe khách' },
        { value: 'xe-ca-nhan', label: 'Xe cá nhân' },
        { value: 'taxi', label: 'Taxi' },
        { value: 'xe-cong-nghe', label: 'Xe công nghệ' },
        { value: 'xe-bus', label: 'Xe bus' },
        { value: 'tau-dien', label: 'Tàu điện' },
        { value: 'xe-may', label: 'Xe máy' },
        { value: 'xe-dap', label: 'Xe đạp' },
        { value: 'xich-lo', label: 'Xích lô' },
        { value: 'xe-dien-du-lich', label: 'Xe điện du lịch' },
        { value: 'thue-o-to', label: 'Thuê ô tô' },
        { value: 'di-bo', label: 'Đi bộ' },
        { value: 'xe-bus-2-tang', label: 'Xe bus 2 tầng' },
        { value: 'xe-dien-mini', label: 'Xe điện mini' }
      ]
    });
  } catch (error) {
    console.error('Edit transportation error:', error);
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/transportations');
  }
};

// [PATCH] /admin/transportations/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const item = await Transportation.findById(id);
    if (!item) {
      req.flash('error', 'Không tìm thấy phương tiện');
      return res.redirect('back');
    }

    // remove images
    if (data.removeImages) {
      const removeArray = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      const removeIndexes = removeArray.map(i => parseInt(i));
      item.images = (item.images || []).filter((_, idx) => !removeIndexes.includes(idx));
    }
    // add new uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({ url: `/uploads/${file.filename}`, alt: '', isMain: false }));
      item.images = [ ...(item.images || []), ...newImages ];
    }

    // Normalize booleans
    data.isActive = data.isActive === 'on' || data.isActive === true || data.isActive === 'true';
    data.featured = data.featured === 'on' || data.featured === true || data.featured === 'true';

    // Normalize arrays
    const arrayFields = ['features', 'featuresEn', 'tips', 'tipsEn', 'tags'];
    arrayFields.forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) data[field] = data[field].filter(v => v && String(v).trim() !== '');
        else data[field] = [data[field]].filter(v => v && String(v).trim() !== '');
      }
    });

    if (data.priceRange) {
      if (data.priceRange.from) data.priceRange.from = parseFloat(data.priceRange.from);
      if (data.priceRange.to) data.priceRange.to = parseFloat(data.priceRange.to);
    }

    if (data._method) delete data._method;

    const setPayload = {};
    Object.keys(data).forEach((k) => { if (k !== 'removeImages' && data[k] !== undefined) setPayload[k] = data[k]; });
    setPayload.images = item.images;

    await Transportation.updateOne({ _id: id }, { $set: setPayload }, { runValidators: true });
    req.flash('success', 'Đã cập nhật thành công phương tiện!');
  } catch (error) {
    console.error('Edit transportation PATCH error:', error);
    req.flash('error', 'Cập nhật thất bại!');
  }
  return res.redirect('back');
};

// [PUT] /admin/transportations/:id
module.exports.update = async (req, res) => {
  try {
    const data = req.body;
    const item = await Transportation.findById(req.params.id);
    if (!item) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phương tiện' });
      }
      req.flash('error', 'Không tìm thấy phương tiện');
      return res.redirect('/admin/transportations');
    }

    const wantsJson = !!(req.headers.accept && req.headers.accept.includes('application/json'));
    if (!wantsJson) {
      const validationErrors = validateTransportation(data);
      if (validationErrors.length > 0) {
        req.flash('error', validationErrors.join(', '));
        return res.redirect(`/admin/transportations/${req.params.id}/edit`);
      }
    }

    if (data.removeImages) {
      const removeArray = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      const removeIndexes = removeArray.map(i => parseInt(i));
      item.images = (item.images || []).filter((_, idx) => !removeIndexes.includes(idx));
    }
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({ url: `/uploads/${file.filename}`, alt: '', isMain: false }));
      item.images = [ ...(item.images || []), ...newImages ];
    }
    if (!data.images) data.images = item.images;

    const arrayFields = ['features', 'featuresEn', 'tips', 'tipsEn', 'tags'];
    arrayFields.forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) data[field] = data[field].filter(v => v && String(v).trim() !== '');
        else data[field] = [data[field]].filter(v => v && String(v).trim() !== '');
      }
    });

    data.isActive = data.isActive === 'on' || data.isActive === true;
    data.featured = data.featured === 'on' || data.featured === true;

    if (data.priceRange) {
      if (data.priceRange.from) data.priceRange.from = parseFloat(data.priceRange.from);
      if (data.priceRange.to) data.priceRange.to = parseFloat(data.priceRange.to);
    }

    const setPayload = {};
    Object.keys(data).forEach((k) => { if (data[k] !== undefined) setPayload[k] = data[k]; });

    await Transportation.updateOne({ _id: req.params.id }, { $set: setPayload }, { runValidators: true });
    const updated = await Transportation.findById(req.params.id);

    if (wantsJson) {
      return res.json({ success: true, message: 'Cập nhật phương tiện thành công', data: updated });
    }
    req.flash('success', 'Cập nhật phương tiện thành công');
    return res.redirect('back');
  } catch (error) {
    console.error('Update transportation error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi cập nhật phương tiện', error: error.message });
    }
    req.flash('error', 'Có lỗi xảy ra khi cập nhật phương tiện: ' + error.message);
    return res.redirect(`/admin/transportations/${req.params.id}/edit`);
  }
};

// [DELETE] /admin/transportations/delete/:id
module.exports.destroy = async (req, res) => {
  try {
    const item = await Transportation.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Không tìm thấy phương tiện');
      return res.redirect('/admin/transportations');
    }
    await Transportation.findByIdAndDelete(req.params.id);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, message: 'Xóa phương tiện thành công', data: { id: req.params.id } });
    }
    req.flash('success', 'Xóa phương tiện thành công');
    res.redirect('/admin/transportations');
  } catch (error) {
    console.error('Delete transportation error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa phương tiện', error: error.message });
    }
    req.flash('error', 'Có lỗi xảy ra khi xóa phương tiện: ' + error.message);
    res.redirect('/admin/transportations');
  }
};


