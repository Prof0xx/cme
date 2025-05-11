import { useStrategyBoard } from "@/context/StrategyBoardContext";
import { Button } from "@/components/ui/button";
import { packageDetails, ballerPackageServices, budgetPackageServices } from "@/data/packages";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const PackagesSection = () => {
  const { selectPackage } = useStrategyBoard();
  const [showMoreServices, setShowMoreServices] = useState(false);
  const [packagePrices, setPackagePrices] = useState<{
    budget: { originalPrice: number; discountedPrice: number };
    baller: { originalPrice: number; discountedPrice: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackagePrices = async () => {
      try {
        const response = await fetch('/api/package-prices');
        if (!response.ok) throw new Error('Failed to fetch package prices');
        const data = await response.json();
        setPackagePrices(data);
      } catch (error) {
        console.error('Error fetching package prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackagePrices();
  }, []);

  // Format price with commas
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-6">Prebuilt Packages</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-900 border border-gray-800 rounded-xl p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="h-10 bg-gray-700 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-4/5"></div>
              </div>
            </div>
          </div>
          <div className="bg-dark-900 border border-gray-800 rounded-xl p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="h-10 bg-gray-700 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
            {packagePrices && (
              <div className="flex items-baseline mb-4">
                <span className="text-gray-400 text-lg line-through mr-2">{formatPrice(packagePrices.budget.originalPrice)}</span>
                <span className="text-white text-2xl font-bold">{formatPrice(packagePrices.budget.discountedPrice)}</span>
              </div>
            )}
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
              {budgetPackageServices.map((service, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-300">{service.name}</span>
                </li>
              ))}
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
            {packagePrices && (
              <div className="flex items-baseline mb-4">
                <span className="text-gray-400 text-lg line-through mr-2">{formatPrice(packagePrices.baller.originalPrice)}</span>
                <span className="text-white text-2xl font-bold">{formatPrice(packagePrices.baller.discountedPrice)}</span>
              </div>
            )}
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
              {ballerPackageServices.slice(0, showMoreServices ? undefined : 7).map((service, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-300">{service.name}</span>
                </li>
              ))}
              {ballerPackageServices.length > 7 && (
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
                    {showMoreServices ? "Hide premium services" : `+ ${ballerPackageServices.length - 7} more premium services`}
                  </span>
                  <span className="text-gray-400">See Details</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
