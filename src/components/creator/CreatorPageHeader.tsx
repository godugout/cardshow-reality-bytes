
interface CreatorPageHeaderProps {
  onEnterStudio: () => void;
  onShowOnboarding: () => void;
}

export const CreatorPageHeader = ({ onEnterStudio, onShowOnboarding }: CreatorPageHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold text-foreground mb-4 font-display">
        Creator Studio
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Design, create, and monetize your digital trading cards with professional tools and a thriving community
      </p>
    </div>
  );
};
