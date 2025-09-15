const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
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
    enum: ['di-tich-lich-su', 'bao-tang', 'lang-nghe', 'pho-co', 'khu-vui-choi', 'le-hoi']
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
    summer: {
      open: String,
      close: String
    },
    winter: {
      open: String,
      close: String
    }
  },
  ticketPrices: {
    adult: Number,
    student: Number,
    elderly: Number,
    child: Number,
    note: String
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: String,
  history: String,
  historyEn: String,
  experiences: [String],
  experiencesEn: [String],
  notes: [String],
  notesEn: [String],
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
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  qrCode: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Attraction', attractionSchema);
