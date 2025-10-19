const mongoose = require('mongoose');

const CuisinePlaceSchema = new mongoose.Schema({
  // Basic info
  name: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  mapLink: { type: String, trim: true },
  
  // Location
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: null } // [lng, lat] - optional
  },
  
  // Business info
  openingHours: { type: String, trim: true },
  priceRange: { type: String, trim: true },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  
  // Media
  images: [{ type: String, trim: true }],
  
  // Cuisine reference
  cuisine: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cuisine', 
    required: true,
    index: true 
  },
  
  // Reviews
  reviews: [{
    author: { type: String, trim: true },
    avatar: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, trim: true },
    verified: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    source: { type: String, default: 'google', trim: true }
  }],
  
  // Meta
  avgRating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft', 'hidden'], default: 'published', index: true },
  isActive: { type: Boolean, default: true, index: true },
  featured: { type: Boolean, default: false, index: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
// Only create 2dsphere index if location coordinates exist
CuisinePlaceSchema.index({ location: '2dsphere' }, { sparse: true });
CuisinePlaceSchema.index({ name: 'text', address: 'text' });
CuisinePlaceSchema.index({ cuisine: 1, status: 1 });
CuisinePlaceSchema.index({ featured: 1, isActive: 1 });

// Auto-update average rating when reviews change
CuisinePlaceSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.avgRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.reviewCount = this.reviews.length;
  } else {
    this.avgRating = 0;
    this.reviewCount = 0;
  }
  next();
});

// Virtuals
CuisinePlaceSchema.virtual('url').get(function() {
  return `/cuisine-place/${this._id}`;
});

CuisinePlaceSchema.virtual('mainImage').get(function() {
  return this.images?.[0] || null;
});

module.exports = mongoose.model('CuisinePlace', CuisinePlaceSchema);
