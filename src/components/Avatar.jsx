import React, { useState, useEffect } from 'react';

/**
 * Universal Avatar Component with automatic fallback on image load error
 * Prevents broken image icons from ever displaying in the UI.
 */
export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
  className = '',
  border = true
}) => {
  const [imgError, setImgError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const initial = (name || 'U').trim().charAt(0).toUpperCase() || 'U';

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
    xl: 'w-14 h-14 text-lg font-bold'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;
  const borderClass = border ? 'border-2 border-rose-500' : '';

  // If valid src exists and hasn't failed to load
  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`${currentSizeClass} rounded-full object-cover shadow-xs ${borderClass} ${className}`}
      />
    );
  }

  // Graceful Fallback: Gradient initial badge
  return (
    <div
      className={`${currentSizeClass} rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-xs shrink-0 select-none ${className}`}
      title={name}
      aria-label={name}
    >
      {initial}
    </div>
  );
};
