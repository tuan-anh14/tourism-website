const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    unique: true,
    trim: true
  },
  type: { 
    type: String, 
    enum: [
      'hotel', 'homestay', 'apartment', 'resort', 
      'farmstay', 'bungalow', 'villa', 'hostel', 
      'guesthouse', 'other'
    ], 
    required: true 
  },
  star: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  
  // Location Information
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    city: { 
      type: String, 
      default: 'Hà Nội',
      trim: true
    }
  },
  
  // Pricing
  priceFrom: { 
    type: Number,
    required: true,
    min: 0
  },
  
  // Content
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  highlights: [String],
  amenities: [String],
  services: [String],
  rules: [String],
  
  // Media
  images: [String],
  videos: [String],
  website: {
    type: String,
    trim: true
  },
  
  // Map Information
  map: {
    type: { 
      type: String, 
      enum: ['Point'], 
      default: 'Point' 
    },
    coordinates: { 
      type: [Number], 
      default: [0, 0] 
    },
    mapEmbed: {
      type: String,
      trim: true
    },
    locationText: {
      type: String,
      trim: true
    }
  },
  
  // Status and Metadata
  status: { 
    type: String, 
    enum: ['public', 'draft', 'hidden'], 
    default: 'public' 
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Contact Information
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === PRE-SAVE MIDDLEWARE ===
// Auto-generate slug from name
accommodationSchema.pre('save', function(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    let baseSlug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Keep only letters, numbers, spaces, dashes
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Remove duplicate dashes
      .trim('-'); // Remove leading/trailing dashes
    
    this.slug = baseSlug;
    
    // If slug is empty, create slug from timestamp
    if (!this.slug) {
      this.slug = 'accommodation-' + Date.now();
    }
  }
  next();
});

// === VIRTUAL FIELDS ===
// Full URL
accommodationSchema.virtual('url').get(function() {
  return `/accommodation/${this.slug}`;
});

// Main image
accommodationSchema.virtual('mainImage').get(function() {
  return this.images?.[0] || null;
});

// === STATIC METHODS ===
// Search by keyword
accommodationSchema.statics.search = function(query, options = {}) {
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

// Get featured accommodations
accommodationSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ 
    featured: true, 
    isActive: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Get by type
accommodationSchema.statics.getByType = function(type, limit = 10) {
  return this.find({ 
    type, 
    isActive: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Get by district
accommodationSchema.statics.getByDistrict = function(district, limit = 10) {
  return this.find({ 
    'address.district': district, 
    isActive: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// === INDEXES ===
accommodationSchema.index({ name: 'text', description: 'text' });
accommodationSchema.index({ type: 1 });
accommodationSchema.index({ 'address.district': 1 });
accommodationSchema.index({ priceFrom: 1 });
accommodationSchema.index({ status: 1 });
accommodationSchema.index({ isActive: 1 });
accommodationSchema.index({ featured: 1 });
accommodationSchema.index({ slug: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);
