const Attraction = require('../../model/Attraction');

// Hiển thị danh sách điểm tham quan
const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

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

    const attractions = await Attraction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Attraction.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.render('admin/layout', {
      pageTitle: 'Quản lý Điểm tham quan',
      page: 'attractions',
      user: req.user,
      attractions,
      currentPage: page,
      totalPages,
      search,
      category,
      categories: [
        { value: 'di-tich-lich-su', label: 'Di tích lịch sử' },
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
      categories: [],
      body: 'admin/pages/attractions/index'
    });
  }
};

// Hiển thị form tạo mới
const create = (req, res) => {
  res.render('admin/pages/attractions/create', {
    pageTitle: 'Thêm Điểm tham quan',
    user: req.user,
    categories: [
      { value: 'di-tich-lich-su', label: 'Di tích lịch sử' },
      { value: 'bao-tang', label: 'Bảo tàng' },
      { value: 'lang-nghe', label: 'Làng nghề' },
      { value: 'pho-co', label: 'Phố cổ' },
      { value: 'khu-vui-choi', label: 'Khu vui chơi' },
      { value: 'le-hoi', label: 'Lễ hội' }
    ]
  });
};

// Xử lý tạo mới
const store = async (req, res) => {
  try {
    const data = req.body;
    
    // Xử lý images nếu có
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: data.imageAlts ? data.imageAlts[index] : '',
        isMain: index === 0
      }));
    }

    // Xử lý arrays
    if (data.experiences) {
      data.experiences = Array.isArray(data.experiences) ? data.experiences : [data.experiences];
    }
    if (data.experiencesEn) {
      data.experiencesEn = Array.isArray(data.experiencesEn) ? data.experiencesEn : [data.experiencesEn];
    }
    if (data.notes) {
      data.notes = Array.isArray(data.notes) ? data.notes : [data.notes];
    }
    if (data.notesEn) {
      data.notesEn = Array.isArray(data.notesEn) ? data.notesEn : [data.notesEn];
    }
    if (data.tags) {
      data.tags = Array.isArray(data.tags) ? data.tags : [data.tags];
    }

    const attraction = new Attraction(data);
    await attraction.save();

    req.flash('success', 'Thêm điểm tham quan thành công');
    res.redirect('/admin/attractions');
  } catch (error) {
    console.error('Store attraction error:', error);
    req.flash('error', 'Có lỗi xảy ra khi thêm điểm tham quan');
    res.redirect('/admin/attractions/create');
  }
};

// Hiển thị chi tiết
const show = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) {
      req.flash('error', 'Không tìm thấy điểm tham quan');
      return res.redirect('/admin/attractions');
    }

    res.render('admin/pages/attractions/show', {
      pageTitle: `Chi tiết: ${attraction.name}`,
      user: req.user,
      attraction
    });
  } catch (error) {
    console.error('Show attraction error:', error);
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/attractions');
  }
};

// Hiển thị form chỉnh sửa
const edit = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) {
      req.flash('error', 'Không tìm thấy điểm tham quan');
      return res.redirect('/admin/attractions');
    }

    res.render('admin/pages/attractions/edit', {
      pageTitle: `Chỉnh sửa: ${attraction.name}`,
      user: req.user,
      attraction,
      categories: [
        { value: 'di-tich-lich-su', label: 'Di tích lịch sử' },
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

// Xử lý cập nhật
const update = async (req, res) => {
  try {
    const data = req.body;
    
    // Xử lý images mới nếu có
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: data.imageAlts ? data.imageAlts[index] : '',
        isMain: false
      }));
      
      if (data.images) {
        data.images = [...data.images, ...newImages];
      } else {
        data.images = newImages;
      }
    }

    // Xử lý arrays
    if (data.experiences) {
      data.experiences = Array.isArray(data.experiences) ? data.experiences : [data.experiences];
    }
    if (data.experiencesEn) {
      data.experiencesEn = Array.isArray(data.experiencesEn) ? data.experiencesEn : [data.experiencesEn];
    }
    if (data.notes) {
      data.notes = Array.isArray(data.notes) ? data.notes : [data.notes];
    }
    if (data.notesEn) {
      data.notesEn = Array.isArray(data.notesEn) ? data.notesEn : [data.notesEn];
    }
    if (data.tags) {
      data.tags = Array.isArray(data.tags) ? data.tags : [data.tags];
    }

    await Attraction.findByIdAndUpdate(req.params.id, data);

    req.flash('success', 'Cập nhật điểm tham quan thành công');
    res.redirect('/admin/attractions');
  } catch (error) {
    console.error('Update attraction error:', error);
    req.flash('error', 'Có lỗi xảy ra khi cập nhật điểm tham quan');
    res.redirect(`/admin/attractions/${req.params.id}/edit`);
  }
};

// Xóa
const destroy = async (req, res) => {
  try {
    await Attraction.findByIdAndDelete(req.params.id);
    req.flash('success', 'Xóa điểm tham quan thành công');
    res.redirect('/admin/attractions');
  } catch (error) {
    console.error('Delete attraction error:', error);
    req.flash('error', 'Có lỗi xảy ra khi xóa điểm tham quan');
    res.redirect('/admin/attractions');
  }
};

module.exports = {
  index,
  create,
  store,
  show,
  edit,
  update,
  destroy
};
