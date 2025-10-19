const Contact = require('../../model/Contact');

// [GET] /admin/contacts - Danh sách liên hệ
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    
    const filters = { search, status };
    
    // Lấy dữ liệu với phân trang
    const contacts = await Contact.getPaginated(page, limit, filters);
    const total = await Contact.getCount(filters);
    const totalPages = Math.ceil(total / limit);
    
    // Lấy thống kê
    const stats = await Contact.getStats();
    
    // Chuyển đổi stats thành object dễ sử dụng
    const statsObj = {
      new: 0,
      read: 0,
      replied: 0,
      total: total
    };
    
    stats.forEach(stat => {
      statsObj[stat._id] = stat.count;
    });
    
    // Check if request wants JSON (API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: {
          contacts,
          pagination: {
            currentPage: page,
            totalPages,
            total,
            limit
          },
          filters: { search, status },
          stats: statsObj
        }
      });
    }
    
    res.render('admin/layout', {
      pageTitle: 'Quản lý Liên hệ',
      page: 'contacts',
      user: req.user,
      contacts,
      currentPage: page,
      totalPages,
      total,
      search,
      status,
      stats: statsObj,
      req: req,
      body: 'admin/pages/contacts/index'
    });
    
  } catch (error) {
    console.error('Contacts index error:', error);
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
    
    req.flash('error', 'Có lỗi xảy ra khi tải danh sách liên hệ');
    res.render('admin/layout', {
      pageTitle: 'Quản lý Liên hệ',
      page: 'contacts',
      user: req.user,
      contacts: [],
      currentPage: 1,
      totalPages: 0,
      total: 0,
      search: '',
      status: '',
      stats: { new: 0, read: 0, replied: 0, total: 0 },
      req: req,
      body: 'admin/pages/contacts/index'
    });
  }
};

// [GET] /admin/contacts/:id - Chi tiết liên hệ
module.exports.show = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy liên hệ'
        });
      }
      req.flash('error', 'Không tìm thấy liên hệ');
      return res.redirect('/admin/contacts');
    }
    
    // Đánh dấu đã đọc nếu chưa đọc
    if (contact.status === 'new') {
      await contact.markAsRead();
    }
    
    // Check if request wants JSON (API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: contact
      });
    }
    
    res.render('admin/layout', {
      pageTitle: `Chi tiết liên hệ: ${contact.name}`,
      page: 'contacts',
      user: req.user,
      contact,
      req: req,
      body: 'admin/pages/contacts/show'
    });
    
  } catch (error) {
    console.error('Show contact error:', error);
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
    
    req.flash('error', 'Có lỗi xảy ra');
    res.redirect('/admin/contacts');
  }
};

// [DELETE] /admin/contacts/:id - Xóa liên hệ
module.exports.delete = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy liên hệ'
        });
      }
      req.flash('error', 'Không tìm thấy liên hệ');
      return res.redirect('/admin/contacts');
    }
    
    await Contact.findByIdAndDelete(req.params.id);
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        message: 'Xóa liên hệ thành công'
      });
    }
    
    req.flash('success', 'Xóa liên hệ thành công');
    res.redirect('/admin/contacts');
    
  } catch (error) {
    console.error('Delete contact error:', error);
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
    
    req.flash('error', 'Có lỗi xảy ra khi xóa liên hệ');
    res.redirect('/admin/contacts');
  }
};

// [PATCH] /admin/contacts/:id/mark-read - Đánh dấu đã đọc
module.exports.markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy liên hệ'
        });
      }
      req.flash('error', 'Không tìm thấy liên hệ');
      return res.redirect('/admin/contacts');
    }
    
    await contact.markAsRead();
    
    // Always return JSON for AJAX requests
    return res.json({
      success: true,
      message: 'Đánh dấu đã đọc thành công'
    });
    
  } catch (error) {
    console.error('Mark as read error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// [PATCH] /admin/contacts/:id/mark-replied - Đánh dấu đã trả lời
module.exports.markAsReplied = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy liên hệ'
        });
      }
      req.flash('error', 'Không tìm thấy liên hệ');
      return res.redirect('/admin/contacts');
    }
    
    await contact.markAsReplied();
    
    // Always return JSON for AJAX requests
    return res.json({
      success: true,
      message: 'Đánh dấu đã trả lời thành công'
    });
    
  } catch (error) {
    console.error('Mark as replied error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
