const express = require('express');
const { requireAuth, requireAdmin, requireEditor } = require('../../middleware/auth');

// Import controllers
const authController = require('../../controller/admin/auth.controller');
const attractionController = require('../../controller/admin/attraction.controller');
const accommodationController = require('../../controller/admin/accommodation.controller');
const cuisineController = require('../../controller/admin/cuisine.controller');

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
// Accept both DELETE (via method-override) and direct POST for compatibility
router.delete('/attractions/delete/:id', requireAuth, requireEditor, attractionController.destroy);
router.post('/attractions/delete/:id', requireAuth, requireEditor, attractionController.destroy);

// Accommodations routes (aligned with ProductManagement pattern)
router.get('/accommodations', requireAuth, accommodationController.index);
router.get('/accommodations/create', requireAuth, requireEditor, accommodationController.create);
router.post('/accommodations', requireAuth, requireEditor, uploadMultiple, accommodationController.store);
router.get('/accommodations/:id', requireAuth, accommodationController.show);
router.get('/accommodations/edit/:id', requireAuth, requireEditor, accommodationController.edit);
router.patch('/accommodations/edit/:id', requireAuth, requireEditor, uploadMultiple, accommodationController.editPatch);
// Accept both DELETE (via method-override) and direct POST for compatibility
router.delete('/accommodations/delete/:id', requireAuth, requireEditor, accommodationController.destroy);
router.post('/accommodations/delete/:id', requireAuth, requireEditor, accommodationController.destroy);

// Cuisines routes
router.get('/cuisines', requireAuth, cuisineController.index);
router.get('/cuisines/create', requireAuth, requireEditor, cuisineController.create);
router.post('/cuisines', requireAuth, requireEditor, uploadMultiple, cuisineController.store);
router.get('/cuisines/:id', requireAuth, cuisineController.show);
router.get('/cuisines/edit/:id', requireAuth, requireEditor, cuisineController.edit);
router.patch('/cuisines/edit/:id', requireAuth, requireEditor, uploadMultiple, cuisineController.editPatch);
router.delete('/cuisines/delete/:id', requireAuth, requireEditor, cuisineController.destroy);
router.post('/cuisines/delete/:id', requireAuth, requireEditor, cuisineController.destroy);

// TODO: Add more routes for other modules
// Foods, Entertainment, Tours, News, Reviews, Users

module.exports = router;
