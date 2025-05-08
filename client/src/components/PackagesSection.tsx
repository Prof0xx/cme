import { useStrategyBoard } from "@/context/StrategyBoardContext";
import { Button } from "@/components/ui/button";
import { packageDetails, ballerPackage } from "@/data/packages";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const PackagesSection = () => {
  const { selectPackage } = useStrategyBoard();
  const [showMoreServices, setShowMoreServices] = useState(false);

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-white mb-6">Prebuilt Packages</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget-Friendly Package */}
        <div className="bg-dark-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${packageDetails.budget.className} p-6`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">Budget-Friendly Package</h3>
              <span className={`${packageDetails.budget.discountBadgeClassName} text-xs font-medium px-2 py-1 rounded-full`}>15% OFF</span>
            </div>
            <div className="flex items-baseline mb-4">
              <span className="text-gray-400 text-lg line-through mr-2">Prices</span>
              <span className="text-white text-2xl font-bold">Under Revision</span>
            </div>
            <Button
              onClick={() => selectPackage('budget')}
              className={`w-full py-3 ${packageDetails.budget.buttonClassName} transition text-white rounded-lg font-medium`}
            >
              Select Package
            </Button>
          </div>
          <div className="p-6">
            <h4 className="text-gray-400 text-sm uppercase font-medium mb-3">Included Services</h4>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-300">CoinGecko Listing</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">GeckoTerminal Pool Trends</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">DEXScreener - Boost 30x</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Reddit Campaign (Multiple subreddits and trends)</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Bitcointalk Post w/ Images</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Telegram Reactions (1000)</span>
                <span className="text-gray-400">TBD per 1000</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">DEX Screener Fire & Rocket Emojis</span>
                <span className="text-gray-400">TBD per 400</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Baller Package */}
        <div className="bg-dark-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${packageDetails.baller.className} p-6`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">Baller Package</h3>
              <span className={`${packageDetails.baller.discountBadgeClassName} text-xs font-medium px-2 py-1 rounded-full`}>15% OFF</span>
            </div>
            <div className="flex items-baseline mb-4">
              <span className="text-gray-400 text-lg line-through mr-2">Prices</span>
              <span className="text-white text-2xl font-bold">Under Revision</span>
            </div>
            <Button
              onClick={() => selectPackage('baller')}
              className={`w-full py-3 ${packageDetails.baller.buttonClassName} transition text-white rounded-lg font-medium`}
            >
              Select Package
            </Button>
          </div>
          <div className="p-6">
            <h4 className="text-gray-400 text-sm uppercase font-medium mb-3">Included Services</h4>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-300">CoinMarketCap Fast Listing</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">CoinGecko Fast Listing</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">CoinMarketCap - Top 10</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Dexscreener Ad – 100k views</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">GeckoTerminal Pool Trends</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">DEXTools - Nitro 1000</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Binance Article</span>
                <span className="text-gray-400">TBD</span>
              </li>
              <li 
                className="flex justify-between items-center cursor-pointer text-primary-400 hover:text-primary-300 transition-colors"
                onClick={() => setShowMoreServices(!showMoreServices)}
              >
                <span className="text-gray-300 flex items-center">
                  {showMoreServices ? (
                    <ChevronUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  )}
                  {showMoreServices ? "Hide premium services" : "+ 6 more premium services"}
                </span>
                <span className="text-gray-400">See Details</span>
              </li>
              
              {/* Hidden services */}
              {showMoreServices && (
                <div className="border-t border-gray-800 pt-3 mt-2 space-y-3 pl-5">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Twitter Followers</span>
                    <span className="text-gray-500">TBD per 1000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">DEXTools Community Trust Votes</span>
                    <span className="text-gray-500">TBD per 200</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">DEX Screener Fire & Rocket Emojis</span>
                    <span className="text-gray-500">TBD per 400</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Volume Bot</span>
                    <span className="text-gray-500">Custom</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Bundle Bot</span>
                    <span className="text-gray-500">Custom</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">CoinMarketCape Article</span>
                    <span className="text-gray-500">TBD</span>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
