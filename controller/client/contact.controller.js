const Contact = require('../../model/Contact');

// [POST] /contact - Xử lý form liên hệ
module.exports.submit = async (req, res) => {
    try {
        const { name, email, country, remarks } = req.body;
        
        // Map remarks to message for consistency
        const message = remarks;
        
        // Validation
        if (!name || !email || !country || !remarks) {
            req.flash('error', 'Vui lòng điền đầy đủ thông tin');
            return res.redirect(req.get('Referer') || '/');
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error', 'Email không hợp lệ');
            return res.redirect(req.get('Referer') || '/');
        }
        
        // Tạo liên hệ mới - chỉ lưu 4 thông tin cơ bản
        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            country: country.trim(),
            message: message.trim()
        });
        
        await contact.save();
        
        // Sử dụng flash message và redirect
        req.flash('success', 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        res.redirect(req.get('Referer') || '/');
        
    } catch (error) {
        console.error('Contact submission error:', error);
        
        req.flash('error', 'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại sau.');
        res.redirect(req.get('Referer') || '/');
    }
};
