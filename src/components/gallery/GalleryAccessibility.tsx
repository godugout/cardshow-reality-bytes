
import React from 'react';

interface GalleryAccessibilityProps {
  accessibilityMode: boolean;
}

const GalleryAccessibility = ({ accessibilityMode }: GalleryAccessibilityProps) => {
  if (!accessibilityMode) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm z-10">
      <h4 className="font-semibold mb-2 text-[#00C851]">Gallery Navigation</h4>
      <div className="text-sm text-gray-300 space-y-1">
        <p>Use arrow keys or WASD to navigate between cards.</p>
        <p>Press Enter to select a card for details.</p>
        <p>Use Tab to focus on UI elements.</p>
        <p>Press Escape to exit full view mode.</p>
      </div>
    </div>
  );
};

export default GalleryAccessibility;
