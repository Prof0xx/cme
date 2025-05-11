interface PackageServiceDefinition {
  category: string;
  name: string;
}

export const budgetPackageServices: PackageServiceDefinition[] = [
  {category: "listings", name: "CoinGecko"},
  {category: "trendings", name: "GeckoTerminal - Pool Trends"},
  {category: "dex-boosts", name: "DEXScreener - Boost 30x"},
  {category: "pr", name: "Reddit Campaign (Multiple subreddits and trends)"},
  {category: "pr", name: "Bitcointalk Post w/ Images"},
  {category: "botting", name: "Telegram Reactions"},
  {category: "botting", name: "DEX Screener Fire & Rocket Emojis"}
];

export const ballerPackageServices: PackageServiceDefinition[] = [
  {category: "listings", name: "CoinMarketCap"},
  {category: "listings", name: "CoinGecko"},
  {category: "trendings", name: "CoinMarketCap - Top 10"},
  {category: "pr", name: "Dexscreener Ad – 100k views"},
  {category: "trendings", name: "GeckoTerminal - Pool Trends"},
  {category: "dex-boosts", name: "DEXTools - Nitro 1000"},
  {category: "pr", name: "Binance Article"},
  {category: "botting", name: "Twitter Followers"},
  {category: "botting", name: "DEXTools Community Trust Votes"},
  {category: "botting", name: "DEX Screener Fire & Rocket Emojis"},
  {category: "botting", name: "Volume Bot"},
  {category: "botting", name: "Bundle Bot"},
  {category: "pr", name: "CoinMarketCape Article"}
]; 