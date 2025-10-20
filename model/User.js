const mongoose = require('mongoose');
const md5 = require('md5');
const generate = require('../utils/generate');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  tokenUser: {
    type: String,
    default: function() {
      return generate.generateRandomString(20);
    }
  },
  phone: String,
  avatar: String,
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'editor']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  statusOnline: {
    type: String,
    default: 'offline',
    enum: ['online', 'offline']
  },
  lastLogin: {
    type: Date
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
  return md5(candidatePassword) === this.password;
};

module.exports = mongoose.model('User', userSchema);
