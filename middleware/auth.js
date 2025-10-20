const User = require("../model/User");

// Optional auth middleware - sets user in res.locals if logged in, but doesn't require login
module.exports.optionalAuth = async (req, res, next) => {
  try {
    if (req.cookies && req.cookies.tokenUser) {
      const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
      });
      
      if (user) {
        res.locals.user = user;
      }
    }
  } catch (error) {
    console.error('Optional auth error:', error);
  }
  next();
};

// Client authentication middleware - checks for tokenUser cookie
module.exports.requireAuth = async (req, res, next) => {
  // If this is an admin route, use session-based auth instead
  if (req.originalUrl && req.originalUrl.startsWith('/admin')) {
    return module.exports.requireAdmin(req, res, next);
  }

  // Check if this is an API request
  const isApiRequest = req.originalUrl && req.originalUrl.startsWith('/api/');

  if (!req.cookies || !req.cookies.tokenUser) {
    if (isApiRequest) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục'
      });
    }
    res.redirect(`/auth/login`);
    return;
  }
  
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false,
  });

  if (!user) {
    if (isApiRequest) {
      return res.status(401).json({
        success: false,
        message: 'Phiên đăng nhập không hợp lệ'
      });
    }
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