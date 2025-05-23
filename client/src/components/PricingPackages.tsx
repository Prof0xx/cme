import React from 'react';
import { useStrategyBoard } from "../context/StrategyBoardContext";
import { Button } from "./ui/button";
import { packageDetails, ballerPackage, budgetPackage } from "../data/packages";

const PricingPackages: React.FC = () => {
  const context = useStrategyBoard();

  // Calculate total prices
  const budgetTotal = Object.values(budgetPackage).reduce((sum, service) => {
    if (typeof service.price === 'number') {
      return sum + service.price;
    }
    return sum;
  }, 0);

  const ballerTotal = Object.values(ballerPackage).reduce((sum, service) => {
    if (typeof service.price === 'number') {
      return sum + service.price;
    }
    return sum;
  }, 0);

  const discountedBudgetTotal = budgetTotal * 0.9;
  const discountedBallerTotal = ballerTotal * 0.9;

  const handleSelectPackage = (type: 'budget' | 'baller') => {
    if (context) {
      context.selectPackage(type);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Prebuilt Packages</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget-Friendly Package */}
        <div className="bg-[#1a1a24] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-white">Budget-Friendly Package</h3>
            <span className="bg-[#3b1659] text-white px-3 py-1 rounded text-sm">10% OFF</span>
          </div>
          
          <div className="mb-4">
            <span className="text-gray-400 line-through mr-2">${budgetTotal.toLocaleString()}</span>
            <span className="text-white">${discountedBudgetTotal.toLocaleString()}</span>
          </div>

          <Button
            onClick={() => handleSelectPackage('budget')}
            className="w-full bg-[#e000ff] text-white py-3 rounded-lg mb-6"
          >
            Select Package
          </Button>

          <div>
            <h4 className="text-[#4a5073] text-sm font-semibold mb-4">INCLUDED SERVICES</h4>
            <div className="space-y-3">
              {budgetPackage.map((service, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-[#7ce7ff]">{service.name}</span>
                  <span className="text-[#4a5073]">
                    {typeof service.price === 'number' 
                      ? `$${service.price.toLocaleString()}`
                      : service.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Baller Package */}
        <div className="bg-[#1a1a24] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-white">Baller Package</h3>
            <span className="bg-[#3b1659] text-white px-3 py-1 rounded text-sm">10% OFF</span>
          </div>
          
          <div className="mb-4">
            <span className="text-gray-400 line-through mr-2">${ballerTotal.toLocaleString()}</span>
            <span className="text-white">${discountedBallerTotal.toLocaleString()}</span>
          </div>

          <Button
            onClick={() => handleSelectPackage('baller')}
            className="w-full bg-[#8000ff] text-white py-3 rounded-lg mb-6"
          >
            Select Package
          </Button>

          <div>
            <h4 className="text-[#4a5073] text-sm font-semibold mb-4">INCLUDED SERVICES</h4>
            <div className="space-y-3">
              {ballerPackage.map((service, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-[#7ce7ff]">{service.name}</span>
                  <span className="text-[#4a5073]">
                    {typeof service.price === 'number' 
                      ? `$${service.price.toLocaleString()}`
                      : service.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPackages;
