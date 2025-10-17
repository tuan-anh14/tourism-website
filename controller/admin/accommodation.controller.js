const Accommodation = require('../../model/Accommodation');

// [GET] /admin/accommodations
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const type = req.query.type || '';
    const status = req.query.status || '';

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) {
      query.type = type;
    }
    if (status) {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      } else if (status === 'featured') {
        query.featured = true;
      } else if (status === 'public') {
        query.status = 'public';
      } else if (status === 'draft') {
        query.status = 'draft';
      } else if (status === 'hidden') {
        query.status = 'hidden';
      }
    }

    const accommodations = await Accommodation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Accommodation.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Check if request wants JSON (from Postman/API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: {
          accommodations,
          pagination: {
            currentPage: page,
            totalPages,
            total,
            limit
          },
          filters: {
            search,
            type,
            status
          }
        }
      });
    }

    res.render('admin/layout', {
      pageTitle: 'Quản lý Lưu trú',
      page: 'accommodations',
      user: req.user,
      accommodations,
      currentPage: page,
      totalPages,
      search,
      type,
      status,
      req: req,
      types: [
        { value: 'hotel', label: 'Khách sạn' },
        { value: 'homestay', label: 'Homestay' },
        { value: 'apartment', label: 'Căn hộ' },
        { value: 'resort', label: 'Resort' },
        { value: 'farmstay', label: 'Farmstay' },
        { value: 'bungalow', label: 'Bungalow' },
        { value: 'villa', label: 'Villa' },
        { value: 'hostel', label: 'Hostel' },
        { value: 'guesthouse', label: 'Nhà nghỉ' },
        { value: 'other', label: 'Khác' }
      ],
      body: 'admin/pages/accommodations/index'
    });
  } catch (error) {
    console.error('Accommodations index error:', error);
    res.render('admin/layout', {
      pageTitle: 'Quản lý Lưu trú',
      page: 'accommodations',
      user: req.user,
      accommodations: [],
      currentPage: 1,
      totalPages: 0,
      search: '',
      type: '',
      status: '',
      req: req,
      types: [],
      body: 'admin/pages/accommodations/index'
    });
  }
};

// [GET] /admin/accommodations/create
module.exports.create = (req, res) => {
  res.render('admin/layout', {
    pageTitle: 'Thêm Lưu trú',
    page: 'accommodations',
    body: 'admin/pages/accommodations/create',
    user: req.user,
    types: [
      { value: 'hotel', label: 'Khách sạn' },
      { value: 'homestay', label: 'Homestay' },
      { value: 'apartment', label: 'Căn hộ' },
      { value: 'resort', label: 'Resort' },
      { value: 'farmstay', label: 'Farmstay' },
      { value: 'bungalow', label: 'Bungalow' },
      { value: 'villa', label: 'Villa' },
      { value: 'hostel', label: 'Hostel' },
      { value: 'guesthouse', label: 'Nhà nghỉ' },
      { value: 'other', label: 'Khác' }
    ]
  });
};

// Validation helper
const validateAccommodation = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Tên lưu trú là bắt buộc');
  }
  
  if (!data.type) {
    errors.push('Loại hình lưu trú là bắt buộc');
  }
  
  if (!data.address || !data.address.street || data.address.street.trim() === '') {
    errors.push('Địa chỉ đường là bắt buộc');
  }
  
  if (!data.address || !data.address.district || data.address.district.trim() === '') {
    errors.push('Quận/Huyện là bắt buộc');
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.push('Mô tả chi tiết là bắt buộc');
  }
  
  if (!data.priceFrom || isNaN(parseFloat(data.priceFrom)) || parseFloat(data.priceFrom) < 0) {
    errors.push('Giá từ phải là số dương');
  }
  
  if (data.map && data.map.coordinates && data.map.coordinates.length === 2) {
    const [lng, lat] = data.map.coordinates;
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      errors.push('Tọa độ không hợp lệ');
    }
  }
  
  return errors;
};

// [POST] /admin/accommodations
module.exports.store = async (req, res) => {
  try {
    const data = req.body;
    const startTime = Date.now();
    
    // Validation
    const validationErrors = validateAccommodation(data);
    if (validationErrors.length > 0) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: validationErrors
        });
      }
      req.flash('error', validationErrors.join(', '));
      return res.redirect('/admin/accommodations/create');
    }
    
    // Xử lý images nếu có
    if (req.files && req.files.length > 0) {
      // Filter main images (fieldname = 'images')
      const mainImages = req.files.filter(f => f.fieldname === 'images');
      if (mainImages.length > 0) {
        data.images = mainImages.map(file => `/uploads/${file.filename}`);
      }
    }

    // Xử lý arrays - loại bỏ empty values
    const arrayFields = ['highlights', 'amenities', 'services', 'rules', 'tags'];
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

    // Xử lý priceFrom
    if (data.priceFrom) {
      data.priceFrom = parseFloat(data.priceFrom);
    }

    // Xử lý star rating
    if (data.star) {
      data.star = parseInt(data.star);
    }

    // Xử lý map coordinates
    if (data.map && data.map.coordinates && data.map.coordinates.length === 2) {
      data.map.coordinates = data.map.coordinates.map(coord => parseFloat(coord));
    }

    // Generate slug from name if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    const accommodation = new Accommodation(data);
    await accommodation.save();

    // Check if request wants JSON (from Postman/API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(201).json({
        success: true,
        message: 'Thêm lưu trú thành công',
        data: accommodation
      });
    }

    req.flash('success', 'Thêm lưu trú thành công');
    res.redirect('/admin/accommodations');
  } catch (error) {
    console.error('Store accommodation error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Tên lưu trú hoặc slug đã tồn tại'
        });
      }
      req.flash('error', 'Tên lưu trú hoặc slug đã tồn tại');
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
          message: 'Có lỗi xảy ra khi thêm lưu trú',
          error: error.message
        });
      }
      req.flash('error', 'Có lỗi xảy ra khi thêm lưu trú: ' + error.message);
    }
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return; // Already sent JSON response
    }
    res.redirect('/admin/accommodations/create');
  }
};

// [GET] /admin/accommodations/:id
module.exports.show = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lưu trú'
        });
      }
      req.flash('error', 'Không tìm thấy lưu trú');
      return res.redirect('/admin/accommodations');
    }

    // Check if request wants JSON (from Postman/API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: accommodation
      });
    }

    res.render('admin/layout', {
      pageTitle: `Chi tiết: ${accommodation.name}`,
      page: 'accommodations',
      body: 'admin/pages/accommodations/show',
      user: req.user,
      accommodation
    });
  } catch (error) {
    console.error('Show accommodation error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/accommodations');
  }
};

// [GET] /admin/accommodations/:id/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      req.flash('error', 'Không tìm thấy lưu trú');
      return res.redirect('/admin/accommodations');
    }

    res.render('admin/layout', {
      pageTitle: `Chỉnh sửa: ${accommodation.name}`,
      page: 'accommodations',
      body: 'admin/pages/accommodations/edit',
      user: req.user,
      accommodation,
      types: [
        { value: 'hotel', label: 'Khách sạn' },
        { value: 'homestay', label: 'Homestay' },
        { value: 'apartment', label: 'Căn hộ' },
        { value: 'resort', label: 'Resort' },
        { value: 'farmstay', label: 'Farmstay' },
        { value: 'bungalow', label: 'Bungalow' },
        { value: 'villa', label: 'Villa' },
        { value: 'hostel', label: 'Hostel' },
        { value: 'guesthouse', label: 'Nhà nghỉ' },
        { value: 'other', label: 'Khác' }
      ]
    });
  } catch (error) {
    console.error('Edit accommodation error:', error);
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/accommodations');
  }
};

// [PATCH] /admin/accommodations/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      req.flash('error', 'Không tìm thấy lưu trú');
      return res.redirect('back');
    }

    // remove images
    if (data.removeImages) {
      const removeArray = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      const removeIndexes = removeArray.map(i => parseInt(i));
      accommodation.images = (accommodation.images || []).filter((_, idx) => !removeIndexes.includes(idx));
    }

    // add new images
    if (req.files && req.files.length > 0) {
      // Filter main images (fieldname = 'images')
      const mainImages = req.files.filter(f => f.fieldname === 'images');
      if (mainImages.length > 0) {
        const newImages = mainImages.map(file => `/uploads/${file.filename}`);
        accommodation.images = [ ...(accommodation.images || []), ...newImages ];
      }
    }

    // Normalize booleans
    data.isActive = data.isActive === 'on' || data.isActive === true || data.isActive === 'true';
    data.featured = data.featured === 'on' || data.featured === true || data.featured === 'true';

    // Normalize arrays - remove empty values
    const arrayFields = ['highlights', 'amenities', 'services', 'rules', 'tags'];
    arrayFields.forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          data[field] = data[field].filter((item) => item && String(item).trim() !== '');
        } else {
          data[field] = [data[field]].filter((item) => item && String(item).trim() !== '');
        }
      }
    });

    // Normalize numeric values
    if (data.priceFrom) {
      data.priceFrom = parseFloat(data.priceFrom);
    }
    if (data.star) {
      data.star = parseInt(data.star);
    }

    // Normalize map coordinates
    if (data.map && data.map.coordinates && data.map.coordinates.length === 2) {
      data.map.coordinates = data.map.coordinates.map(coord => parseFloat(coord));
    }

    // Remove method-override helper
    if (data._method) delete data._method;

    // build $set payload from data
    const setPayload = {};
    Object.keys(data).forEach((key) => {
      if (key !== 'removeImages' && data[key] !== undefined) setPayload[key] = data[key];
    });
    setPayload.images = accommodation.images;

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

    await Accommodation.updateOne({ _id: id }, updateOps, { runValidators: true });
    req.flash('success', 'Đã cập nhật thành công lưu trú!');
  } catch (error) {
    console.error('Edit accommodation PATCH error:', error);
    req.flash('error', 'Cập nhật thất bại!');
  }
  return res.redirect('back');
};

// [PUT] /admin/accommodations/:id
module.exports.update = async (req, res) => {
  try {
    const data = req.body;
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy lưu trú' });
      }
      req.flash('error', 'Không tìm thấy lưu trú');
      return res.redirect('/admin/accommodations');
    }

    // Validation
    const wantsJson = !!(req.headers.accept && req.headers.accept.includes('application/json'));
    if (!wantsJson) {
      const validationErrors = validateAccommodation(data);
      if (validationErrors.length > 0) {
        req.flash('error', validationErrors.join(', '));
        return res.redirect(`/admin/accommodations/${req.params.id}/edit`);
      }
    }

    // Xử lý xóa images cũ nếu được chọn
    if (data.removeImages) {
      const removeArray = Array.isArray(data.removeImages) ? data.removeImages : [data.removeImages];
      const removeIndexes = removeArray.map(index => parseInt(index));
      accommodation.images = (accommodation.images || []).filter((_, index) => !removeIndexes.includes(index));
    }

    // Xử lý images mới nếu có
    if (req.files && req.files.length > 0) {
      // Filter main images (fieldname = 'images')
      const mainImages = req.files.filter(f => f.fieldname === 'images');
      if (mainImages.length > 0) {
        const newImages = mainImages.map(file => `/uploads/${file.filename}`);
        accommodation.images = [...accommodation.images, ...newImages];
      }
    }

    // Xử lý arrays - loại bỏ empty values
    const arrayFields = ['highlights', 'amenities', 'services', 'rules', 'tags'];
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

    // Xử lý numeric values
    if (data.priceFrom) {
      data.priceFrom = parseFloat(data.priceFrom);
    }
    if (data.star) {
      data.star = parseInt(data.star);
    }

    // Xử lý map coordinates
    if (data.map && data.map.coordinates && data.map.coordinates.length === 2) {
      data.map.coordinates = data.map.coordinates.map(coord => parseFloat(coord));
    }

    // Cập nhật images vào data
    if (!data.images) data.images = accommodation.images;

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

    await Accommodation.updateOne({ _id: req.params.id }, updateOps, { runValidators: true });
    const updated = await Accommodation.findById(req.params.id);

    if (wantsJson) {
      return res.json({ success: true, message: 'Cập nhật lưu trú thành công', data: updated });
    }
    req.flash('success', 'Cập nhật lưu trú thành công');
    return res.redirect('back');
  } catch (error) {
    console.error('Update accommodation error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Tên lưu trú hoặc slug đã tồn tại' });
      }
      req.flash('error', 'Tên lưu trú hoặc slug đã tồn tại');
    } else if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: validationErrors });
      }
      req.flash('error', validationErrors.join(', '));
    } else {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi cập nhật lưu trú', error: error.message });
      }
      req.flash('error', 'Có lỗi xảy ra khi cập nhật lưu trú: ' + error.message);
    }
    
    if (!(req.headers.accept && req.headers.accept.includes('application/json'))){
      return res.redirect(`/admin/accommodations/${req.params.id}/edit`);
    }
  }
};

// [DELETE] /admin/accommodations/:id
module.exports.destroy = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      req.flash('error', 'Không tìm thấy lưu trú');
      return res.redirect('/admin/accommodations');
    }

    await Accommodation.findByIdAndDelete(req.params.id);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, message: 'Xóa lưu trú thành công', data: { id: req.params.id } });
    }
    req.flash('success', 'Xóa lưu trú thành công');
    res.redirect('/admin/accommodations');
  } catch (error) {
    console.error('Delete accommodation error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa lưu trú', error: error.message });
    }
    req.flash('error', 'Có lỗi xảy ra khi xóa lưu trú: ' + error.message);
    res.redirect('/admin/accommodations');
  }
};
