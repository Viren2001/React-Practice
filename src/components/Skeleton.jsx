import React from 'react';

const Skeleton = ({ className = '', style = {}, variant = 'rect' }) => {
  const baseStyle = {
    ...style,
    borderRadius: variant === 'circle' ? '50%' : (style.borderRadius || 'var(--radius-md)')
  };

  return (
    <div 
      className={`skeleton-shimmer ${className}`} 
      style={baseStyle}
    />
  );
};

export default Skeleton;
