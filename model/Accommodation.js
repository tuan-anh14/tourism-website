const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameEn: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['hotel', 'resort', 'homestay', 'hostel', 'apartment']
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5
  },
  location: {
    address: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  priceRange: {
    from: {
      type: Number,
      required: true
    },
    to: Number,
    currency: {
      type: String,
      default: 'VND'
    }
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: String,
  amenities: [String],
  amenitiesEn: [String],
  services: [String],
  servicesEn: [String],
  nearbyAttractions: [{
    name: String,
    distance: String
  }],
  images: [{
    url: String,
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Accommodation', accommodationSchema);
