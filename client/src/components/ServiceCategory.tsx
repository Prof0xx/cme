import { ChevronRight } from "lucide-react";
import { categoryConfigs } from "@/data/services";
import { cn } from "@/lib/utils";

interface ServiceCategoryProps {
  category: string;
  minPrice: number | null;
  onSelect: (category: string) => void;
  isActive?: boolean;
}

const ServiceCategory = ({ category, minPrice, onSelect, isActive = false }: ServiceCategoryProps) => {
  const formattedCategory = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Use type assertion to help TypeScript understand our data structure
  const config = categoryConfigs[category as keyof typeof categoryConfigs] || {
    icon: 'list',
    bgColor: 'bg-blue-900',
    iconColor: 'text-blue-400'
  };

  // Format the icon name for use with Font Awesome
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'list':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        );
      case 'arrow-trend-up':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        );
      case 'newspaper':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
            <path d="M18 14h-8"></path>
            <path d="M15 18h-5"></path>
            <path d="M10 6h8v4h-8V6Z"></path>
          </svg>
        );
      case 'chart-line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="m19 9-5 5-4-4-3 3"></path>
          </svg>
        );
      case 'robot':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
            <line x1="8" y1="16" x2="8" y2="16"></line>
            <line x1="16" y1="16" x2="16" y2="16"></line>
          </svg>
        );
      case 'rocket':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return 'Custom';
    return `$${price}+`;
  };

  return (
    <div 
      onClick={() => onSelect(category)}
      className={cn(
        "category-tab card-hover bg-background-card rounded-xl p-5 cursor-pointer transition-all duration-300 overflow-hidden relative group",
        isActive 
          ? "border-2 border-brand shadow-glow-lg category-tab active" 
          : "border border-gray-800 hover:border-brand/50"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={cn(
            "rounded-lg p-3 shadow-md",
            config.bgColor,
            isActive ? "animate-pulse-brand" : ""
          )}>
            <span className={config.iconColor}>
              {getIconComponent(config.icon)}
            </span>
          </div>
          <h3 className={cn(
            "text-xl font-heading font-medium ml-3",
            isActive ? "text-white" : "text-gray-200"
          )}>
            {formattedCategory}
          </h3>
        </div>
        <ChevronRight className={cn(
          "h-5 w-5 transition-transform duration-300",
          isActive ? "text-brand -rotate-45" : "text-gray-500 group-hover:text-brand group-hover:translate-x-1"
        )} />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className={cn(
          "text-sm",
          isActive ? "text-secondary font-medium" : "text-gray-400"
        )}>
          Starting from
        </span>
        <span className={cn(
          "font-medium",
          isActive ? "text-secondary" : "price-tag"
        )}>
          {formatPrice(minPrice)}
        </span>
      </div>
    </div>
  );
};

export default ServiceCategory;
