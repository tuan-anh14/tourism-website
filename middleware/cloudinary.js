const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình storage cho Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tourism-website/reviews', // Thư mục lưu trữ trên Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
      { fetch_format: 'auto' }
    ],
    resource_type: 'image'
  }
});

// Cấu hình multer với Cloudinary storage
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép upload ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ được upload file ảnh!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn 10MB
    files: 5 // Tối đa 5 file
  }
});

// Middleware để upload nhiều ảnh
const uploadMultiple = upload.array('images', 5);

// Middleware để upload một ảnh
const uploadSingle = upload.single('image');

// Middleware để upload với field names động
const uploadDynamic = upload.any();

// Hàm xóa ảnh từ Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Hàm xóa nhiều ảnh từ Cloudinary
const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting multiple images from Cloudinary:', error);
    throw error;
  }
};

// Hàm lấy URL ảnh từ Cloudinary
const getImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, options);
};

module.exports = {
  cloudinary,
  uploadMultiple,
  uploadSingle,
  uploadDynamic,
  upload,
  deleteImage,
  deleteMultipleImages,
  getImageUrl
};
