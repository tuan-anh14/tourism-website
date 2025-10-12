const mongoose = require('mongoose');

const entertainmentSchema = new mongoose.Schema({
  zone: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  openHours: {
    type: String,
    required: true
  },
  ticket: {
    type: String,
    required: true
  },
  activities: [{
    type: String,
    trim: true
  }],
  audience: [{
    type: String,
    trim: true
  }],
  history: {
    type: String,
    default: null
  },
  architecture: {
    type: String,
    default: null
  },
  experience: [{
    type: String,
    trim: true
  }],
  notes: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  map: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
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
      trim: true
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
      trim: true
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

// Ensure virtual fields are serialized
entertainmentSchema.set('toJSON', { virtuals: true });
entertainmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Entertainment', entertainmentSchema);
