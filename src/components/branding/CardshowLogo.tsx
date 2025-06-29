
import { Link } from 'react-router-dom';

interface CardshowLogoProps {
  variant?: 'icon' | 'text' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CardshowLogo = ({ 
  variant = 'full', 
  size = 'md', 
  className = '' 
}: CardshowLogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const LogoIcon = () => (
    <div className={`logo__icon ${iconSizes[size]}`}>
      {/* Script-style "C" for Cardshow */}
      <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2s-.9-2-2-2c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 1.1.9 2 2 2s2-.9 2-2c0-5.52-4.48-10-10-10z"/>
      </svg>
    </div>
  );

  const LogoText = () => (
    <span className={`logo__text ${sizeClasses[size]} font-bold text-foreground`}>
      Cardshow
    </span>
  );

  if (variant === 'icon') {
    return (
      <Link to="/" className={`flex items-center ${className}`}>
        <LogoIcon />
      </Link>
    );
  }

  if (variant === 'text') {
    return (
      <Link to="/" className={`flex items-center ${className}`}>
        <LogoText />
      </Link>
    );
  }

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <LogoIcon />
      <LogoText />
    </Link>
  );
};

export default CardshowLogo;
