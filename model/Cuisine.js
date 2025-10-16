const mongoose = require('mongoose');

// Place schema represents a specific venue that serves the cuisine
const CuisinePlaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: {
    street: { type: String, trim: true },
    ward: { type: String, trim: true },
    district: { type: String, trim: true },
    city: { type: String, default: 'Hà Nội', trim: true }
  },
  mapLink: { type: String, trim: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  openingHours: { type: String, trim: true },
  priceRange: { type: String, trim: true },
  images: [{ type: String, trim: true }]
});

const CuisineSchema = new mongoose.Schema({
  // Basic info
  name: { type: String, required: true, trim: true, index: true },
  slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  feature: [{ type: String, trim: true }],

  // Places
  places: [CuisinePlaceSchema],

  // Media
  mainImages: [{ type: String, trim: true }],
  gallery: [{ type: String, trim: true }],

  // Meta
  tags: [{ type: String, trim: true }],
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
CuisinePlaceSchema.index({ location: '2dsphere' });
CuisineSchema.index({ name: 'text', description: 'text', tags: 'text' });
CuisineSchema.index({ featured: 1 });

// Auto-generate slug from name
CuisineSchema.pre('save', function(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    let baseSlug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    this.slug = baseSlug || ('cuisine-' + Date.now());
  }
  next();
});

// Virtuals
CuisineSchema.virtual('url').get(function() {
  return `/cuisine/${this.slug}`;
});
CuisineSchema.virtual('mainImage').get(function() {
  return this.mainImages?.[0] || this.gallery?.[0] || null;
});

module.exports = mongoose.model('Cuisine', CuisineSchema);


