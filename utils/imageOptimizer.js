const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class ImageOptimizer {
  constructor() {
    this.outputDir = 'public/optimized-images';
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // Tối ưu hóa ảnh banner với chất lượng cao
  async optimizeBanner(inputPath, outputName, options = {}) {
    const defaultOptions = {
      width: 1920,
      height: 1080,
      quality: 95,
      format: 'jpeg',
      progressive: true,
      mozjpeg: true,
      ...options
    };

    try {
      const outputPath = path.join(this.outputDir, outputName);
      
      await sharp(inputPath)
        .resize(defaultOptions.width, defaultOptions.height, {
          fit: 'cover',
          position: 'center',
          kernel: sharp.kernel.lanczos3 // Thuật toán resize tốt nhất
        })
        .jpeg({
          quality: defaultOptions.quality,
          progressive: defaultOptions.progressive,
          mozjpeg: defaultOptions.mozjpeg
        })
        .toFile(outputPath);

      console.log(`✅ Optimized banner: ${outputName}`);
      return `/optimized-images/${outputName}`;
    } catch (error) {
      console.error(`❌ Error optimizing ${inputPath}:`, error);
      return inputPath; // Fallback to original
    }
  }

  // Tối ưu hóa ảnh thường
  async optimizeImage(inputPath, outputName, options = {}) {
    const defaultOptions = {
      width: 800,
      quality: 85,
      format: 'jpeg',
      progressive: true,
      ...options
    };

    try {
      const outputPath = path.join(this.outputDir, outputName);
      
      await sharp(inputPath)
        .resize(defaultOptions.width, null, {
          fit: 'inside',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3
        })
        .jpeg({
          quality: defaultOptions.quality,
          progressive: defaultOptions.progressive
        })
        .toFile(outputPath);

      console.log(`✅ Optimized image: ${outputName}`);
      return `/optimized-images/${outputName}`;
    } catch (error) {
      console.error(`❌ Error optimizing ${inputPath}:`, error);
      return inputPath;
    }
  }

  // Tạo WebP version cho browser hỗ trợ
  async createWebPVersion(inputPath, outputName) {
    try {
      const outputPath = path.join(this.outputDir, outputName.replace(/\.[^/.]+$/, '.webp'));
      
      await sharp(inputPath)
        .webp({
          quality: 90,
          effort: 6
        })
        .toFile(outputPath);

      console.log(`✅ Created WebP: ${outputName}`);
      return `/optimized-images/${outputName.replace(/\.[^/.]+$/, '.webp')}`;
    } catch (error) {
      console.error(`❌ Error creating WebP ${inputPath}:`, error);
      return null;
    }
  }

  // Batch optimize tất cả ảnh trong thư mục
  async batchOptimize(inputDir, options = {}) {
    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    const results = [];
    
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputName = `optimized_${file}`;
      
      const optimizedPath = await this.optimizeImage(inputPath, outputName, options);
      const webpPath = await this.createWebPVersion(inputPath, outputName);
      
      results.push({
        original: file,
        optimized: optimizedPath,
        webp: webpPath
      });
    }

    return results;
  }
}

module.exports = ImageOptimizer;
