/**
 * Image optimization script
 * 
 * This script finds all images in the src/assets/images directory and:
 * 1. Creates optimized versions in different formats (webp, jpg/png)
 * 2. Generates responsive sizes for different screen sizes
 * 3. Places the optimized images in the public/images/optimized directory
 * 
 * Run with: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const { glob } = require('glob');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = path.join(__dirname, '../src/assets/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');
const SIZES = [
  { width: 1200, suffix: '-large' },
  { width: 800, suffix: '-medium' },
  { width: 400, suffix: '-small' }
];
const FORMATS = ['webp', 'original'];
const QUALITY = {
  webp: 80,
  jpeg: 80,
  png: 80
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process a single image
async function processImage(imagePath) {
  try {
    const filename = path.basename(imagePath);
    const ext = path.extname(filename).toLowerCase();
    const name = path.basename(filename, ext);
    
    console.log(`Processing: ${filename}`);
    
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    
    // Process each size
    for (const size of SIZES) {
      // Skip if image is smaller than target size
      if (metadata.width <= size.width) continue;
      
      // Create sized variations in each format
      for (const format of FORMATS) {
        const outputName = format === 'original' 
          ? `${name}${size.suffix}${ext}`
          : `${name}${size.suffix}.${format}`;
        
        const outputPath = path.join(OUTPUT_DIR, outputName);
        
        let pipeline = sharp(imagePath).resize({ width: size.width, 
withoutEnlargement: true });
        
        if (format === 'webp') {
          await pipeline.webp({ quality: QUALITY.webp 
}).toFile(outputPath);
        } else {
          // Maintain original format
          if (ext === '.jpg' || ext === '.jpeg') {
            await pipeline.jpeg({ quality: QUALITY.jpeg 
}).toFile(outputPath);
          } else if (ext === '.png') {
            await pipeline.png({ quality: QUALITY.png 
}).toFile(outputPath);
          } else {
            await pipeline.toFile(outputPath);
          }
        }
      }
    }
    
    // Also create regular versions without size suffix
    for (const format of FORMATS) {
      const outputName = format === 'original' 
        ? filename
        : `${name}.${format}`;
      
      const outputPath = path.join(OUTPUT_DIR, outputName);
      
      let pipeline = sharp(imagePath);
      
      if (format === 'webp') {
        await pipeline.webp({ quality: QUALITY.webp }).toFile(outputPath);
      } else {
        // Maintain original format
        if (ext === '.jpg' || ext === '.jpeg') {
          await pipeline.jpeg({ quality: QUALITY.jpeg 
}).toFile(outputPath);
        } else if (ext === '.png') {
          await pipeline.png({ quality: QUALITY.png }).toFile(outputPath);
        } else {
          await pipeline.toFile(outputPath);
        }
      }
    }
    
    console.log(`✅ Optimized: ${filename}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${imagePath}:`, error);
  }
}

// Main function
async function main() {
  try {
    console.log('Starting image optimization...');
    
    // Find all images
    const images = await glob(`${INPUT_DIR}/**/*.{jpg,jpeg,png}`);
    
    if (images.length === 0) {
      console.log('No images found.');
      return;
    }
    
    console.log(`Found ${images.length} images to optimize`);
    
    // Process each image
    for (const imagePath of images) {
      await processImage(imagePath);
    }
    
    console.log('Image optimization complete! 🎉');
  } catch (error) {
    console.error('Error in optimization process:', error);
  }
}

// Run the script
main();
