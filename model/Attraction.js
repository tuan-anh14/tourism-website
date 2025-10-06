const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  // === THÔNG TIN CƠ BẢN ===
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['van-hoa', 'lich-su', 'tu-nhien', 'ton-giao', 'bao-tang', 'lang-nghe', 'pho-co', 'khu-vui-choi', 'le-hoi'],
    index: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  opening_hours: {
    type: String,
    trim: true
  },
  ticket_info: {
    normal: { type: Number },
    student: { type: Number },
    child: { type: Number },
    senior: { type: Number }
  },
  intro: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  highlights: [{
    type: String,
    trim: true
  }],
  visitor_notes: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  map: {
    lat: { type: Number },
    lng: { type: Number },
    link: { type: String }
  },
  reviews: [{
    user: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === VIRTUAL FIELDS ===
// Tạo slug tự động từ name
attractionSchema.pre('save', function(next) {
  // Chỉ tạo slug nếu có name và chưa có slug
  if (this.name && (!this.slug || this.isModified('name'))) {
    let baseSlug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/[^a-z0-9\s-]/g, '') // Chỉ giữ chữ, số, khoảng trắng, dấu gạch
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch
      .replace(/-+/g, '-') // Loại bỏ dấu gạch trùng lặp
      .trim('-'); // Loại bỏ dấu gạch đầu/cuối
    
    this.slug = baseSlug;
    
    // Nếu slug trống, tạo slug từ timestamp
    if (!this.slug) {
      this.slug = 'attraction-' + Date.now();
    }
  }
  // Nếu không có name, không tạo slug (để tránh null)
  next();
});

// Virtual: URL đầy đủ
attractionSchema.virtual('url').get(function() {
  return `/attraction/${this.slug}`;
});

// Virtual: Hình ảnh chính
attractionSchema.virtual('mainImage').get(function() {
  return this.images?.[0] || null;
});

// Virtual: Đánh giá trung bình
attractionSchema.virtual('averageRating').get(function() {
  if (this.reviews?.length === 0) return 0;
  const sum = this.reviews?.reduce((acc, review) => acc + review.rating, 0) || 0;
  return (sum / this.reviews?.length).toFixed(1);
});

// === INSTANCE METHODS ===
// Cập nhật đánh giá
attractionSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  return this.save();
};

// === STATIC METHODS ===
// Tìm kiếm theo từ khóa
attractionSchema.statics.search = function(query, options = {}) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ],
    isActive: true
  };

  return this.find(searchQuery)
    .sort(options.sort || { featured: -1, createdAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

// Lấy điểm nổi bật
attractionSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ 
    featured: true, 
    isActive: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Lấy theo danh mục
attractionSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    category, 
    isActive: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Attraction', attractionSchema);
