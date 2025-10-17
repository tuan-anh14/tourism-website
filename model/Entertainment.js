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

// Add indexes for better performance
entertainmentSchema.index({ zone: 1, type: 1 });
entertainmentSchema.index({ isActive: 1, featured: 1 });
entertainmentSchema.index({ name: 'text', address: 'text' });

// Ensure virtual fields are serialized
entertainmentSchema.set('toJSON', { virtuals: true });
entertainmentSchema.set('toObject', { virtuals: true });

// No pre-save hooks required at the moment

module.exports = mongoose.model('Entertainment', entertainmentSchema);
