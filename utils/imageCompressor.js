const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');

class ImageCompressor {
  constructor() {
    this.outputDir = 'public/compressed-images';
  }

  // Nén ảnh với chất lượng cao
  async compressImages(inputDir, outputDir = this.outputDir) {
    try {
      const files = await imagemin([`${inputDir}/*.{jpg,jpeg,png}`], {
        destination: outputDir,
        plugins: [
          // JPEG optimization
          imageminMozjpeg({
            quality: 90,
            progressive: true
          }),
          // PNG optimization
          imageminPngquant({
            quality: [0.8, 0.95],
            speed: 1
          }),
          // Lossless JPEG optimization
          imageminJpegtran({
            progressive: true
          })
        ]
      });

      console.log(`✅ Compressed ${files.length} images`);
      return files;
    } catch (error) {
      console.error('❌ Compression error:', error);
      return [];
    }
  }

  // Tạo WebP versions
  async createWebP(inputDir, outputDir = this.outputDir) {
    try {
      const files = await imagemin([`${inputDir}/*.{jpg,jpeg,png}`], {
        destination: outputDir,
        plugins: [
          imageminWebp({
            quality: 90,
            method: 6
          })
        ]
      });

      console.log(`✅ Created ${files.length} WebP images`);
      return files;
    } catch (error) {
      console.error('❌ WebP creation error:', error);
      return [];
    }
  }
}

module.exports = ImageCompressor;
