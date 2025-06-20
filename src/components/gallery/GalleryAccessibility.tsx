
interface GalleryAccessibilityProps {
  accessibilityMode: boolean;
}

const GalleryAccessibility = ({ accessibilityMode }: GalleryAccessibilityProps) => {
  if (!accessibilityMode) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg max-w-sm">
      <h4 className="font-semibold mb-2">Gallery Navigation</h4>
      <p className="text-sm text-gray-300">
        Use arrow keys or WASD to navigate between cards. 
        Press Enter to select a card. Use Tab to focus on UI elements.
      </p>
    </div>
  );
};

export default GalleryAccessibility;
