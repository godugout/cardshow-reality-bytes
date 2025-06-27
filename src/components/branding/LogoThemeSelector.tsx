
import { Link } from 'react-router-dom';

interface LogoThemeSelectorProps {
  variant?: 'minimal' | 'descriptive';
  className?: string;
}

const LogoThemeSelector = ({ 
  variant = 'descriptive',
  className = '' 
}: LogoThemeSelectorProps) => {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-lg p-2 -m-2 transition-all ${className}`}
    >
      {/* Clean, Minimal Logo */}
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2s-.9-2-2-2c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 1.1.9 2 2 2s2-.9 2-2c0-5.52-4.48-10-10-10z"/>
          </svg>
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </div>
      
      {variant === 'descriptive' && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-foreground font-display group-hover:text-primary transition-colors">
            Cardshow
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Digital Trading Cards
          </span>
        </div>
      )}
      
      {variant === 'minimal' && (
        <span className="text-xl font-bold text-foreground font-display group-hover:text-primary transition-colors">
          Cardshow
        </span>
      )}
    </Link>
  );
};

export default LogoThemeSelector;
