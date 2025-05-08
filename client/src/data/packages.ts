import { SelectedService } from "@shared/schema";

// Budget-Friendly Package
export const budgetPackage: SelectedService[] = [
  {"category": "listings", "name": "CoinGecko", "price": "tbd"},
  {"category": "trendings", "name": "GeckoTerminal - Pool Trends", "price": "tbd"},
  {"category": "dex-boosts", "name": "DEXScreener - Boost 30x", "price": "tbd"},
  {"category": "pr", "name": "Reddit Campaign (Multiple subreddits and trends)", "price": "tbd"},
  {"category": "pr", "name": "Bitcointalk Post w/ Images", "price": "tbd"},
  {"category": "botting", "name": "Telegram Reactions", "price": "tbd per 1000"},
  {"category": "botting", "name": "DEX Screener Fire & Rocket Emojis", "price": "tbd per 400"}
];

// Baller Package
export const ballerPackage: SelectedService[] = [
  {"category": "listings", "name": "CoinMarketCap", "price": "tbd"},
  {"category": "listings", "name": "CoinGecko", "price": "tbd"},
  {"category": "trendings", "name": "CoinMarketCap - Top 10", "price": "tbd"},
  {"category": "pr", "name": "Dexscreener Ad – 100k views", "price": "tbd"},
  {"category": "trendings", "name": "GeckoTerminal - Pool Trends", "price": "tbd"},
  {"category": "dex-boosts", "name": "DEXTools - Nitro 1000", "price": "tbd"},
  {"category": "pr", "name": "Binance Article", "price": "tbd"},
  {"category": "botting", "name": "Twitter Followers", "price": "tbd per 1000"},
  {"category": "botting", "name": "DEXTools Community Trust Votes", "price": "tbd per 200"},
  {"category": "botting", "name": "DEX Screener Fire & Rocket Emojis", "price": "tbd per 400"},
  {"category": "botting", "name": "Volume Bot", "price": "Custom"},
  {"category": "botting", "name": "Bundle Bot", "price": "Custom"},
  {"category": "pr", "name": "CoinMarketCape Article", "price": "tbd"}
];

export const packageDetails = {
  "budget": {
    name: "Budget-Friendly Package",
    originalPrice: 0,
    discountedPrice: 0,
    className: "from-primary-600/20 to-primary-600/5",
    buttonClassName: "bg-primary-600 hover:bg-primary-700",
    discountBadgeClassName: "bg-primary-600/20 text-primary-400"
  },
  "baller": {
    name: "Baller Package",
    originalPrice: 0,
    discountedPrice: 0,
    className: "from-secondary-600/20 to-secondary-600/5",
    buttonClassName: "bg-secondary-600 hover:bg-secondary-700",
    discountBadgeClassName: "bg-secondary-600/20 text-secondary-400"
  }
};
