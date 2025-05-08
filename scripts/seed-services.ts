import { db } from "../server/db";
import { services } from "@shared/schema";

const servicesData = [
  {
    id: 1,
    category: "listings",
    name: "CoinGecko",
    description: "Facilitate your token's listing on CoinGecko, a leading cryptocurrency data aggregator, to enhance visibility and credibility among investors and the crypto community.",
    exampleType: "link",
    exampleContent: "https://www.coingecko.com/",
    price: "tbd"
  },
  {
    id: 2,
    category: "listings",
    name: "CoinMarketCap",
    description: "Assist in listing your token on CoinMarketCap, one of the most referenced crypto asset data aggregators, to increase exposure and attract potential investors.",
    exampleType: "link",
    exampleContent: "https://coinmarketcap.com/",
    price: "tbd"
  },
  {
    id: 3,
    category: "trendings",
    name: "CoinMarketCap - Top 10",
    description: "Implement strategies to position your token within CoinMarketCap's Top 10 rankings, boosting visibility and investor interest.",
    exampleType: "link",
    exampleContent: "https://coinmarketcap.com/?type=coins&tableRankBy=trending_24h",
    price: "tbd"
  },
  {
    id: 4,
    category: "trendings",
    name: "CoinMarketCap - Most Visited",
    description: "Enhance your token's profile to appear in CoinMarketCap's Most Visited section, increasing traffic and potential investment.",
    exampleType: "link",
    exampleContent: "https://coinmarketcap.com/?type=coins&tableRankBy=most_visited_24h",
    price: "tbd"
  },
  {
    id: 5,
    category: "trendings",
    name: "CoinMarketCap - Most Visited (Top 1-3)",
    description: "Aim for top-tier visibility by securing a spot in the top 3 of CoinMarketCap's Most Visited tokens, maximizing exposure.",
    exampleType: "link",
    exampleContent: "https://coinmarketcap.com/?type=coins&tableRankBy=most_visited_24h",
    price: "tbd"
  },
  {
    id: 6,
    category: "trendings",
    name: "CoinGecko - Country Trend",
    description: "Target specific regional markets by promoting your token in CoinGecko's Country Trends, attracting localized investor attention.",
    price: "tbd"
  },
  {
    id: 7,
    category: "trendings",
    name: "CoinGecko - Search",
    description: "Increase your token's prominence by boosting its position in CoinGecko's Search Trends, reflecting growing interest and engagement.",
    exampleType: "image",
    exampleContent: "attached_assets/cg-search-trend.png",
    price: "tbd"
  },
  {
    id: 8,
    category: "trendings",
    name: "GeckoTerminal - Search",
    description: "Optimize your token's visibility in GeckoTerminal's search results, making it easier for users to discover and track your project.",
    exampleType: "image",
    exampleContent: "attached_assets/gt-search.png",
    price: "tbd"
  },
  {
    id: 9,
    category: "trendings",
    name: "GeckoTerminal - Pool Trends",
    description: "Promote your token's liquidity pools to appear in GeckoTerminal's trending sections, attracting traders and liquidity providers.",
    exampleType: "link",
    exampleContent: "https://www.geckoterminal.com/",
    price: "tbd"
  },
  {
    id: 10,
    category: "trendings",
    name: "DEXTools - TRENDS",
    description: "Boost your token's activity to feature in DEXTools' TRENDS, increasing visibility among active traders.",
    exampleType: "image",
    exampleContent: "attached_assets/dt-trend.png",
    price: "tbd"
  },
  {
    id: 58,
    category: "pr",
    name: "Audit Fix",
    description: "Eliminate or redice any issues with audits on DEX",
    exampleType: "image",
    exampleContent: "attached_assets/audits-fix.png",
    price: "tbd"
  },
];

async function main() {
  console.log("Starting services update...");

  try {
    // First, delete all existing services
    await db.delete(services);
    console.log("Cleared existing services");

    // Then insert the new services
    await db.insert(services).values(servicesData);
    console.log("Services updated successfully");
  } catch (error) {
    console.error("Error updating services:", error);
    process.exit(1);
  }

  process.exit(0);
}

main(); 