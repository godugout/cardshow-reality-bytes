
import React from 'react';

const StyleGuide = () => {
  return (
    <div className="crd-container crd-p-8">
      <div className="space-y-12">
        {/* Header */}
        <div>
          <h1 className="crd-heading-1 crd-text-gradient">Cardshow Design System</h1>
          <p className="crd-body-large mt-4">
            A unified design system for consistent, maintainable UI components.
          </p>
        </div>

        {/* Colors */}
        <section>
          <h2 className="crd-heading-2 mb-6">Colors</h2>
          <div className="crd-grid crd-grid-cols-4 crd-gap-4">
            <div className="crd-card crd-p-4">
              <div className="w-full h-12 bg-primary rounded mb-3"></div>
              <p className="crd-label">Primary</p>
              <p className="crd-caption">hsl(var(--primary))</p>
            </div>
            <div className="crd-card crd-p-4">
              <div className="w-full h-12 bg-secondary rounded mb-3"></div>
              <p className="crd-label">Secondary</p>
              <p className="crd-caption">hsl(var(--secondary))</p>
            </div>
            <div className="crd-card crd-p-4">
              <div className="w-full h-12 bg-muted rounded mb-3"></div>
              <p className="crd-label">Muted</p>
              <p className="crd-caption">hsl(var(--muted))</p>
            </div>
            <div className="crd-card crd-p-4">
              <div className="w-full h-12 bg-accent rounded mb-3"></div>
              <p className="crd-label">Accent</p>
              <p className="crd-caption">hsl(var(--accent))</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="crd-heading-2 mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="crd-heading-1">Heading 1</h1>
              <code className="crd-caption">.crd-heading-1</code>
            </div>
            <div>
              <h2 className="crd-heading-2">Heading 2</h2>
              <code className="crd-caption">.crd-heading-2</code>
            </div>
            <div>
              <h3 className="crd-heading-3">Heading 3</h3>
              <code className="crd-caption">.crd-heading-3</code>
            </div>
            <div>
              <p className="crd-body">Body text - This is the standard body text style used throughout the application.</p>
              <code className="crd-caption">.crd-body</code>
            </div>
            <div>
              <p className="crd-caption">Caption text - Smaller text for less important information.</p>
              <code className="crd-caption">.crd-caption</code>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="crd-heading-2 mb-6">Buttons</h2>
          <div className="crd-flex crd-gap-4 flex-wrap">
            <button className="crd-button crd-button--primary crd-button--md">Primary</button>
            <button className="crd-button crd-button--secondary crd-button--md">Secondary</button>
            <button className="crd-button crd-button--outline crd-button--md">Outline</button>
            <button className="crd-button crd-button--ghost crd-button--md">Ghost</button>
            <button className="crd-button crd-button--destructive crd-button--md">Destructive</button>
          </div>
          <div className="crd-flex crd-gap-4 flex-wrap mt-4">
            <button className="crd-button crd-button--primary crd-button--sm">Small</button>
            <button className="crd-button crd-button--primary crd-button--md">Medium</button>
            <button className="crd-button crd-button--primary crd-button--lg">Large</button>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="crd-heading-2 mb-6">Cards</h2>
          <div className="crd-grid crd-grid-cols-3 crd-gap-6">
            <div className="crd-card">
              <div className="crd-card__header">
                <h3 className="crd-card__title">Card Title</h3>
                <p className="crd-card__description">Card description text</p>
              </div>
              <div className="crd-card__content">
                <p className="crd-body">Card content goes here.</p>
              </div>
            </div>
            
            <div className="crd-card crd-card--interactive">
              <div className="crd-card__content">
                <h3 className="crd-card__title">Interactive Card</h3>
                <p className="crd-card__description">Hover over this card</p>
              </div>
            </div>
            
            <div className="crd-card crd-card--glass">
              <div className="crd-card__content">
                <h3 className="crd-card__title">Glass Card</h3>
                <p className="crd-card__description">With backdrop blur</p>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="crd-heading-2 mb-6">Usage Guidelines</h2>
          <div className="crd-card crd-p-6">
            <h3 className="crd-heading-4 mb-4">Component Creation Rules</h3>
            <ul className="space-y-2 crd-body">
              <li>• Always use design system tokens (CSS custom properties)</li>
              <li>• Prefix custom classes with 'crd-' to avoid conflicts</li>
              <li>• Use semantic class names (crd-button--primary, not crd-button--green)</li>
              <li>• Follow the BEM-like naming convention: block__element--modifier</li>
              <li>• Leverage Tailwind utilities for layout and spacing</li>
              <li>• Create component-specific CSS only when Tailwind is insufficient</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StyleGuide;
