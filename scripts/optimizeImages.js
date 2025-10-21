#!/usr/bin/env node

const ImageOptimizer = require('../utils/imageOptimizer');
const ImageCompressor = require('../utils/imageCompressor');
const path = require('path');
const fs = require('fs');

class ImageOptimizationScript {
  constructor() {
    this.optimizer = new ImageOptimizer();
    this.compressor = new ImageCompressor();
  }

  async run() {
    console.log('🚀 Starting image optimization...\n');

    try {
      // 1. Tối ưu hóa ảnh banner
      console.log('📸 Optimizing banner images...');
      await this.optimizeBanners();

      // 2. Tối ưu hóa ảnh thường
      console.log('\n🖼️ Optimizing regular images...');
      await this.optimizeRegularImages();

      // 3. Tạo WebP versions
      console.log('\n🌐 Creating WebP versions...');
      await this.createWebPVersions();

      console.log('\n✅ Image optimization completed!');
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    }
  }

  async optimizeBanners() {
    const bannerDir = 'public/client/img';
    const bannerFiles = [
      'banner-home.jpg',
      'banner-attraction.jpg',
      'banner4.jpg',
      'header-bg.jfif'
    ];

    for (const file of bannerFiles) {
      const inputPath = path.join(bannerDir, file);
      if (fs.existsSync(inputPath)) {
        const outputName = `banner_${file}`;
        await this.optimizer.optimizeBanner(inputPath, outputName, {
          width: 1920,
          height: 1080,
          quality: 95
        });
      }
    }
  }

  async optimizeRegularImages() {
    const imageDir = 'public/client/img';
    const uploadsDir = 'public/uploads';

    // Tối ưu hóa ảnh trong thư mục img
    if (fs.existsSync(imageDir)) {
      await this.optimizer.batchOptimize(imageDir, {
        width: 800,
        quality: 85
      });
    }

    // Tối ưu hóa ảnh upload
    if (fs.existsSync(uploadsDir)) {
      await this.optimizer.batchOptimize(uploadsDir, {
        width: 1200,
        quality: 90
      });
    }
  }

  async createWebPVersions() {
    const imageDir = 'public/client/img';
    const uploadsDir = 'public/uploads';

    if (fs.existsSync(imageDir)) {
      await this.compressor.createWebP(imageDir);
    }

    if (fs.existsSync(uploadsDir)) {
      await this.compressor.createWebP(uploadsDir);
    }
  }
}

// Chạy script
if (require.main === module) {
  const script = new ImageOptimizationScript();
  script.run();
}

module.exports = ImageOptimizationScript;
