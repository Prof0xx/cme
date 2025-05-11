import React, { useState, useEffect } from 'react';

const PricingPackages: React.FC = () => {
  const [showPremiumServices, setShowPremiumServices] = useState(false);

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  const formatPrice = (price: number) => {
    console.log('Formatting price:', price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Log the initial prices
  const budgetServices = {
    coingecko: 650,
    geckoTerminal: 300,
    dexScreener30x: 235,
    redditCampaign: 400,
    bitcointalk: 180,
    telegramReactions: 70,
    dexScreenerEmojis: 150
  };

  const ballerServices = {
    coinmarketcapFast: 5700,
    coingeckoFast: 650,
    coinmarketcapTop10: 6600,
    dexscreenerAd100k: 1850,
    geckoTerminal: 300,
    dextoolsNitro: 850,
    binanceArticle: 250
  };

  console.log('Budget Services:', budgetServices);
  console.log('Baller Services:', ballerServices);

  // Calculate total prices
  const budgetTotal = Object.values(budgetServices).reduce((a, b) => a + b, 0);
  const ballerTotal = Object.values(ballerServices).reduce((a, b) => a + b, 0);
  
  console.log('Budget Total (before discount):', budgetTotal);
  console.log('Baller Total (before discount):', ballerTotal);
  
  const discountedBudgetTotal = budgetTotal * 0.85;
  const discountedBallerTotal = ballerTotal * 0.85;
  
  console.log('Budget Total (after 15% discount):', discountedBudgetTotal);
  console.log('Baller Total (after 15% discount):', discountedBallerTotal);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Prebuilt Packages</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget-Friendly Package */}
        <div className="bg-[#1a1a24] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-white">Budget-Friendly Package</h3>
            <span className="bg-[#3b1659] text-white px-3 py-1 rounded text-sm">15% OFF</span>
          </div>
          
          <div className="mb-4">
            <span className="text-gray-400 line-through mr-2">$1,985</span>
            <span className="text-white">$1,687</span>
          </div>

          <button className="w-full bg-[#e000ff] text-white py-3 rounded-lg mb-6">
            Select Package
          </button>

          <div>
            <h4 className="text-[#4a5073] text-sm font-semibold mb-4">INCLUDED SERVICES</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">CoinGecko Listing</span>
                <span className="text-[#4a5073]">$650</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">GeckoTerminal Pool Trends</span>
                <span className="text-[#4a5073]">$300</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">DEXScreener - Boost 30x</span>
                <span className="text-[#4a5073]">$235</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">Reddit Campaign (Multiple subreddits and trends)</span>
                <span className="text-[#4a5073]">$400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">Bitcointalk Post w/ Images</span>
                <span className="text-[#4a5073]">$180</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">Telegram Reactions (1000)</span>
                <span className="text-[#4a5073]">$70 per 1000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">DEX Screener Fire & Rocket Emojis</span>
                <span className="text-[#4a5073]">$150 per 1000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Baller Package */}
        <div className="bg-[#1a1a24] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-white">Baller Package</h3>
            <span className="bg-[#3b1659] text-white px-3 py-1 rounded text-sm">15% OFF</span>
          </div>
          
          <div className="mb-4">
            <span className="text-gray-400 line-through mr-2">$16,930</span>
            <span className="text-white">$14,390</span>
          </div>

          <button className="w-full bg-[#8000ff] text-white py-3 rounded-lg mb-6">
            Select Package
          </button>

          <div>
            <h4 className="text-[#4a5073] text-sm font-semibold mb-4">INCLUDED SERVICES</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">CoinMarketCap Fast Listing</span>
                <span className="text-[#4a5073]">$5,700</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">CoinGecko Fast Listing</span>
                <span className="text-[#4a5073]">$650</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">CoinMarketCap - Top 10</span>
                <span className="text-[#4a5073]">$6,600</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">Dexscreener Ad – 100k views</span>
                <span className="text-[#4a5073]">$1,850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">GeckoTerminal Pool Trends</span>
                <span className="text-[#4a5073]">$300</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">DEXTools - Nitro 1000</span>
                <span className="text-[#4a5073]">$850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7ce7ff]">Binance Article</span>
                <span className="text-[#4a5073]">$250</span>
              </div>
              
              <button 
                onClick={() => setShowPremiumServices(!showPremiumServices)}
                className="flex items-center text-[#7ce7ff] mt-4 cursor-pointer"
              >
                <span className="mr-2">{showPremiumServices ? '▼' : '▲'}</span>
                <span>+ 6 more premium services</span>
                <span className="ml-auto text-[#4a5073]">See Details</span>
              </button>

              {showPremiumServices && (
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between">
                    <span className="text-[#7ce7ff]">Twitter Followers</span>
                    <span className="text-[#4a5073]">$80 per 1000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7ce7ff]">DEXTools Community Trust Votes</span>
                    <span className="text-[#4a5073]">$250 per 1000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7ce7ff]">DEX Screener Fire & Rocket Emojis</span>
                    <span className="text-[#4a5073]">$150 per 1000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7ce7ff]">Volume Bot</span>
                    <span className="text-[#4a5073]">Custom</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7ce7ff]">Bundle Bot</span>
                    <span className="text-[#4a5073]">Custom</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7ce7ff]">CoinMarketCape Article</span>
                    <span className="text-[#4a5073]">$250</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPackages; 