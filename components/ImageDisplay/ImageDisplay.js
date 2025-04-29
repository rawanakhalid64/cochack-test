// components/ImageDisplay/ImageDisplay.jsx
'use client';
import Image from 'next/image';

export default function ImageDisplay({ 
  imageUrl, 
  size = 'md',
  fallbackText,
  rounded = true
}) {
  // Size classes mapping
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56'
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  
  const initials = fallbackText ? 
    fallbackText.split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2) : 
    '?';

  return (
    <div className={`relative ${sizeClasses[size]} ${roundedClass} overflow-hidden bg-gray-100`}>
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt="Profile picture" 
          fill 
          className={`object-cover ${roundedClass}`}
        />
      ) : (
        <div className={`flex items-center justify-center h-full w-full bg-purple-200 text-purple-800 font-bold ${roundedClass}`}>
          {initials}
        </div>
      )}
    </div>
  );
}