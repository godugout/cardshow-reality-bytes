
import { useState } from 'react';

interface CardshowLogoProps {
  variant?: 'icon' | 'text' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showThemeSelector?: boolean;
}

const CardshowLogo = ({ 
  variant = 'full', 
  size = 'md', 
  className = '',
  showThemeSelector = false 
}: CardshowLogoProps) => {
  const [currentTheme, setCurrentTheme] = useState('classic');

  const themes = [
    { id: 'classic', name: 'Classic Red', color: '#DC2626' },
    { id: 'royal', name: 'Royal Blue', color: '#1D4ED8' },
    { id: 'vibrant', name: 'Vibrant Orange', color: '#EA580C' },
    { id: 'fresh', name: 'Fresh Green', color: '#059669' }
  ];

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

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
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
    <span className={`logo__text ${sizeClasses[size]}`}>
      Cardshow
    </span>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`logo ${variant !== 'text' ? 'flex' : 'hidden'}`}>
        {variant === 'icon' && <LogoIcon />}
        {variant === 'full' && (
          <>
            <LogoIcon />
            <LogoText />
          </>
        )}
        {variant === 'text' && <LogoText />}
      </div>

      {showThemeSelector && (
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-secondary font-medium">Theme:</span>
          <div className="flex gap-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  currentTheme === theme.id 
                    ? 'border-white shadow-lg scale-110' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
                aria-label={`Switch to ${theme.name} theme`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardshowLogo;
