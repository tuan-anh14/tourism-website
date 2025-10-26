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
    enum: ['nhan-van', 'tu-nhien'],
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
    type: String,
    trim: true
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
  // Reviews: minimal fields
  reviews: [{
    author: { type: String, trim: true },
    avatar: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    text: { type: String, trim: true },
    verified: { type: Boolean, default: false },
    date: { type: Date },
    source: { type: String, default: 'google', trim: true }
  }],
  map: {
    lat: { type: Number },
    lng: { type: Number },
    link: { type: String }
  },
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

// === STATIC METHODS FOR NEARBY PLACES ===
// Hàm tính khoảng cách giữa 2 điểm địa lý (Haversine formula)
attractionSchema.statics.calculateDistance = function(lat1, lng1, lat2, lng2) {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Tìm quán ăn gần đây
attractionSchema.statics.findNearbyCuisinePlaces = function(attractionId, radius = 5, limit = 10) {
  return this.findById(attractionId).then(attraction => {
    if (!attraction || !attraction.map.lat || !attraction.map.lng) {
      return [];
    }
    
    const CuisinePlace = require('./CuisinePlace');
    return CuisinePlace.find({ 
      isActive: true,
      status: 'published',
      location: { $exists: true },
      'location.coordinates': { $exists: true, $ne: null }
    }).then(places => {
      return places.filter(place => {
        if (!place.location.coordinates || place.location.coordinates.length < 2) return false;
        const [lng, lat] = place.location.coordinates;
        const distance = this.calculateDistance(
          attraction.map.lat, 
          attraction.map.lng, 
          lat, 
          lng
        );
        place.distance = distance;
        return distance <= radius;
      })
      .sort((a, b) => {
        return a.distance - b.distance;
      })
      .slice(0, limit);
    });
  });
};

// Tìm khách sạn gần đây
attractionSchema.statics.findNearbyAccommodations = function(attractionId, radius = 5, limit = 10) {
  return this.findById(attractionId).then(attraction => {
    if (!attraction || !attraction.map.lat || !attraction.map.lng) {
      return [];
    }
    
    const Accommodation = require('./Accommodation');
    return Accommodation.find({ 
      isActive: true,
      status: 'public',
      'map.coordinates': { $exists: true, $ne: [0, 0] }
    }).then(accommodations => {
      return accommodations.filter(accommodation => {
        if (!accommodation.map.coordinates || accommodation.map.coordinates.length < 2) return false;
        const [lng, lat] = accommodation.map.coordinates;
        const distance = this.calculateDistance(
          attraction.map.lat, 
          attraction.map.lng, 
          lat, 
          lng
        );
        accommodation.distance = distance;
        return distance <= radius;
      })
      .sort((a, b) => {
        return a.distance - b.distance;
      })
      .slice(0, limit);
    });
  });
};

// Tìm địa điểm giải trí gần đây
attractionSchema.statics.findNearbyEntertainments = function(attractionId, radius = 5, limit = 10) {
  return this.findById(attractionId).then(attraction => {
    if (!attraction || !attraction.map.lat || !attraction.map.lng) {
      return [];
    }
    
    const Entertainment = require('./Entertainment');
    return Entertainment.find({ 
      isActive: true,
      'map.lat': { $exists: true },
      'map.lng': { $exists: true }
    }).then(entertainments => {
      return entertainments.filter(entertainment => {
        if (!entertainment.map.lat || !entertainment.map.lng) return false;
        const distance = this.calculateDistance(
          attraction.map.lat, 
          attraction.map.lng, 
          entertainment.map.lat, 
          entertainment.map.lng
        );
        entertainment.distance = distance;
        return distance <= radius;
      })
      .sort((a, b) => {
        return a.distance - b.distance;
      })
      .slice(0, limit);
    });
  });
};

// Tìm điểm tham quan gần đây (loại trừ chính nó)
attractionSchema.statics.findNearbyAttractions = function(attractionId, radius = 5, limit = 10) {
  return this.findById(attractionId).then(attraction => {
    if (!attraction || !attraction.map.lat || !attraction.map.lng) {
      return [];
    }
    
    const Attraction = require('./Attraction');
    return Attraction.find({ 
      isActive: true,
      _id: { $ne: attractionId }, // Loại trừ chính nó
      'map.lat': { $exists: true },
      'map.lng': { $exists: true }
    }).then(attractions => {
      return attractions.filter(attr => {
        if (!attr.map.lat || !attr.map.lng) return false;
        const distance = this.calculateDistance(
          attraction.map.lat, 
          attraction.map.lng, 
          attr.map.lat, 
          attr.map.lng
        );
        attr.distance = distance;
        return distance <= radius;
      })
      .sort((a, b) => {
        return a.distance - b.distance;
      })
      .slice(0, limit);
    });
  });
};

module.exports = mongoose.model('Attraction', attractionSchema);
