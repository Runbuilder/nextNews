import React from 'react';

export const Avatar = ({ children, ...props }) => (
  <div className="relative inline-block" {...props}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    className="w-10 h-10 rounded-full"
    {...props}
  />
);

export const AvatarFallback = ({ children, ...props }) => (
  <div
    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
    {...props}
  >
    {children}
  </div>
);
