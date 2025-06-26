
// Utility functions for card pricing, supply, and engagement calculations

export const getRarityPricing = (rarity: string) => {
  const pricing = {
    common: { min: 1, max: 8, avg: 3 },
    uncommon: { min: 5, max: 20, avg: 12 },
    rare: { min: 15, max: 75, avg: 35 },
    epic: { min: 50, max: 200, avg: 100 },
    legendary: { min: 150, max: 800, avg: 350 },
    mythic: { min: 500, max: 2000, avg: 1000 }
  };
  return pricing[rarity as keyof typeof pricing] || pricing.common;
};

export const getSupplyNumbers = (rarity: string) => {
  const supplies = {
    common: { min: 1000, max: 10000 },
    uncommon: { min: 500, max: 5000 },
    rare: { min: 100, max: 1000 },
    epic: { min: 50, max: 500 },
    legendary: { min: 10, max: 100 },
    mythic: { min: 1, max: 25 }
  };
  return supplies[rarity as keyof typeof supplies] || supplies.common;
};

export const getEngagementNumbers = (rarity: string) => {
  const baseMultiplier = {
    common: 1,
    uncommon: 2,
    rare: 4,
    epic: 8,
    legendary: 15,
    mythic: 30
  };
  const multiplier = baseMultiplier[rarity as keyof typeof baseMultiplier] || 1;
  
  return {
    view_count: Math.floor(Math.random() * 1000 * multiplier) + 10,
    favorite_count: Math.floor(Math.random() * 100 * multiplier) + 1
  };
};

export const calculateCardMetrics = (rarity: string) => {
  const pricing = getRarityPricing(rarity);
  const supply = getSupplyNumbers(rarity);
  const engagement = getEngagementNumbers(rarity);
  
  const marketValue = Math.floor(
    Math.random() * (pricing.max - pricing.min) + pricing.min
  );
  
  const totalSupply = Math.floor(
    Math.random() * (supply.max - supply.min) + supply.min
  );

  return {
    marketValue,
    totalSupply,
    basePrice: Math.floor(marketValue * 0.8),
    viewCount: engagement.view_count,
    favoriteCount: engagement.favorite_count,
    royaltyPercentage: 5 + Math.random() * 10 // 5-15% royalty
  };
};
