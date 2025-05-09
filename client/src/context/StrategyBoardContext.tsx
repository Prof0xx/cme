import { createContext, useContext, useState, ReactNode } from "react";
import { type SelectedService } from "@shared/schema";
import { budgetPackage, ballerPackage } from "@/data/packages";

type PackageType = "budget" | "baller" | null;

interface StrategyBoardContextType {
  selectedItems: SelectedService[];
  addToBoard: (service: SelectedService) => void;
  removeFromBoard: (index: number) => void;
  clearBoard: () => void;
  selectPackage: (packageType: PackageType) => void;
  isPackageSelected: boolean;
  appliedPackage: PackageType;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  isItemSelected: (category: string, name: string) => boolean;
}

const StrategyBoardContext = createContext<StrategyBoardContextType | undefined>(undefined);

export function StrategyBoardProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<SelectedService[]>([]);
  const [isPackageSelected, setIsPackageSelected] = useState(false);
  const [appliedPackage, setAppliedPackage] = useState<PackageType>(null);

  // Add a service to the strategy board
  const addToBoard = (service: SelectedService) => {
    // Check if already in board
    const existingIndex = selectedItems.findIndex(item => 
      item.category === service.category && item.name === service.name
    );

    if (existingIndex === -1) {
      setSelectedItems(prev => [...prev, service]);
      
      // If a package was selected, we're now customizing it
      if (isPackageSelected) {
        setIsPackageSelected(false);
      }
    }
  };

  // Remove a service from the strategy board
  const removeFromBoard = (index: number) => {
    setSelectedItems(prev => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });
    
    // If a package was selected, we're now customizing it
    if (isPackageSelected) {
      setIsPackageSelected(false);
      setAppliedPackage(null);
    }
  };

  // Clear the strategy board
  const clearBoard = () => {
    setSelectedItems([]);
    setIsPackageSelected(false);
    setAppliedPackage(null);
  };

  // Select a prebuilt package
  const selectPackage = (packageType: PackageType) => {
    if (!packageType) {
      clearBoard();
      return;
    }

    if (packageType === 'budget') {
      setSelectedItems([...budgetPackage]);
    } else if (packageType === 'baller') {
      setSelectedItems([...ballerPackage]);
    }
    
    setIsPackageSelected(true);
    setAppliedPackage(packageType);
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return selectedItems.reduce((sum, item) => {
      // Handle different price formats
      if (typeof item.price === 'number') {
        return sum + item.price;
      } else if (typeof item.price === 'string') {
        const priceLower = item.price.toLowerCase();
        
        // Skip any price containing 'tbd' or 'custom'
        if (priceLower.includes('tbd') || priceLower.includes('custom')) {
          return sum;
        }
        
        // Handle price ranges like "200-400"
        if (item.price.includes('-')) {
          const [min] = item.price.split('-');
          return sum + parseInt(min.replace(/\D/g, ''));
        }
        
        // Try to extract number (only for non-TBD prices)
        const match = item.price.match(/\d+/);
        if (match) {
          return sum + parseInt(match[0]);
        }
      }
      return sum;
    }, 0);
  };

  // Calculate discount (15% if package is selected)
  const getDiscount = () => {
    return isPackageSelected ? getSubtotal() * 0.15 : 0;
  };

  // Calculate total
  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };

  // Check if a service is already selected
  const isItemSelected = (category: string, name: string) => {
    return selectedItems.some(item => 
      item.category === category && item.name === name
    );
  };

  return (
    <StrategyBoardContext.Provider value={{
      selectedItems,
      addToBoard,
      removeFromBoard,
      clearBoard,
      selectPackage,
      isPackageSelected,
      appliedPackage,
      getSubtotal,
      getDiscount,
      getTotal,
      isItemSelected,
    }}>
      {children}
    </StrategyBoardContext.Provider>
  );
}

export function useStrategyBoard() {
  const context = useContext(StrategyBoardContext);
  if (context === undefined) {
    throw new Error("useStrategyBoard must be used within a StrategyBoardProvider");
  }
  return context;
}
