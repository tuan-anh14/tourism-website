const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class ImageOptimizationMiddleware {
  constructor() {
    this.cache = new Map();
    this.cacheDir = 'public/cached-images';
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  // Middleware để tối ưu hóa ảnh khi serve
  optimizeImage() {
    return async (req, res, next) => {
      const imagePath = req.path;
      
      // Chỉ xử lý ảnh
      if (!/\.(jpg|jpeg|png|webp)$/i.test(imagePath)) {
        return next();
      }

      try {
        const fullPath = path.join('public', imagePath);
        
        // Kiểm tra file tồn tại
        if (!fs.existsSync(fullPath)) {
          return next();
        }

        // Kiểm tra cache
        const cacheKey = `${imagePath}_${req.query.w || 'original'}_${req.query.q || '85'}`;
        if (this.cache.has(cacheKey)) {
          const cachedPath = this.cache.get(cacheKey);
          if (fs.existsSync(cachedPath)) {
            return res.sendFile(path.resolve(cachedPath));
          }
        }

        // Tối ưu hóa ảnh
        const optimizedPath = await this.processImage(fullPath, req.query);
        
        // Cache kết quả
        this.cache.set(cacheKey, optimizedPath);
        
        res.sendFile(path.resolve(optimizedPath));
      } catch (error) {
        console.error('Image optimization error:', error);
        next();
      }
    };
  }

  async processImage(inputPath, query = {}) {
    const width = parseInt(query.w) || null;
    const height = parseInt(query.h) || null;
    const quality = parseInt(query.q) || 85;
    const format = query.f || 'jpeg';

    const ext = path.extname(inputPath);
    const name = path.basename(inputPath, ext);
    const optimizedName = `${name}_${width || 'auto'}x${height || 'auto'}_q${quality}.${format}`;
    const outputPath = path.join(this.cacheDir, optimizedName);

    // Nếu đã có file tối ưu, return luôn
    if (fs.existsSync(outputPath)) {
      return outputPath;
    }

    let sharpInstance = sharp(inputPath);

    // Resize nếu có width/height
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      });
    }

    // Format và quality
    if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality, effort: 6 });
    } else if (format === 'jpeg' || format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ 
        quality, 
        progressive: true,
        mozjpeg: true 
      });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ 
        quality,
        compressionLevel: 9,
        progressive: true
      });
    }

    await sharpInstance.toFile(outputPath);
    return outputPath;
  }

  // Helper để tạo URL ảnh tối ưu
  getOptimizedImageUrl(originalPath, options = {}) {
    const params = new URLSearchParams();
    
    if (options.width) params.append('w', options.width);
    if (options.height) params.append('h', options.height);
    if (options.quality) params.append('q', options.quality);
    if (options.format) params.append('f', options.format);

    const queryString = params.toString();
    return queryString ? `${originalPath}?${queryString}` : originalPath;
  }
}

module.exports = ImageOptimizationMiddleware;
