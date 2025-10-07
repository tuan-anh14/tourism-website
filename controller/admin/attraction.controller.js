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
        { value: 'van-hoa', label: 'Văn hóa' },
        { value: 'lich-su', label: 'Lịch sử' },
        { value: 'tu-nhien', label: 'Tự nhiên' },
        { value: 'ton-giao', label: 'Tôn giáo' },
        { value: 'bao-tang', label: 'Bảo tàng' },
        { value: 'lang-nghe', label: 'Làng nghề' },
        { value: 'pho-co', label: 'Phố cổ' },
        { value: 'khu-vui-choi', label: 'Khu vui chơi' },
        { value: 'le-hoi', label: 'Lễ hội' }
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
      { value: 'van-hoa', label: 'Văn hóa' },
      { value: 'lich-su', label: 'Lịch sử' },
      { value: 'tu-nhien', label: 'Tự nhiên' },
      { value: 'ton-giao', label: 'Tôn giáo' },
      { value: 'bao-tang', label: 'Bảo tàng' },
      { value: 'lang-nghe', label: 'Làng nghề' },
      { value: 'pho-co', label: 'Phố cổ' },
      { value: 'khu-vui-choi', label: 'Khu vui chơi' },
      { value: 'le-hoi', label: 'Lễ hội' }
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
    console.log('[ADMIN][ATTRACTION][STORE] body:', JSON.stringify(data));
    console.log('[ADMIN][ATTRACTION][STORE] files:', (req.files || []).map(f => ({ field: f.fieldname, name: f.originalname, size: f.size })));
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

    // Xử lý ticket_info
    if (data.ticket_info) {
      Object.keys(data.ticket_info).forEach(key => {
        if (data.ticket_info[key] && data.ticket_info[key] !== '') {
          data.ticket_info[key] = parseFloat(data.ticket_info[key]);
        } else {
          delete data.ticket_info[key];
        }
      });
    }

    // Xử lý map coordinates
    if (data.map && data.map.lat && data.map.lng) {
      data.map.lat = parseFloat(data.map.lat);
      data.map.lng = parseFloat(data.map.lng);
    }

    const attraction = new Attraction(data);
    await attraction.save();
    console.log('[ADMIN][ATTRACTION][STORE] saved:', attraction._id, 'in', (Date.now() - startTime) + 'ms');

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
    const attraction = await Attraction.findById(req.params.id);
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
        { value: 'van-hoa', label: 'Văn hóa' },
        { value: 'lich-su', label: 'Lịch sử' },
        { value: 'tu-nhien', label: 'Tự nhiên' },
        { value: 'ton-giao', label: 'Tôn giáo' },
        { value: 'bao-tang', label: 'Bảo tàng' },
        { value: 'lang-nghe', label: 'Làng nghề' },
        { value: 'pho-co', label: 'Phố cổ' },
        { value: 'khu-vui-choi', label: 'Khu vui chơi' },
        { value: 'le-hoi', label: 'Lễ hội' }
      ]
    });
  } catch (error) {
    console.error('Edit attraction error:', error);
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/attractions');
  }
};

// [PUT] /admin/attractions/:id
module.exports.update = async (req, res) => {
  try {
    const data = req.body;
    console.log('[ADMIN][ATTRACTION][UPDATE] id:', req.params.id);
    console.log('[ADMIN][ATTRACTION][UPDATE] body:', JSON.stringify(data));
    console.log('[ADMIN][ATTRACTION][UPDATE] files:', (req.files || []).map(f => ({ field: f.fieldname, name: f.originalname, size: f.size })));
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
    if (data.removeImages && Array.isArray(data.removeImages)) {
      const removeIndexes = data.removeImages.map(index => parseInt(index));
      attraction.images = attraction.images.filter((_, index) => !removeIndexes.includes(index));
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

    // Xử lý ticket_info
    if (data.ticket_info) {
      Object.keys(data.ticket_info).forEach(key => {
        if (data.ticket_info[key] && data.ticket_info[key] !== '') {
          data.ticket_info[key] = parseFloat(data.ticket_info[key]);
        } else {
          delete data.ticket_info[key];
        }
      });
    }

    // Xử lý map coordinates
    if (data.map && data.map.lat && data.map.lng) {
      data.map.lat = parseFloat(data.map.lat);
      data.map.lng = parseFloat(data.map.lng);
    }

    // Cập nhật images vào data (giữ ảnh cũ nếu không upload mới)
    if (!data.images) {
      data.images = attraction.images;
    }

    // Nếu là JSON, chỉ cập nhật các field được gửi lên (partial update)
    const updatePayload = wantsJson ? { $set: data } : data;
    const updated = await Attraction.findByIdAndUpdate(req.params.id, updatePayload, { new: true, runValidators: true });
    console.log('[ADMIN][ATTRACTION][UPDATE] saved:', updated ? updated._id : 'not-found', 'in', (Date.now() - startTime) + 'ms');

    if (wantsJson) {
      return res.json({ success: true, message: 'Cập nhật điểm tham quan thành công', data: updated });
    }
    req.flash('success', 'Cập nhật điểm tham quan thành công');
    res.redirect('/admin/attractions');
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

