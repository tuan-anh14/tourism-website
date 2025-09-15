const User = require('../model/User');

// Middleware để kiểm tra đăng nhập
const requireAuth = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/admin/login');
    }

    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) {
      req.session.destroy();
      return res.redirect('/admin/login');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.redirect('/admin/login');
  }
};

// Middleware để kiểm tra quyền admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).render('admin/pages/errors/403', {
      pageTitle: 'Không có quyền truy cập',
      user: req.user
    });
  }
  next();
};

// Middleware để kiểm tra quyền editor trở lên
const requireEditor = (req, res, next) => {
  if (!['admin', 'editor'].includes(req.user.role)) {
    return res.status(403).render('admin/pages/errors/403', {
      pageTitle: 'Không có quyền truy cập',
      user: req.user
    });
  }
  next();
};

// Middleware để kiểm tra quyền cụ thể
const requirePermission = (module, action) => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }

    const permission = req.user.permissions.find(p => p.module === module);
    if (!permission || !permission.actions.includes(action)) {
      return res.status(403).render('admin/pages/errors/403', {
        pageTitle: 'Không có quyền truy cập',
        user: req.user
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireEditor,
  requirePermission
};
