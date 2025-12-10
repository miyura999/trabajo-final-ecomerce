import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false,
  shadow = 'md'
}) => {
  const paddingClass = padding ? 'p-6' : '';
  const hoverClass = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: ''
  };

  return (
    <div className={`
      bg-white rounded-lg ${shadowClasses[shadow]} ${paddingClass} ${hoverClass} ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;