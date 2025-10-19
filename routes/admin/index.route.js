const express = require('express');
const { requireAuth, requireAdmin, requireEditor } = require('../../middleware/auth');

// Import controllers
const authController = require('../../controller/admin/auth.controller');
const attractionController = require('../../controller/admin/attraction.controller');
const accommodationController = require('../../controller/admin/accommodation.controller');
const cuisineController = require('../../controller/admin/cuisine.controller');
const cuisinePlaceController = require('../../controller/admin/cuisine-place.controller');
const entertainmentController = require('../../controller/admin/entertainment.controller');
const contactController = require('../../controller/admin/contact.controller');

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
const { uploadMultiple, uploadDynamic } = require('../../middleware/upload');

// Attractions routes (aligned with ProductManagement pattern)
router.get('/attractions', requireAuth, attractionController.index);
router.get('/attractions/create', requireAuth, requireEditor, attractionController.create);
router.post('/attractions', requireAuth, requireEditor, uploadDynamic, attractionController.store);
router.get('/attractions/:id', requireAuth, attractionController.show);
router.get('/attractions/edit/:id', requireAuth, requireEditor, attractionController.edit);
router.patch('/attractions/edit/:id', requireAuth, requireEditor, uploadDynamic, attractionController.editPatch);
// Accept both DELETE (via method-override) and direct POST for compatibility
router.delete('/attractions/delete/:id', requireAuth, requireEditor, attractionController.destroy);
router.post('/attractions/delete/:id', requireAuth, requireEditor, attractionController.destroy);

// Accommodations routes (aligned with ProductManagement pattern)
router.get('/accommodations', requireAuth, accommodationController.index);
router.get('/accommodations/create', requireAuth, requireEditor, accommodationController.create);
router.post('/accommodations', requireAuth, requireEditor, uploadDynamic, accommodationController.store);
router.get('/accommodations/:id', requireAuth, accommodationController.show);
router.get('/accommodations/edit/:id', requireAuth, requireEditor, accommodationController.edit);
router.patch('/accommodations/edit/:id', requireAuth, requireEditor, uploadDynamic, accommodationController.editPatch);
// Accept both DELETE (via method-override) and direct POST for compatibility
router.delete('/accommodations/delete/:id', requireAuth, requireEditor, accommodationController.destroy);
router.post('/accommodations/delete/:id', requireAuth, requireEditor, accommodationController.destroy);

// Cuisines routes
router.get('/cuisines', requireAuth, cuisineController.index);
router.get('/cuisines/create', requireAuth, requireEditor, cuisineController.create);
router.post('/cuisines', requireAuth, requireEditor, uploadDynamic, cuisineController.store);
router.get('/cuisines/:id', requireAuth, cuisineController.show);
router.get('/cuisines/edit/:id', requireAuth, requireEditor, cuisineController.edit);
router.patch('/cuisines/edit/:id', requireAuth, requireEditor, uploadDynamic, cuisineController.editPatch);
router.delete('/cuisines/delete/:id', requireAuth, requireEditor, cuisineController.destroy);
router.post('/cuisines/delete/:id', requireAuth, requireEditor, cuisineController.destroy);

// Cuisine Places routes
router.get('/cuisine-places', requireAuth, cuisinePlaceController.index);
router.get('/cuisine-places/create', requireAuth, requireEditor, cuisinePlaceController.create);
router.post('/cuisine-places', requireAuth, requireEditor, uploadDynamic, cuisinePlaceController.store);
router.get('/cuisine-places/:id', requireAuth, cuisinePlaceController.show);
router.get('/cuisine-places/edit/:id', requireAuth, requireEditor, cuisinePlaceController.edit);
router.patch('/cuisine-places/edit/:id', requireAuth, requireEditor, uploadDynamic, cuisinePlaceController.editPatch);
router.put('/cuisine-places/:id', requireAuth, requireEditor, uploadDynamic, cuisinePlaceController.update);
router.delete('/cuisine-places/delete/:id', requireAuth, requireEditor, cuisinePlaceController.destroy);
router.post('/cuisine-places/delete/:id', requireAuth, requireEditor, cuisinePlaceController.destroy);

// Entertainment routes
router.get('/entertainments', requireAuth, entertainmentController.index);
router.get('/entertainments/create', requireAuth, requireEditor, entertainmentController.create);
router.post('/entertainments', requireAuth, requireEditor, uploadDynamic, entertainmentController.store);
router.get('/entertainments/edit/:id', requireAuth, requireEditor, entertainmentController.edit);
router.get('/entertainments/:id', requireAuth, entertainmentController.show);
router.put('/entertainments/:id', requireAuth, requireEditor, uploadDynamic, entertainmentController.update);
router.patch('/entertainments/:id', requireAuth, requireEditor, uploadDynamic, entertainmentController.update);
router.post('/entertainments/:id', requireAuth, requireEditor, uploadDynamic, entertainmentController.update);
router.post('/entertainments/:id/toggle-active', requireAuth, requireEditor, entertainmentController.toggleActive);
router.post('/entertainments/:id/toggle-featured', requireAuth, requireEditor, entertainmentController.toggleFeatured);
router.delete('/entertainments/:id', requireAuth, requireEditor, entertainmentController.destroy);
router.post('/entertainments/delete/:id', requireAuth, requireEditor, entertainmentController.destroy);

// Contact routes (read and delete only)
router.get('/contacts', requireAuth, contactController.index);
router.get('/contacts/:id', requireAuth, contactController.show);
router.delete('/contacts/:id', requireAuth, contactController.delete);
router.post('/contacts/delete/:id', requireAuth, contactController.delete);
router.patch('/contacts/:id/mark-read', requireAuth, contactController.markAsRead);
router.patch('/contacts/:id/mark-replied', requireAuth, contactController.markAsReplied);

// TODO: Add more routes for other modules
// Foods, Tours, News, Reviews, Users

module.exports = router;
