
import React, { useRef, useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface MagneticButtonProps extends ButtonProps {
  children: React.ReactNode;
  magneticStrength?: number;
  className?: string;
}

const MagneticButton = ({ 
  children, 
  magneticStrength = 15, 
  className = '',
  ...props 
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / magneticStrength;
    const deltaY = (e.clientY - centerY) / magneticStrength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Button
      ref={buttonRef}
      className={`
        transition-all duration-300 ease-out
        ${isHovered ? 'scale-105 shadow-xl' : 'scale-100'}
        ${className}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.05 : 1})`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className={`transition-all duration-300 ${isHovered ? 'text-shadow-glow' : ''}`}>
        {children}
      </span>
    </Button>
  );
};

export default MagneticButton;
