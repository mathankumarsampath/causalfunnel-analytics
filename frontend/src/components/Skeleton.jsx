import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClass = "animate-pulse bg-slate-800 rounded-lg";
  
  const variants = {
    text: "h-4 w-full",
    title: "h-8 w-1/3",
    card: "h-32 w-full",
    circle: "h-12 w-12 rounded-full",
    tableRow: "h-16 w-full"
  };

  return (
    <div className={`${baseClass} ${variants[variant] || ''} ${className}`} />
  );
};

export default Skeleton;
