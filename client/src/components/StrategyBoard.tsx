import { useStrategyBoard } from "@/context/StrategyBoardContext";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, ArrowRight, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface StrategyBoardProps {
  onExpressInterest: () => void;
}

const StrategyBoard = ({ onExpressInterest }: StrategyBoardProps) => {
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

  // Check if price is TBD
  const isPriceTBD = (price: string | number) => {
    return price === "tbd" || price === "TBD";
  };

  // Format price display
  const formatPrice = (price: string | number) => {
    if (isPriceTBD(price)) return "TBD";
    if (price === "Custom") return "Custom";
    return typeof price === "number" ? `$${price.toLocaleString()}` : price;
  };

  return (
    <aside className="hidden md:block md:w-[350px] lg:w-[400px] bg-gray-900/90 backdrop-blur-sm border-l border-gray-800 p-5 overflow-y-auto shadow-xl">
      <div className="mb-5">
        <h2 className="text-xl font-heading font-bold text-white mb-1 flex items-center">
          <span className="mr-2">Your Strategy Board</span>
        </h2>
        <p className="text-gray-400 text-sm">Select services to build your marketing plan</p>
      </div>
      
      <div className="mb-6 min-h-[200px]">
        {!hasItems ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <p className="empty-state-text">Your strategy board is empty</p>
            <Button 
              variant="outline" 
              className="text-brand border-brand/40 hover:bg-brand/10 hover:shadow-glow"
            >
              Start building your strategy <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedItems.map((item, index) => (
              <div 
                key={index} 
                className={cn(
                  "bg-background-card rounded-lg p-4 flex justify-between items-center shadow-md border border-gray-800 transition-all duration-200 hover:border-gray-700",
                  index % 2 === 0 ? "bg-background-card" : "bg-dark-900"
                )}
              >
                <div>
                  <h4 className="text-white text-sm font-medium">{item.name}</h4>
                  {isPriceTBD(item.price) ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="tbd flex items-center text-xs mt-1">
                            <span>{formatPrice(item.price)}</span>
                            <HelpCircle className="ml-1 h-3 w-3" />
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Price to be determined based on project requirements</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <p className="price-tag text-xs mt-1">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => removeFromBoard(index)}
                  className="text-gray-500 hover:text-red-500 transition p-1.5 hover:bg-gray-800/80 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasItems && (
        <>
          <div className="space-y-2 mb-6 border-t border-gray-800 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-300">${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-accent">Package Discount</span>
                <span className="text-accent">-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-medium pt-2">
              <span className="text-white">Total</span>
              <span className="text-secondary font-bold">${total.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onExpressInterest}
              disabled={!hasItems}
              className="w-full py-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
            >
              Express Interest
            </Button>
            <Button
              onClick={clearBoard}
              disabled={!hasItems}
              variant="outline"
              className="w-full py-3 bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Board
            </Button>
          </div>
        </>
      )}
    </aside>
  );
};

export default StrategyBoard;
