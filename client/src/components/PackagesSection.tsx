import { useStrategyBoard } from "../context/StrategyBoardContext";
import { Button } from "./ui/button";
import { packageDetails, ballerPackage, budgetPackage } from "../data/packages";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const formatPrice = (price: number | string | null) => {
  if (price === null) return '$0';
  if (typeof price === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  return price;
};

const PackagesSection = () => {
  const context = useStrategyBoard();
  const [showMoreServices, setShowMoreServices] = useState(false);

  // If context is not available, render without select functionality
  const handleSelectPackage = (type: 'budget' | 'baller') => {
    if (context) {
      context.selectPackage(type);
    } else {
      console.warn('StrategyBoard context not available');
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-white mb-6">Prebuilt Packages</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget-Friendly Package */}
        <div className="bg-dark-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${packageDetails.budget.className} p-6`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">Budget-Friendly Package</h3>
              <span className={`${packageDetails.budget.discountBadgeClassName} text-xs font-medium px-2 py-1 rounded-full`}>10% OFF</span>
            </div>
            <div className="flex items-baseline mb-4">
              <span className="text-gray-400 text-lg line-through mr-2">{formatPrice(packageDetails.budget.originalPrice)}</span>
              <span className="text-white text-2xl font-bold">{formatPrice(packageDetails.budget.discountedPrice)}</span>
            </div>
            <Button
              onClick={() => handleSelectPackage('budget')}
              className={`w-full py-3 ${packageDetails.budget.buttonClassName} transition text-white rounded-lg font-medium`}
            >
              Select Package
            </Button>
          </div>
          <div className="p-6">
            <h4 className="text-gray-400 text-sm uppercase font-medium mb-3">Included Services</h4>
            <ul className="space-y-3">
              {budgetPackage.map((service, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-300">{service.name}</span>
                  <span className="text-gray-400">{formatPrice(service.price)}</span>
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
              <span className={`${packageDetails.baller.discountBadgeClassName} text-xs font-medium px-2 py-1 rounded-full`}>10% OFF</span>
            </div>
            <div className="flex items-baseline mb-4">
              <span className="text-gray-400 text-lg line-through mr-2">{formatPrice(packageDetails.baller.originalPrice)}</span>
              <span className="text-white text-2xl font-bold">{formatPrice(packageDetails.baller.discountedPrice)}</span>
            </div>
            <Button
              onClick={() => handleSelectPackage('baller')}
              className={`w-full py-3 ${packageDetails.baller.buttonClassName} transition text-white rounded-lg font-medium`}
            >
              Select Package
            </Button>
          </div>
          <div className="p-6">
            <h4 className="text-gray-400 text-sm uppercase font-medium mb-3">Included Services</h4>
            <ul className="space-y-3">
              {ballerPackage.slice(0, 7).map((service, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-300">{service.name}</span>
                  <span className="text-gray-400">{formatPrice(service.price)}</span>
                </li>
              ))}
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
                  {ballerPackage.slice(7).map((service, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-400">{service.name}</span>
                      <span className="text-gray-500">{formatPrice(service.price)}</span>
                    </li>
                  ))}
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
