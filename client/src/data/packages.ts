import type { SelectedService } from "@shared/schema";

// Budget-Friendly Package
export const budgetPackage: SelectedService[] = [
  {"category": "listings", "name": "CoinGecko", "price": 950},
  {"category": "trendings", "name": "GeckoTerminal - Pool Trends", "price": 3040},
  {"category": "dex-boosts", "name": "DEXScreener - Boost 30x", "price": 185},
  {"category": "pr", "name": "Reddit Campaign (Multiple subreddits and trends)", "price": 400},
  {"category": "pr", "name": "Bitcointalk Post w/ Images", "price": 580},
  {"category": "botting", "name": "Telegram Reactions", "price": "300 per 1000"},
  {"category": "botting", "name": "DEX Screener Fire & Rocket Emojis", "price": "150 per 400"}
];

// Baller Package
export const ballerPackage: SelectedService[] = [
  {"category": "listings", "name": "CoinMarketCap", "price": 1500},
  {"category": "listings", "name": "CoinGecko", "price": 950},
  {"category": "trendings", "name": "CoinMarketCap - Top 10", "price": 1000},
  {"category": "pr", "name": "Dexscreener Ad – 100k views", "price": 1680},
  {"category": "trendings", "name": "GeckoTerminal - Pool Trends", "price": 3040},
  {"category": "dex-boosts", "name": "DEXTools - Nitro 1000", "price": 475},
  {"category": "pr", "name": "Binance Article", "price": 400},
  {"category": "botting", "name": "Twitter Followers", "price": "300 per 1000"},
  {"category": "botting", "name": "DEXTools Community Trust Votes", "price": "250 per 200"},
  {"category": "botting", "name": "DEX Screener Fire & Rocket Emojis", "price": "150 per 400"},
  {"category": "botting", "name": "Volume Bot", "price": "Custom"},
  {"category": "botting", "name": "Bundle Bot", "price": "Custom"},
  {"category": "pr", "name": "CoinMarketCape Article", "price": 300}
];

// Calculate package prices
const calculatePackagePrice = (services: SelectedService[]) => {
  return services.reduce((total, service) => {
    if (typeof service.price === 'number') {
      return total + service.price;
    }
    if (typeof service.price === 'string' && !service.price.toLowerCase().includes('custom')) {
      // Extract first number from strings like "300 per 1000"
      const match = service.price.match(/\d+/);
      if (match) {
        return total + parseInt(match[0], 10);
      }
    }
    return total;
  }, 0);
};

const budgetTotal = calculatePackagePrice(budgetPackage);
const ballerTotal = calculatePackagePrice(ballerPackage);

export const packageDetails = {
  "budget": {
    name: "Budget-Friendly Package",
    originalPrice: budgetTotal,
    discountedPrice: Math.floor(budgetTotal * 0.85), // 15% discount
    className: "from-primary-600/20 to-primary-600/5",
    buttonClassName: "bg-primary-600 hover:bg-primary-700",
    discountBadgeClassName: "bg-primary-600/20 text-primary-400"
  },
  "baller": {
    name: "Baller Package",
    originalPrice: ballerTotal,
    discountedPrice: Math.floor(ballerTotal * 0.85), // 15% discount
    className: "from-secondary-600/20 to-secondary-600/5",
    buttonClassName: "bg-secondary-600 hover:bg-secondary-700",
    discountBadgeClassName: "bg-secondary-600/20 text-secondary-400"
  }
};
