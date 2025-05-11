import type { SelectedService } from "@shared/schema";

// Budget-Friendly Package
export const budgetPackage: SelectedService[] = [
  {"category": "listings", "name": "CoinGecko", "price": 650},
  {"category": "trendings", "name": "GeckoTerminal - Pool Trends", "price": 300},
  {"category": "dex-boosts", "name": "DEXScreener - Boost 30x", "price": 235},
  {"category": "pr", "name": "Reddit Campaign (Multiple subreddits and trends)", "price": 400},
  {"category": "pr", "name": "Bitcointalk Post w/ Images", "price": 180},
  {"category": "botting", "name": "Telegram Reactions", "price": "$70 per 1000"},
  {"category": "botting", "name": "DEX Screener Fire & Rocket Emojis", "price": "$150 per 1000"}
];

// Baller Package
export const ballerPackage: SelectedService[] = [
  {"category": "listings", "name": "CoinMarketCap", "price": 5700},
  {"category": "listings", "name": "CoinGecko", "price": 650},
  {"category": "trendings", "name": "CoinMarketCap - Top 10", "price": 6600},
  {"category": "pr", "name": "Dexscreener Ad – 100k views", "price": 1850},
  {"category": "trendings", "name": "GeckoTerminal - Pool Trends", "price": 300},
  {"category": "dex-boosts", "name": "DEXTools - Nitro 1000", "price": 850},
  {"category": "pr", "name": "Binance Article", "price": 250},
  {"category": "botting", "name": "Twitter Followers", "price": "$80 per 1000"},
  {"category": "botting", "name": "DEXTools Community Trust Votes", "price": "$250 per 1000"},
  {"category": "botting", "name": "DEX Screener Fire & Rocket Emojis", "price": "$150 per 1000"},
  {"category": "botting", "name": "Volume Bot", "price": "Custom"},
  {"category": "botting", "name": "Bundle Bot", "price": "Custom"},
  {"category": "pr", "name": "CoinMarketCap Article", "price": 250}
];

// Fixed prices for packages
const BUDGET_BASE_TOTAL = 1765;  // Sum of all fixed-price services
const BUDGET_VARIABLE_SERVICES = 220; // 1000 units of Telegram Reactions ($70) + DEX Screener Emojis ($150)
const BUDGET_TOTAL = BUDGET_BASE_TOTAL + BUDGET_VARIABLE_SERVICES;
const BALLER_TOTAL = 16930;

export const packageDetails = {
  "budget": {
    name: "Budget-Friendly Package",
    originalPrice: BUDGET_TOTAL, // Now includes 1000 units of variable services
    discountedPrice: Math.floor(BUDGET_TOTAL * 0.85), // 15% discount
    className: "from-primary-600/20 to-primary-600/5",
    buttonClassName: "bg-primary-600 hover:bg-primary-700",
    discountBadgeClassName: "bg-primary-600/20 text-primary-400"
  },
  "baller": {
    name: "Baller Package",
    originalPrice: BALLER_TOTAL,
    discountedPrice: Math.floor(BALLER_TOTAL * 0.85), // 15% discount
    className: "from-secondary-600/20 to-secondary-600/5",
    buttonClassName: "bg-secondary-600 hover:bg-secondary-700",
    discountBadgeClassName: "bg-secondary-600/20 text-secondary-400"
  }
};
