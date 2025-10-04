const User = require('../../model/User');

// Hiển thị trang đăng nhập
const showLogin = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/pages/auth/login', {
    pageTitle: 'Đăng nhập Admin',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

// Xử lý đăng nhập
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash('error', 'Vui lòng nhập đầy đủ thông tin');
      return res.redirect('/admin/login');
    }

    const user = await User.findOne({ 
      $or: [{ username }, { email: username }],
      isActive: true 
    });

    if (!user) {
      req.flash('error', 'Tài khoản không tồn tại');
      return res.redirect('/admin/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Mật khẩu không đúng');
      return res.redirect('/admin/login');
    }

    req.session.userId = user._id;
    user.lastLogin = new Date();
    await user.save();

    req.flash('success', 'Đăng nhập thành công');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại');
    res.redirect('/admin/login');
  }
};

// Đăng xuất
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
};

// Hiển thị dashboard
const showDashboard = async (req, res) => {
  try {
    const Attraction = require('../../model/Attraction');
    const Accommodation = require('../../model/Accommodation');
    const Food = require('../../model/Food');
    const Entertainment = require('../../model/Entertainment');
    const Tour = require('../../model/Tour');
    const News = require('../../model/News');
    const Review = require('../../model/Review');

    const stats = {
      attractions: await Attraction.countDocuments(),
      accommodations: await Accommodation.countDocuments(),
      foods: await Food.countDocuments(),
      entertainments: await Entertainment.countDocuments(),
      tours: await Tour.countDocuments(),
      news: await News.countDocuments(),
      reviews: await Review.countDocuments()
    };

    const recentReviews = await Review.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('targetId');

    res.render('admin/layout', {
      pageTitle: 'Dashboard',
      user: req.user,
      stats,
      recentReviews,
      page: 'dashboard'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('admin/pages/dashboard', {
      pageTitle: 'Dashboard',
      user: req.user,
      stats: {},
      recentReviews: []
    });
  }
};

module.exports = {
  showLogin,
  login,
  logout,
  showDashboard
};
