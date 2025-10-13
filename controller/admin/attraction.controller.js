const Attraction = require('../../model/Attraction');

// [GET] /admin/attractions
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameEn: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }
    if (status) {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      } else if (status === 'featured') {
        query.featured = true;
      }
    }

    const attractions = await Attraction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Attraction.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Check if request wants JSON (from Postman/API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: {
          attractions,
          pagination: {
            currentPage: page,
            totalPages,
            total,
            limit
          },
          filters: {
            search,
            category,
            status
          }
        }
      });
    }

    res.render('admin/layout', {
      pageTitle: 'Quản lý Điểm tham quan',
      page: 'attractions',
      user: req.user,
      attractions,
      currentPage: page,
      totalPages,
      search,
      category,
      status,
      req: req, // Truyền req vào view
      categories: [
        { value: 'nhan-van', label: 'Điểm tham quan nhân văn' },
        { value: 'tu-nhien', label: 'Điểm đến tham quan tự nhiên' }
      ],
      body: 'admin/pages/attractions/index'
    });
  } catch (error) {
    console.error('Attractions index error:', error);
    res.render('admin/layout', {
      pageTitle: 'Quản lý Điểm tham quan',
      page: 'attractions',
      user: req.user,
      attractions: [],
      currentPage: 1,
      totalPages: 0,
      search: '',
      category: '',
      status: '',
      req: req, // Truyền req vào view
      categories: [],
      body: 'admin/pages/attractions/index'
    });
  }
};

// [GET] /admin/attractions/create
module.exports.create = (req, res) => {
  res.render('admin/layout', {
    pageTitle: 'Thêm Điểm tham quan',
    page: 'attractions',
    body: 'admin/pages/attractions/create',
    user: req.user,
    categories: [
      { value: 'nhan-van', label: 'Điểm tham quan nhân văn' },
      { value: 'tu-nhien', label: 'Điểm đến tham quan tự nhiên' }
    ]
  });
};

// Validation helper
const validateAttraction = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Tên điểm tham quan là bắt buộc');
  }
  
  if (!data.category) {
    errors.push('Danh mục là bắt buộc');
  }
  
  if (!data.address || data.address.trim() === '') {
    errors.push('Địa chỉ là bắt buộc');
  }
  
  if (!data.district || data.district.trim() === '') {
    errors.push('Quận/Huyện là bắt buộc');
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.push('Mô tả chi tiết là bắt buộc');
  }
  
  if (data.lat && data.lng) {
    const lat = parseFloat(data.lat);
    const lng = parseFloat(data.lng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      errors.push('Tọa độ không hợp lệ');
    }
  }
  
  return errors;
};

// [POST] /admin/attractions
module.exports.store = async (req, res) => {
  try {
    const data = req.body;
    const startTime = Date.now();
    
    // Validation
    const validationErrors = validateAttraction(data);
    if (validationErrors.length > 0) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: validationErrors
        });
      }
      req.flash('error', validationErrors.join(', '));
      return res.redirect('/admin/attractions/create');
    }
    
    // Xử lý images nếu có
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Xử lý arrays - loại bỏ empty values
    const arrayFields = ['highlights', 'visitor_notes'];
    arrayFields.forEach(field => {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          data[field] = data[field].filter(item => item && item.trim() !== '');
        } else {
          data[field] = [data[field]].filter(item => item && item.trim() !== '');
        }
      }
    });

    // Xử lý boolean fields
    data.isActive = data.isActive === 'on' || data.isActive === true;
    data.featured = data.featured === 'on' || data.featured === true;

    // ticket_info now is free text string; trim it
    if (typeof data.ticket_info === 'string') {
      data.ticket_info = data.ticket_info.trim();
    }

    // Xử lý map coordinates
    if (data.map && data.map.lat && data.map.lng) {
      data.map.lat = parseFloat(data.map.lat);
      data.map.lng = parseFloat(data.map.lng);
    }

    const attraction = new Attraction(data);
    await attraction.save();
    // Saved successfully

    // Check if request wants JSON (from Postman/API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(201).json({
        success: true,
        message: 'Thêm điểm tham quan thành công',
        data: attraction
      });
    }

    req.flash('success', 'Thêm điểm tham quan thành công');
    res.redirect('/admin/attractions');
  } catch (error) {
    console.error('Store attraction error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Tên điểm tham quan đã tồn tại'
        });
      }
      req.flash('error', 'Tên điểm tham quan đã tồn tại');
    } else if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: validationErrors
        });
      }
      req.flash('error', validationErrors.join(', '));
    } else {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra khi thêm điểm tham quan',
          error: error.message
        });
      }
      req.flash('error', 'Có lỗi xảy ra khi thêm điểm tham quan: ' + error.message);
    }
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return; // Already sent JSON response
    }
    res.redirect('/admin/attractions/create');
  }
};

// [GET] /admin/attractions/:id
module.exports.show = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy điểm tham quan'
        });
      }
      req.flash('error', 'Không tìm thấy điểm tham quan');
      return res.redirect('/admin/attractions');
    }

    // Check if request wants JSON (from Postman/API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: attraction
      });
    }

    res.render('admin/layout', {
      pageTitle: `Chi tiết: ${attraction.name}`,
      page: 'attractions',
      body: 'admin/pages/attractions/show',
      user: req.user,
      attraction
    });
  } catch (error) {
    console.error('Show attraction error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/attractions');
  }
};

// [GET] /admin/attractions/:id/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const attraction = await Attraction.findById(id);
    if (!attraction) {
      req.flash('error', 'Không tìm thấy điểm tham quan');
      return res.redirect('/admin/attractions');
    }

    res.render('admin/layout', {
      pageTitle: `Chỉnh sửa: ${attraction.name}`,
      page: 'attractions',
      body: 'admin/pages/attractions/edit',
      user: req.user,
      attraction,
      categories: [
        { value: 'nhan-van', label: 'Điểm tham quan nhân văn' },
        { value: 'tu-nhien', label: 'Điểm đến tham quan tự nhiên' }
      ]
    });
  } catch (error) {
    console.error('Edit attraction error:', error);
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/attractions');
  }
};

// [PATCH] /admin/attractions/edit/:id (align ProductManagement)
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    // Edit PATCH request received

    const attraction = await Attraction.findById(id);
    if (!attraction) {
      req.flash('error', 'Không tìm thấy điểm tham quan');
      return res.redirect('back');
    }

    // remove images
    if (data.removeImages) {
      const removeArray = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      const removeIndexes = removeArray.map(i => parseInt(i));
      attraction.images = (attraction.images || []).filter((_, idx) => !removeIndexes.includes(idx));
    }

    // add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      attraction.images = [ ...(attraction.images || []), ...newImages ];
    }

    // Normalize booleans (checkbox sends 'on' when checked, undefined when unchecked)
    data.isActive = data.isActive === 'on' || data.isActive === true || data.isActive === 'true';
    data.featured = data.featured === 'on' || data.featured === true || data.featured === 'true';

    // Normalize arrays - remove empty values
    const arrayFields = ['highlights', 'visitor_notes'];
    arrayFields.forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          data[field] = data[field].filter((item) => item && String(item).trim() !== '');
        } else {
          data[field] = [data[field]].filter((item) => item && String(item).trim() !== '');
        }
      }
    });

    // ticket_info now is free text string; trim it
    if (typeof data.ticket_info === 'string') {
      data.ticket_info = data.ticket_info.trim();
    }

    // Normalize map coordinates
    if (data.map && data.map.lat && data.map.lng) {
      const latNum = parseFloat(data.map.lat);
      const lngNum = parseFloat(data.map.lng);
      if (!Number.isNaN(latNum)) data.map.lat = latNum;
      if (!Number.isNaN(lngNum)) data.map.lng = lngNum;
    }

    // Remove method-override helper
    if (data._method) delete data._method;

    // build $set payload from data
    const setPayload = {};
    Object.keys(data).forEach((key) => {
      if (key !== 'removeImages' && data[key] !== undefined) setPayload[key] = data[key];
    });
    setPayload.images = attraction.images;

    const pushPayload = {};
    if (req.user && req.user._id) {
      pushPayload.updatedBy = {
        account_id: req.user._id,
        updateAt: new Date()
      };
    }

    const updateOps = Object.keys(pushPayload).length
      ? { $set: setPayload, $push: pushPayload }
      : { $set: setPayload };

    await Attraction.updateOne({ _id: id }, updateOps, { runValidators: true });
    req.flash('success', 'Đã cập nhật thành công điểm tham quan!');
  } catch (error) {
    console.error('Edit attraction PATCH error:', error);
    req.flash('error', 'Cập nhật thất bại!');
  }
  return res.redirect('back');
};

// [PUT] /admin/attractions/:id
module.exports.update = async (req, res) => {
  try {
    const data = req.body;
    // Update request received
    const startTime = Date.now();
    const attraction = await Attraction.findById(req.params.id);
    
    if (!attraction) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy điểm tham quan' });
      }
      req.flash('error', 'Không tìm thấy điểm tham quan');
      return res.redirect('/admin/attractions');
    }

    // Validation
    const wantsJson = !!(req.headers.accept && req.headers.accept.includes('application/json'));
    if (!wantsJson) {
      const validationErrors = validateAttraction(data);
      if (validationErrors.length > 0) {
        req.flash('error', validationErrors.join(', '));
        return res.redirect(`/admin/attractions/${req.params.id}/edit`);
      }
    }

    // Xử lý xóa images cũ nếu được chọn
    if (data.removeImages) {
      const removeArray = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      const removeIndexes = removeArray.map(index => parseInt(index));
      attraction.images = (attraction.images || []).filter((_, index) => !removeIndexes.includes(index));
    }

    // Xử lý images mới nếu có
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      attraction.images = [...attraction.images, ...newImages];
    }

    // Xử lý arrays - loại bỏ empty values
    const arrayFields = ['highlights', 'visitor_notes'];
    arrayFields.forEach(field => {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          data[field] = data[field].filter(item => item && item.trim() !== '');
        } else {
          data[field] = [data[field]].filter(item => item && item.trim() !== '');
        }
      }
    });

    // Xử lý boolean fields
    data.isActive = data.isActive === 'on' || data.isActive === true;
    data.featured = data.featured === 'on' || data.featured === true;

    // ticket_info now is free text string; trim it
    if (typeof data.ticket_info === 'string') {
      data.ticket_info = data.ticket_info.trim();
    }

    // Xử lý map coordinates
    if (data.map && data.map.lat && data.map.lng) {
      data.map.lat = parseFloat(data.map.lat);
      data.map.lng = parseFloat(data.map.lng);
    }

    // Thêm ảnh mới nếu upload từ form và giữ ảnh cũ
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      attraction.images = [ ...(attraction.images || []), ...newImages ];
    }
    // Cập nhật images vào data (giữ ảnh cũ nếu không upload mới)
    if (!data.images) data.images = attraction.images;

    // Tạo payload $set chỉ gồm các field thực sự có trong request
    const setPayload = {};
    Object.keys(data).forEach((k) => {
      if (data[k] !== undefined) setPayload[k] = data[k];
    });

    const pushPayload = {};
    if (req.user && req.user._id) {
      pushPayload.updatedBy = {
        account_id: req.user._id,
        updateAt: new Date()
      };
    }

    const updateOps = Object.keys(pushPayload).length
      ? { $set: setPayload, $push: pushPayload }
      : { $set: setPayload };

    await Attraction.updateOne({ _id: req.params.id }, updateOps, { runValidators: true });
    const updated = await Attraction.findById(req.params.id);
    // Updated successfully

    if (wantsJson) {
      return res.json({ success: true, message: 'Cập nhật điểm tham quan thành công', data: updated });
    }
    req.flash('success', 'Cập nhật điểm tham quan thành công');
    return res.redirect('back');
  } catch (error) {
    console.error('Update attraction error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Tên điểm tham quan đã tồn tại' });
      }
      req.flash('error', 'Tên điểm tham quan đã tồn tại');
    } else if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: validationErrors });
      }
      req.flash('error', validationErrors.join(', '));
    } else {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi cập nhật điểm tham quan', error: error.message });
      }
      req.flash('error', 'Có lỗi xảy ra khi cập nhật điểm tham quan: ' + error.message);
    }
    
    if (!(req.headers.accept && req.headers.accept.includes('application/json'))){
      return res.redirect(`/admin/attractions/${req.params.id}/edit`);
    }
  }
};

// [DELETE] /admin/attractions/:id
module.exports.destroy = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    
    if (!attraction) {
      req.flash('error', 'Không tìm thấy điểm tham quan');
      return res.redirect('/admin/attractions');
    }

    await Attraction.findByIdAndDelete(req.params.id);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, message: 'Xóa điểm tham quan thành công', data: { id: req.params.id } });
    }
    req.flash('success', 'Xóa điểm tham quan thành công');
    res.redirect('/admin/attractions');
  } catch (error) {
    console.error('Delete attraction error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa điểm tham quan', error: error.message });
    }
    req.flash('error', 'Có lỗi xảy ra khi xóa điểm tham quan: ' + error.message);
    res.redirect('/admin/attractions');
  }
};

