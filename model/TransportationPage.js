const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  icon: String,
  name: String,
  desc: String
}, { _id: false });

const comparisonSchema = new mongoose.Schema({
  label: String,
  icon: String,
  price: String,
  wait: String,
  fit: String
}, { _id: false });

const TransportationPageSchema = new mongoose.Schema({
  // Hero section
  hero: {
    title: { type: String, default: 'Hướng dẫn di chuyển' },
    subtitle: { type: String, default: 'Khám phá Hà Nội một cách dễ dàng và thuận tiện' },
    bannerImage: { type: String, default: '/client/img/header-bg.jfif' }
  },
  // Section titles
  arrivalTitle: { type: String, default: 'Phương tiện đến Hà Nội' },
  arrivalSubtitle: { type: String, default: 'Nhiều lựa chọn di chuyển từ các tỉnh thành đến Thủ đô' },
  localTitle: { type: String, default: 'Phương tiện di chuyển trong Hà Nội' },
  localSubtitle: { type: String, default: 'Đa dạng lựa chọn cho mọi nhu cầu và ngân sách' },
  appsTitle: { type: String, default: 'Ứng dụng hữu ích' },
  appsSubtitle: { type: String, default: 'Tải ngay để di chuyển dễ dàng hơn' },
  compareTitle: { type: String, default: 'Bảng so sánh chi phí' },
  tipsTitle: { type: String, default: 'Mẹo di chuyển thông minh' },

  // Collections
  apps: [appSchema],
  comparisons: [comparisonSchema],
  tips: [{ icon: String, title: String, desc: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TransportationPage', TransportationPageSchema);


