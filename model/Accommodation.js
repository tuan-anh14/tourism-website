const mongoose = require('mongoose');

// Review Schema for accommodation reviews
const ReviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
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
  images: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

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
  
  // Reviews and Rating
  reviews: [ReviewSchema],
  avgRating: { 
    type: Number, 
    min: 0, 
    max: 5,
    default: 0
  },
  reviewCount: { 
    type: Number, 
    default: 0 
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
  timestamps: true
});

// Index for better query performance
accommodationSchema.index({ name: 'text', description: 'text' });
accommodationSchema.index({ type: 1 });
accommodationSchema.index({ 'address.district': 1 });
accommodationSchema.index({ priceFrom: 1 });
accommodationSchema.index({ status: 1 });
accommodationSchema.index({ isActive: 1 });
accommodationSchema.index({ featured: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);
