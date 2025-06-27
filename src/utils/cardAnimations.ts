
export const cardAnimationPresets = {
  // Entrance animations
  slideInFromLeft: {
    from: { opacity: 0, transform: 'translateX(-100px) scale(0.8)' },
    to: { opacity: 1, transform: 'translateX(0px) scale(1)' },
    config: { tension: 280, friction: 30 }
  },
  
  slideInFromRight: {
    from: { opacity: 0, transform: 'translateX(100px) scale(0.8)' },
    to: { opacity: 1, transform: 'translateX(0px) scale(1)' },
    config: { tension: 280, friction: 30 }
  },
  
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.5) rotate(-10deg)' },
    to: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
    config: { tension: 400, friction: 25 }
  },
  
  flipIn: {
    from: { opacity: 0, transform: 'perspective(1000px) rotateY(-90deg)' },
    to: { opacity: 1, transform: 'perspective(1000px) rotateY(0deg)' },
    config: { tension: 200, friction: 30 }
  },
  
  // Hover animations
  hoverLift: {
    from: { transform: 'translateY(0px) scale(1)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    to: { transform: 'translateY(-8px) scale(1.02)', boxShadow: '0 12px 24px rgba(0,0,0,0.2)' },
    config: { tension: 400, friction: 30 }
  },
  
  hoverTilt: {
    from: { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
    to: { transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)' },
    config: { tension: 300, friction: 40 }
  },
  
  // Selection animations
  selectPulse: {
    from: { transform: 'scale(1)', borderColor: 'transparent' },
    to: { transform: 'scale(1.05)', borderColor: '#00C851' },
    config: { tension: 500, friction: 15 }
  },
  
  selectGlow: {
    from: { boxShadow: '0 0 0px rgba(0,200,81,0)' },
    to: { boxShadow: '0 0 20px rgba(0,200,81,0.6)' },
    config: { tension: 300, friction: 25 }
  },
  
  // Stack animations
  stackDeal: {
    from: { 
      opacity: 0, 
      transform: 'translateY(-50px) rotate(0deg) scale(0.8)' 
    },
    to: { 
      opacity: 1, 
      transform: 'translateY(0px) rotate(var(--rotation)) scale(1)' 
    },
    config: { tension: 250, friction: 35 }
  },
  
  stackShuffle: {
    from: { transform: 'translateY(0px) rotate(0deg)' },
    to: { transform: 'translateY(-20px) rotate(180deg)' },
    config: { tension: 400, friction: 20 }
  }
};

export const rarityAnimations = {
  common: {
    idle: 'none',
    hover: cardAnimationPresets.hoverLift
  },
  
  uncommon: {
    idle: 'none',
    hover: cardAnimationPresets.hoverLift,
    select: cardAnimationPresets.selectPulse
  },
  
  rare: {
    idle: {
      transform: 'translateY(0px)',
      config: { tension: 200, friction: 50 },
      loop: { 
        to: { transform: 'translateY(-2px)' },
        from: { transform: 'translateY(0px)' },
        config: { duration: 2000 }
      }
    },
    hover: cardAnimationPresets.hoverTilt,
    select: cardAnimationPresets.selectGlow
  },
  
  epic: {
    idle: {
      transform: 'scale(1) rotate(0deg)',
      config: { tension: 200, friction: 50 },
      loop: {
        to: { transform: 'scale(1.02) rotate(1deg)' },
        from: { transform: 'scale(1) rotate(0deg)' },
        config: { duration: 3000 }
      }
    },
    hover: {
      ...cardAnimationPresets.hoverTilt,
      ...cardAnimationPresets.selectGlow
    }
  },
  
  legendary: {
    idle: {
      transform: 'translateY(0px) scale(1)',
      boxShadow: '0 0 10px rgba(251,191,36,0.3)',
      config: { tension: 200, friction: 50 },
      loop: {
        to: { 
          transform: 'translateY(-3px) scale(1.01)',
          boxShadow: '0 0 15px rgba(251,191,36,0.5)'
        },
        from: { 
          transform: 'translateY(0px) scale(1)',
          boxShadow: '0 0 10px rgba(251,191,36,0.3)'
        },
        config: { duration: 2500 }
      }
    },
    hover: {
      transform: 'translateY(-10px) scale(1.05) perspective(1000px) rotateX(5deg)',
      boxShadow: '0 15px 30px rgba(251,191,36,0.4)',
      config: { tension: 300, friction: 25 }
    }
  },
  
  mythic: {
    idle: {
      transform: 'translateY(0px) scale(1) rotate(0deg)',
      boxShadow: '0 0 15px rgba(236,72,153,0.4)',
      config: { tension: 200, friction: 50 },
      loop: {
        to: { 
          transform: 'translateY(-4px) scale(1.02) rotate(2deg)',
          boxShadow: '0 0 25px rgba(236,72,153,0.6)'
        },
        from: { 
          transform: 'translateY(0px) scale(1) rotate(0deg)',
          boxShadow: '0 0 15px rgba(236,72,153,0.4)'
        },
        config: { duration: 2000 }
      }
    },
    hover: {
      transform: 'translateY(-12px) scale(1.08) perspective(1000px) rotateX(10deg) rotateY(5deg)',
      boxShadow: '0 20px 40px rgba(236,72,153,0.5)',
      filter: 'brightness(1.1)',
      config: { tension: 350, friction: 20 }
    }
  }
};

export const getAnimationForRarity = (rarity: string, state: 'idle' | 'hover' | 'select' = 'idle') => {
  const animations = rarityAnimations[rarity as keyof typeof rarityAnimations];
  return animations?.[state] || cardAnimationPresets.hoverLift;
};
