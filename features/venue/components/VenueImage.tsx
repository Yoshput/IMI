'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface VenueImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  fallbackText?: string;
}

export const VenueImage: React.FC<VenueImageProps> = ({
  src,
  alt = 'Foto Venue',
  className,
  containerClassName,
  fallbackText = 'Foto tidak tersedia',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-surface-secondary', containerClassName)}>
      {/* Shimmer skeleton saat memuat */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-r from-surface-secondary via-surface-subtle to-surface-secondary animate-pulse" />
      )}

      {/* Fallback jika gambar error / gagal dimuat */}
      {isError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center text-foreground-muted bg-surface-secondary/80">
          <ImageIcon className="w-6 h-6 mb-1 text-foreground-muted/60" />
          <span className="text-[10px] line-clamp-1">{fallbackText}</span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
};
