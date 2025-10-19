const Contact = require('../../model/Contact');

// [POST] /contact - Xử lý form liên hệ
module.exports.submit = async (req, res) => {
    try {
        const { name, email, country, remarks } = req.body;
        
        // Map remarks to message for consistency
        const message = remarks;
        
        // Validation
        if (!name || !email || !country || !remarks) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }
        
        // Tạo liên hệ mới - chỉ lưu 4 thông tin cơ bản
        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            country: country.trim(),
            message: message.trim()
        });
        
        await contact.save();
        
        // Trả về response thành công
        res.json({
            success: true,
            message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email
            }
        });
        
    } catch (error) {
        console.error('Contact submission error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại sau.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
