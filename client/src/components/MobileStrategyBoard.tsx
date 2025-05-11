import { useState } from "react";
import { useStrategyBoard } from "@/context/StrategyBoardContext";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";

interface MobileStrategyBoardProps {
  onExpressInterest: () => void;
}

const MobileStrategyBoard = ({ onExpressInterest }: MobileStrategyBoardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { 
    selectedItems, 
    removeFromBoard, 
    clearBoard, 
    getSubtotal, 
    getDiscount, 
    getTotal,
    isPackageSelected 
  } = useStrategyBoard();

  const hasItems = selectedItems.length > 0;
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  // Scroll to categories section
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
      setExpanded(false); // Close the mobile board after scrolling
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-dark-900 border-t border-gray-800 shadow-lg">
      {!expanded ? (
        <div className="p-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-400">Selected:</span>
            <span className="text-white font-medium ml-1">
              {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-white font-medium mr-3">${total.toLocaleString()}</span>
            <Button
              onClick={() => setExpanded(true)}
              className="px-4 py-2 bg-primary hover:bg-primary-dark transition text-white rounded-lg font-medium text-sm"
            >
              View Board
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-[80vh] p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Your Strategy Board</h2>
            <button 
              onClick={() => setExpanded(false)} 
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-grow mb-4">
            {!hasItems ? (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                    <path d="M12 9v6"></path>
                    <path d="M9 12h6"></path>
                  </svg>
                </div>
                <p className="text-gray-500 text-center">Your strategy board is empty</p>
                <p className="text-gray-600 text-sm text-center mt-1">Select services to add them here</p>
                <Button 
                  variant="outline" 
                  className="text-brand border-brand/40 hover:bg-brand/10 hover:shadow-glow mt-4"
                  onClick={scrollToCategories}
                >
                  Start building your strategy <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div key={index} className="bg-dark-800 rounded-lg p-3 flex justify-between">
                    <div>
                      <h4 className="text-white text-sm">{item.name}</h4>
                      <p className="text-gray-400 text-xs">
                        {typeof item.price === 'number' ? `$${item.price}` : item.price}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromBoard(index)}
                      className="text-gray-500 hover:text-red-500 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-800 pt-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">${subtotal.toLocaleString()}</span>
            </div>
            {isPackageSelected && (
              <div className="flex justify-between mb-2">
                <span className="text-green-500">Discount (15%)</span>
                <span className="text-green-500">-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-white">Total</span>
              <span className="text-white">${total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={onExpressInterest}
              disabled={!hasItems}
              className="w-full py-6 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition text-white rounded-lg font-medium"
            >
              Express Interest
            </Button>
            <Button
              onClick={() => clearBoard()}
              disabled={!hasItems}
              variant="outline"
              className="w-full py-6 bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-primary/30 transition rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Board
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileStrategyBoard;
