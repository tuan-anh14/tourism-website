const mongoose = require('mongoose');

const entertainmentSchema = new mongoose.Schema({
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
    enum: ['van-hoa-nghe-thuat', 'khu-vui-choi', 'spa-massage', 'the-thao', 'shopping', 'nightlife']
  },
  type: {
    type: String,
    required: true,
    enum: ['nha-hat', 'rap-chieu-phim', 'khu-vui-choi', 'spa', 'gym', 'cau-lac-bo', 'bar', 'club', 'trung-tam-thuong-mai', 'cho']
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
  openingHours: {
    weekdays: String,
    weekends: String,
    note: String
  },
  openingHoursEn: {
    weekdays: String,
    weekends: String,
    note: String
  },
  ticketPrices: {
    adult: Number,
    child: Number,
    student: Number,
    note: String
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: String,
  history: String,
  historyEn: String,
  architecture: String,
  architectureEn: String,
  experiences: [String],
  experiencesEn: [String],
  services: [String],
  servicesEn: [String],
  facilities: [String],
  facilitiesEn: [String],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  images: [{
    url: String,
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
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
  notes: [String],
  notesEn: [String],
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

module.exports = mongoose.model('Entertainment', entertainmentSchema);
