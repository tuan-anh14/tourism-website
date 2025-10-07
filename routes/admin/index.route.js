const express = require('express');
const { requireAuth, requireAdmin, requireEditor } = require('../../middleware/auth');

// Import controllers
const authController = require('../../controller/admin/auth.controller');
const attractionController = require('../../controller/admin/attraction.controller');

const router = express.Router();

// Global middleware for all admin routes
router.use((req, res, next) => {
  // Set global variables for all admin routes
  res.locals.admin = true;
  res.locals.currentPath = req.path;
  res.locals.currentMethod = req.method;
  
  // Flash messages middleware
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
    warning: req.flash('warning'),
    info: req.flash('info')
  };
  
  // Log all admin requests
  console.log(`[ADMIN] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  
  next();
});

// Auth routes
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Dashboard
router.get('/dashboard', requireAuth, authController.showDashboard);

// Import upload middleware
const { uploadMultiple } = require('../../middleware/upload');

// Attractions routes (aligned with ProductManagement pattern)
router.get('/attractions', requireAuth, attractionController.index);
router.get('/attractions/create', requireAuth, requireEditor, attractionController.create);
router.post('/attractions', requireAuth, requireEditor, uploadMultiple, attractionController.store);
router.get('/attractions/:id', requireAuth, attractionController.show);
router.get('/attractions/edit/:id', requireAuth, requireEditor, attractionController.edit);
router.patch('/attractions/edit/:id', requireAuth, requireEditor, uploadMultiple, attractionController.editPatch);
router.delete('/attractions/delete/:id', requireAuth, requireEditor, attractionController.destroy);

// TODO: Add more routes for other modules
// Accommodations, Foods, Entertainment, Tours, News, Reviews, Users

module.exports = router;
