const Contact = require('../../model/Contact');
const { sendMail } = require('../../utils/sendMail');

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

// [POST] /admin/contacts/:id/reply - Gửi email trả lời
module.exports.reply = async (req, res) => {
  try {
    console.log('📧 Reply email request received:', {
      method: req.method,
      url: req.url,
      params: req.params,
      body: req.body
    });
    
    const { subject, message } = req.body;
    const contactId = req.params.id;
    
    // Validation
    if (!subject || !message) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ tiêu đề và nội dung'
        });
      }
      req.flash('error', 'Vui lòng điền đầy đủ tiêu đề và nội dung');
      return res.redirect(`/admin/contacts/${contactId}`);
    }
    
    // Tìm contact
    const contact = await Contact.findById(contactId);
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
    
    // Tạo nội dung email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin: 0 0 10px 0;">Hà Nội Vibes</h2>
          <p style="color: #6c757d; margin: 0;">Cảm ơn bạn đã liên hệ với chúng tôi!</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
          <h3 style="color: #2c3e50; margin: 0 0 15px 0;">${subject}</h3>
          <div style="color: #495057; line-height: 1.6; white-space: pre-wrap;">${message}</div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 6px; font-size: 14px; color: #6c757d;">
          <p style="margin: 0 0 10px 0;"><strong>Thông tin liên hệ gốc:</strong></p>
          <p style="margin: 0 0 5px 0;"><strong>Tên:</strong> ${contact.name}</p>
          <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${contact.email}</p>
          <p style="margin: 0 0 5px 0;"><strong>Quốc gia:</strong> ${contact.country}</p>
          <p style="margin: 0;"><strong>Ngày gửi:</strong> ${new Date(contact.createdAt).toLocaleString('vi-VN')}</p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #6c757d; font-size: 12px;">
          <p>Email này được gửi từ hệ thống quản lý liên hệ của Hà Nội Vibes</p>
          <p>Vui lòng không trả lời trực tiếp email này.</p>
        </div>
      </div>
    `;
    
    // Gửi email với error handling
    try {
      console.log('📧 Attempting to send reply email...');
      sendMail(contact.email, `Re: ${subject}`, emailHtml);
      console.log('✅ Email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      throw new Error(`Không thể gửi email: ${emailError.message}`);
    }
    
    // Đánh dấu đã trả lời
    await contact.markAsReplied();
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        message: 'Email trả lời đã được gửi thành công'
      });
    }
    
    req.flash('success', 'Email trả lời đã được gửi thành công');
    res.redirect(`/admin/contacts/${contactId}`);
    
  } catch (error) {
    console.error('Reply email error:', error);
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi gửi email',
        error: error.message
      });
    }
    
    req.flash('error', 'Có lỗi xảy ra khi gửi email trả lời');
    res.redirect(`/admin/contacts/${req.params.id}`);
  }
};
