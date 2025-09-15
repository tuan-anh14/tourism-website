const express = require('express');
const { requireAuth, requireAdmin, requireEditor } = require('../../middleware/auth');

// Import controllers
const authController = require('../../controller/admin/auth.controller');
const attractionController = require('../../controller/admin/attraction.controller');

const router = express.Router();

// Flash messages middleware
router.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
    warning: req.flash('warning'),
    info: req.flash('info')
  };
  next();
});

// Auth routes
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Dashboard
router.get('/dashboard', requireAuth, authController.showDashboard);

// Attractions routes
router.get('/attractions', requireAuth, attractionController.index);
router.get('/attractions/create', requireAuth, requireEditor, attractionController.create);
router.post('/attractions', requireAuth, requireEditor, attractionController.store);
router.get('/attractions/:id', requireAuth, attractionController.show);
router.get('/attractions/:id/edit', requireAuth, requireEditor, attractionController.edit);
router.put('/attractions/:id', requireAuth, requireEditor, attractionController.update);
router.delete('/attractions/:id', requireAuth, requireEditor, attractionController.destroy);

// TODO: Add more routes for other modules
// Accommodations, Foods, Entertainment, Tours, News, Reviews, Users

module.exports = router;
