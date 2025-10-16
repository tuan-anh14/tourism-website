const mongoose = require('mongoose');

const entertainmentSchema = new mongoose.Schema({
  zone: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Khu văn hoá – nghệ thuật',
      'Địa điểm ngoài trời – công viên',
      'Trung tâm thương mại – Khu vui chơi trong nhà',
      'Khu vui chơi giải trí quy mô lớn'
    ]
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200
  },
  openHours: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  ticket: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  activities: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  audience: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  history: {
    type: String,
    default: null,
    maxlength: 1000
  },
  architecture: {
    type: String,
    default: null,
    maxlength: 1000
  },
  experience: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  notes: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  // Align with attractions: images stored as string URLs, normalized in controllers
  images: [{
    type: String,
    trim: true
  }],
  // Optional review widget script (e.g., Google/Shapo) like attractions
  reviewWidgetScript: {
    type: String,
    trim: true,
    default: ''
  },
  map: {
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    },
    embedUrl: {
      type: String,
      required: true
    }
  },
  reviews: [{
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add virtual for average rating
entertainmentSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

// Add virtual for review count
entertainmentSchema.virtual('reviewCount').get(function() {
  return this.reviews.length;
});

// Add indexes for better performance
entertainmentSchema.index({ zone: 1, type: 1 });
entertainmentSchema.index({ isActive: 1, featured: 1 });
entertainmentSchema.index({ name: 'text', address: 'text' });

// Ensure virtual fields are serialized
entertainmentSchema.set('toJSON', { virtuals: true });
entertainmentSchema.set('toObject', { virtuals: true });

// Add pre-save middleware for data validation
entertainmentSchema.pre('save', function(next) {
  // Set default activities if empty
  if (!this.activities || this.activities.length === 0) {
    this.activities = ['Tham quan và khám phá'];
  }
  
  next();
});

module.exports = mongoose.model('Entertainment', entertainmentSchema);
