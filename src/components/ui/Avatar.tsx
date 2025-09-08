import React from 'react';
import { cn } from '@/lib/utils';
import { AvatarVariant } from '@/types';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, AvatarVariant {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, variant = 'default', size = 'md', status, src, alt, fallback, ...props }, ref) => {
    const initials = fallback || alt?.charAt(0)?.toUpperCase() || '?';

    return (
      <div
        className={cn(
          'avatar',
          {
            'avatar-sm': size === 'sm',
            'avatar-md': size === 'md',
            'avatar-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {src ? (
          <img
            className="aspect-square h-full w-full object-cover"
            src={src}
            alt={alt}
            onError={(e) => {
              // Hide image on error and show fallback
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface text-text font-medium">
            {initials}
          </div>
        )}
        
        {variant === 'withStatus' && status && (
          <div
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-bg',
              {
                'bg-green-500': status === 'online',
                'bg-gray-500': status === 'offline',
                'bg-yellow-500': status === 'busy',
              }
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
