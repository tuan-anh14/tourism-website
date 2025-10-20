const express = require('express');
const route = express.Router();
const reviewController = require('../../controller/client/review.controller');
const authMiddleware = require('../../middleware/auth');
const { upload } = require('../../middleware/upload');

// =================================================================
// PUBLIC ROUTES - Không cần đăng nhập
// =================================================================

// Lấy danh sách reviews cho một target
route.get('/:targetType/:targetId', reviewController.getReviews);

// =================================================================
// PROTECTED ROUTES - Cần đăng nhập
// =================================================================

// Tạo review mới (có upload ảnh)
route.post(
  '/:targetType/:targetId',
  authMiddleware.requireAuth,
  (req, res, next) => {
    console.log('Before multer - Content-Type:', req.headers['content-type']);
    next();
  },
  upload.array('images', 5), // Cho phép upload tối đa 5 ảnh
  (req, res, next) => {
    console.log('After multer - Body:', req.body);
    console.log('After multer - Files:', req.files);
    next();
  },
  reviewController.createReview
);

// Đánh dấu review hữu ích
route.post('/:reviewId/helpful', reviewController.markHelpful);

// Cập nhật review
route.put(
  '/:reviewId',
  authMiddleware.requireAuth,
  upload.array('images', 5),
  reviewController.updateReview
);

// Xóa review
route.delete('/:reviewId', authMiddleware.requireAuth, reviewController.deleteReview);

module.exports = route;

