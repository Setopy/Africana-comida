import React from 'react';
import { DEFAULT_IMAGE } from '../../config/constants';

/**
 * OptimizedImage component for better image loading and WebP support
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - CSS classes
 * @param {number|string} props.width - Image width
 * @param {number|string} props.height - Image height
 * @param {string} props.objectFit - CSS object-fit property
 * @param {boolean} props.blur - Whether to apply blur-up loading effect
 * @returns {JSX.Element} - OptimizedImage component
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  objectFit = 'cover',
  blur = true,
  ...rest
}) => {
  // Use default image if src is not provided
  const imageSrc = src || DEFAULT_IMAGE;
  
  // State for image loading
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Handle placeholder images directly
  if (imageSrc.includes('placeholder.com')) {
    return (
      <img 
        src={imageSrc} 
        alt={alt || 'Placeholder image'} 
        className={className}
        width={width} 
        height={height}
        style={{ objectFit }}
        {...rest}
      />
    );
  }
  
  // Path transformations for optimized images
  const getOptimizedPath = (imagePath) => {
    // If image path is already an absolute URL, return it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Extract just the filename from the path
    const filename = imagePath.split('/').pop();
    return `/images/optimized/${filename}`;
  };
  
  const optimizedSrc = getOptimizedPath(imageSrc);
  const webpSrc = `${optimizedSrc}.webp`;
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {blur && isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
          aria-hidden="true"
        />
      )}
      
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <source srcSet={optimizedSrc} type={imageSrc.match(/\.png$/i) ? 'image/png' : 'image/jpeg'} />
        <img 
          src={optimizedSrc} 
          alt={alt || 'Image'} 
          className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 w-full h-full`}
          style={{ objectFit }}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          width={width}
          height={height}
          {...rest}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;