const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema({
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
    enum: ['den-ha-noi', 'trong-ha-noi']
  },
  type: {
    type: String,
    required: true,
    enum: ['may-bay', 'tau-hoa', 'xe-khach', 'xe-ca-nhan', 'taxi', 'xe-cong-nghe', 'xe-bus', 'tau-dien', 'xe-may', 'xe-dap', 'xich-lo', 'xe-dien-du-lich', 'thue-o-to', 'di-bo', 'xe-bus-2-tang', 'xe-dien-mini']
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: String,
  features: [String],
  featuresEn: [String],
  priceRange: {
    from: Number,
    to: Number,
    currency: {
      type: String,
      default: 'VND'
    },
    note: String
  },
  operatingHours: String,
  operatingHoursEn: String,
  routes: [{
    name: String,
    nameEn: String,
    from: String,
    to: String,
    duration: String,
    frequency: String,
    price: Number
  }],
  contact: {
    phone: String,
    website: String,
    app: String
  },
  images: [{
    url: String,
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  tips: [String],
  tipsEn: [String],
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

module.exports = mongoose.model('Transportation', transportationSchema);
