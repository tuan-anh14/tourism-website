const User = require("../model/User");

// Client authentication middleware - checks for tokenUser cookie
module.exports.requireAuth = async (req, res, next) => {
  // If this is an admin route, use session-based auth instead
  if (req.originalUrl && req.originalUrl.startsWith('/admin')) {
    return module.exports.requireAdmin(req, res, next);
  }

  if (!req.cookies || !req.cookies.tokenUser) {
    res.redirect(`/auth/login`);
    return;
  }
  
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false,
  });

  if (!user) {
    res.redirect(`/auth/login`);
    return;
  }
  
  res.locals.user = user;
  next();
};

// Admin authentication middleware - checks for session userId
module.exports.requireAdmin = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    req.flash('error', 'Vui lòng đăng nhập để tiếp tục');
    return res.redirect('/admin/login');
  }

  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.session.destroy();
      req.flash('error', 'Phiên đăng nhập không hợp lệ');
      return res.redirect('/admin/login');
    }

    // Store user in request for controllers to use
    req.user = user;
    res.locals.user = user;
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    req.flash('error', 'Có lỗi xảy ra, vui lòng đăng nhập lại');
    return res.redirect('/admin/login');
  }
};

// Editor middleware - same as admin for now, can add role checks later
module.exports.requireEditor = async (req, res, next) => {
  // First check admin authentication
  if (!req.session || !req.session.userId) {
    req.flash('error', 'Vui lòng đăng nhập để tiếp tục');
    return res.redirect('/admin/login');
  }

  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.session.destroy();
      req.flash('error', 'Phiên đăng nhập không hợp lệ');
      return res.redirect('/admin/login');
    }

    // TODO: Add role check here when role system is implemented
    // if (user.role !== 'editor' && user.role !== 'admin') {
    //   req.flash('error', 'Bạn không có quyền truy cập');
    //   return res.redirect('/admin/dashboard');
    // }

    req.user = user;
    res.locals.user = user;
    
    next();
  } catch (error) {
    console.error('Editor auth error:', error);
    req.flash('error', 'Có lỗi xảy ra, vui lòng đăng nhập lại');
    return res.redirect('/admin/login');
  }
};