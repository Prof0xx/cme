import { SelectedService } from "@shared/schema";

// Service categories with their visual configurations
export const categoryConfigs = {
  "listings": {
    icon: "list",
    iconColor: "text-primary-500",
    bgColor: "bg-primary-600/20",
  },
  "trendings": {
    icon: "arrow-trend-up",
    iconColor: "text-secondary-500",
    bgColor: "bg-secondary-600/20",
  },
  "pr": {
    icon: "newspaper",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-600/20",
  },
  "dex-boosts": {
    icon: "chart-line",
    iconColor: "text-green-500",
    bgColor: "bg-green-600/20",
  },
  "botting": {
    icon: "robot",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-600/20",
  },
  "startup": {
    icon: "rocket",
    iconColor: "text-orange-500",
    bgColor: "bg-orange-600/20",
  }
};

// Services organized by category
export const services: Record<string, SelectedService[]> = {
  "listings": [
    {"category": "listings", "name": "CoinGecko", "price": 950},
    {"category": "listings", "name": "CoinMarketCap", "price": 6200}
  ],
  "trendings": [
    {"category": "trendings", "name": "CoinMarketCap - Top 10", "price": 8000},
    {"category": "trendings", "name": "CoinMarketCap - Most Visited", "price": 500},
    {"category": "trendings", "name": "CoinMarketCap - Most Visited (Top 1-3)", "price": 3500},
    {"category": "trendings", "name": "CoinGecko - Country Trends", "price": 450},
    {"category": "trendings", "name": "CoinGecko - Search Trends", "price": 750},
    {"category": "trendings", "name": "GeckoTerminal - Search", "price": 300},
    {"category": "trendings", "name": "GeckoTerminal - Pool Trends", "price": 300},
    {"category": "trendings", "name": "DEXTools - TRENDS", "price": 8000},
    {"category": "trendings", "name": "DEXScreener - Trends", "price": 5000},
    {"category": "trendings", "name": "DEXScreener - Update", "price": 400},
    {"category": "trendings", "name": "DEXScreener - Searchbar bottom", "price": 3500},
    {"category": "trendings", "name": "Birdeye - Most visited", "price": 400},
    {"category": "trendings", "name": "Birdeye - Most watched", "price": 400},
    {"category": "trendings", "name": "Solscan - Search Trends", "price": 700},
    {"category": "trendings", "name": "Crypto.com - Trends", "price": 200},
    {"category": "trendings", "name": "Crypto.com - What Others Are Searching", "price": 200},
    {"category": "trendings", "name": "Crypto.com - Most Popular Tokens", "price": 300},
    {"category": "trendings", "name": "Crypto.com - Tokens to Watch (forever)", "price": 3000}
  ],
  "pr": [
    {"category": "pr", "name": "Binance Article", "price": 400},
    {"category": "pr", "name": "CoinMarketCape Article", "price": 300},
    {"category": "pr", "name": "KOL Management", "price": "Custom"},
    {"category": "pr", "name": "Shilling", "price": "Custom"},
    {"category": "pr", "name": "Reddit Campaign (CMS + subs + upvotes)", "price": 400},
    {"category": "pr", "name": "Pornhub Ads", "price": "200-400"},
    {"category": "pr", "name": "4chan Ads", "price": "200-400"},
    {"category": "pr", "name": "Debank", "price": 350},
    {"category": "pr", "name": "Dexscreener Ad – 10k views", "price": 280},
    {"category": "pr", "name": "Dexscreener Ad – 25k views", "price": 650},
    {"category": "pr", "name": "Dexscreener Ad – 50k views", "price": 925},
    {"category": "pr", "name": "Dexscreener Ad – 100k views", "price": 1850},
    {"category": "pr", "name": "Dexscreener Ad – 200k views", "price": 3650},
    {"category": "pr", "name": "Dexscreener Ad – 400k views", "price": 6500},
    {"category": "pr", "name": "Bitcointalk Post w/ Images", "price": 200}
  ],
  "dex-boosts": [
    {"category": "dex-boosts", "name": "DEXTools - Turbo 200", "price": 185},
    {"category": "dex-boosts", "name": "DEXTools - Turbo 500", "price": 475},
    {"category": "dex-boosts", "name": "DEXTools - Turbo 1000", "price": 850},
    {"category": "dex-boosts", "name": "DEXTools - Turbo 5000", "price": 3750},
    {"category": "dex-boosts", "name": "DEXScreener - Boost 30x", "price": 235},
    {"category": "dex-boosts", "name": "DEXScreener - Boost 50x", "price": 380},
    {"category": "dex-boosts", "name": "DEXScreener - Boost 100x", "price": 875},
    {"category": "dex-boosts", "name": "DEXScreener - Boost 500x", "price": 3800}
  ],
  "botting": [
    {"category": "botting", "name": "Telegram Reactions", "price": "150 per 1000"},
    {"category": "botting", "name": "Twitter Followers", "price": "150 per 1000"},
    {"category": "botting", "name": "DEXTools Community Trust Votes", "price": "300 per 200"},
    {"category": "botting", "name": "DEX Screener Fire & Rocket Emojis", "price": "150 per 400"},
    {"category": "botting", "name": "Volume Bot", "price": "Custom"},
    {"category": "botting", "name": "Bundle Bot", "price": "Custom"}
  ],
  "startup": [
    {"category": "startup", "name": "Website", "price": 300},
    {"category": "startup", "name": "Logo + Banners", "price": 200},
    {"category": "startup", "name": "Stickers + Emojis", "price": 200},
    {"category": "startup", "name": "White Paper/Gitbook", "price": 200},
    {"category": "startup", "name": "Telegram Setup (with portal + bots)", "price": 100},
    {"category": "startup", "name": "Twitter Setup", "price": 100},
    {"category": "startup", "name": "Moderation", "price": "Custom"},
    {"category": "startup", "name": "Hypers/Raiders", "price": "Custom"}
  ]
};

// Category min prices
export const categoryMinPrices = {
  "listings": 950,
  "trendings": 300,
  "pr": 200,
  "dex-boosts": 185,
  "botting": 150,
  "startup": 100
};
