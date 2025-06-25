
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAccessibilityFeatures } from '@/hooks/useAccessibilityFeatures';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { 
  Accessibility, 
  Eye, 
  Keyboard, 
  Volume2, 
  Contrast, 
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AccessibilityToolbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { a11yState, announce, adjustFontSize, runAccessibilityAudit } = useAccessibilityFeatures();
  const { config, setConfig, triggerHapticFeedback } = useMobileOptimization();
  
  const toggleHighContrast = () => {
    const newMode = !a11yState.highContrastMode;
    document.documentElement.classList.toggle('high-contrast', newMode);
    announce(`High contrast mode ${newMode ? 'enabled' : 'disabled'}`, 'assertive');
    triggerHapticFeedback('medium');
  };

  const toggleReducedMotion = () => {
    const newMode = !a11yState.reducedMotion;
    document.documentElement.classList.toggle('reduce-motion', newMode);
    announce(`Reduced motion ${newMode ? 'enabled' : 'disabled'}`, 'assertive');
  };

  const runAudit = () => {
    const results = runAccessibilityAudit();
    announce(`Accessibility audit complete. Score: ${results.score}. ${results.issues.length} issues found.`, 'assertive');
    console.log('Accessibility Audit Results:', results);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <Button
        variant="default"
        size="lg"
        className={cn(
          'rounded-full p-3 shadow-lg',
          'focus:ring-4 focus:ring-[#00C851] focus:ring-offset-2',
          'bg-[#00C851] hover:bg-[#00a844]',
          a11yState.highContrastMode && 'border-2 border-white'
        )}
        onClick={() => {
          setIsExpanded(!isExpanded);
          triggerHapticFeedback('light');
          announce(`Accessibility toolbar ${isExpanded ? 'collapsed' : 'expanded'}`, 'polite');
        }}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} accessibility toolbar`}
        aria-expanded={isExpanded}
      >
        <Accessibility className="w-6 h-6" />
      </Button>

      {/* Expanded Toolbar */}
      {isExpanded && (
        <Card className={cn(
          'absolute bottom-16 right-0 p-4 w-80 shadow-2xl',
          'bg-gray-900 border-gray-800',
          a11yState.highContrastMode && 'bg-black border-white border-2'
        )}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility Settings
          </h3>

          <div className="space-y-3">
            {/* Font Size Controls */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Font Size</label>
              <div className="flex gap-2">
                {(['normal', 'large', 'xl'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={a11yState.fontSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      adjustFontSize(size);
                      triggerHapticFeedback('light');
                    }}
                    className="flex-1"
                    aria-pressed={a11yState.fontSize === size}
                  >
                    <Type className="w-4 h-4 mr-1" />
                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Visual Settings */}
            <div className="space-y-2">
              <Button
                variant={a11yState.highContrastMode ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={toggleHighContrast}
                aria-pressed={a11yState.highContrastMode}
              >
                <Contrast className="w-4 h-4 mr-2" />
                High Contrast Mode
              </Button>

              <Button
                variant={a11yState.reducedMotion ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={toggleReducedMotion}
                aria-pressed={a11yState.reducedMotion}
              >
                <Eye className="w-4 h-4 mr-2" />
                Reduce Motion
              </Button>
            </div>

            <Separator className="bg-gray-700" />

            {/* Navigation Settings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Keyboard Navigation</span>
                <div className={cn(
                  'px-2 py-1 rounded text-xs',
                  a11yState.keyboardNavigation 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                )}>
                  {a11yState.keyboardNavigation ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Screen Reader</span>
                <div className={cn(
                  'px-2 py-1 rounded text-xs',
                  a11yState.screenReaderActive 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                )}>
                  {a11yState.screenReaderActive ? 'Detected' : 'Not Detected'}
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Mobile Settings */}
            <div className="space-y-2">
              <Button
                variant={config.enableHaptics ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => {
                  setConfig(prev => ({ ...prev, enableHaptics: !prev.enableHaptics }));
                  announce(`Haptic feedback ${!config.enableHaptics ? 'enabled' : 'disabled'}`, 'polite');
                }}
                aria-pressed={config.enableHaptics}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Haptic Feedback
              </Button>
            </div>

            <Separator className="bg-gray-700" />

            {/* Audit Button */}
            <Button
              variant="secondary"
              className="w-full"
              onClick={runAudit}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Run Accessibility Audit
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AccessibilityToolbar;
