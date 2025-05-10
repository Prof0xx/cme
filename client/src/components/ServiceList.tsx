import { ArrowLeft, Info, Image, ExternalLink, Flame, Rocket, Beaker, Zap, HelpCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStrategyBoard } from "@/context/StrategyBoardContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { type SelectedService } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";
import { TagBadge } from "@/components/TagBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { services } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Sample fallback data for different categories
const fallbackServices = {
  'listings': [
    {
      id: 1,
      category: 'listings',
      name: 'CoinGecko Listing',
      price: 2000,
      description: 'Get your token listed on CoinGecko to increase visibility and legitimacy.',
      example_type: 'link',
      example_content: 'https://www.coingecko.com/'
    },
    {
      id: 2,
      category: 'listings',
      name: 'CoinMarketCap Listing',
      price: 2500,
      description: 'Professional assistance with listing your token on CoinMarketCap.',
      example_type: 'link',
      example_content: 'https://coinmarketcap.com/'
    }
  ],
  'trendings': [
    {
      id: 3,
      category: 'trendings',
      name: 'CoinGecko Trending',
      price: 5000,
      description: 'Get your token trending on CoinGecko.',
      example_type: 'link',
      example_content: 'https://www.coingecko.com/en/discover'
    }
  ],
  'dex-boosts': [
    {
      id: 4,
      category: 'dex-boosts',
      name: 'DEX Volume Boost',
      price: 3000,
      description: 'Increase your token visibility with DEX volume boost.',
      example_type: 'link',
      example_content: 'https://info.uniswap.org/'
    }
  ],
  'botting': [
    {
      id: 5,
      category: 'botting',
      name: 'Twitter Engagement Bot',
      price: 1500,
      description: 'Bot-driven engagement for your Twitter posts.',
      example_type: 'link',
      example_content: 'https://twitter.com/'
    }
  ]
};

interface ServiceListProps {
  category: string;
  onBack: () => void;
}

const ServiceList = ({ category, onBack }: ServiceListProps) => {
  const { addToBoard, isItemSelected } = useStrategyBoard();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Fetch services from the API
  const { data: servicesData, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['services', category],
    queryFn: async () => {
      console.log(`Fetching services for category: ${category}`);
      try {
        const data = await services.getByCategory(category);
        console.log(`Services fetched successfully:`, data);
        return data;
      } catch (err) {
        console.error(`Error fetching services for ${category}:`, err);
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000
  });

  // After 5 seconds of loading or on error, fall back to sample data
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isLoading) {
      timeout = setTimeout(() => {
        if (isLoading) {
          console.log("Falling back to sample data due to long loading time");
          setUseFallback(true);
        }
      }, 5000);
    }
    
    if (isError) {
      console.log("Falling back to sample data due to error");
      setUseFallback(true);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading, isError]);

  const formattedCategory = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const formatPrice = (price: string | number) => {
    if (price === "tbd") return "TBD";
    if (price === "Custom") return "Custom Price";
    if (typeof price === "string" && price.includes("-")) {
      const [min, max] = price.split("-");
      return `$${min.trim()}-$${max.trim()}`;
    }
    return typeof price === "number" ? `$${price}` : `$${price}`;
  };

  const isPriceTBD = (price: string | number) => {
    return price === "tbd";
  };

  // Get an icon based on category
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'listings':
        return <Zap className="h-5 w-5 text-brand" />;
      case 'trendings':
        return <Flame className="h-5 w-5 text-brand" />;
      case 'dex-boosts':
        return <Rocket className="h-5 w-5 text-brand" />;
      case 'botting':
        return <Beaker className="h-5 w-5 text-brand" />;
      default:
        return <Flame className="h-5 w-5 text-brand" />;
    }
  };

  // Function to handle different image path formats
  const getImagePath = (path: string | undefined): string => {
    if (!path) return '';
    
    // If the path already starts with /service-examples/, use it as is
    if (path.startsWith('/service-examples/')) {
      return path;
    }
    
    // If path starts with attached_assets/, replace with /service-examples/
    if (path.startsWith('attached_assets/')) {
      return `/service-examples/${path.replace('attached_assets/', '')}`;
    }
    
    // Default: assume the filename is directly in service-examples
    return `/service-examples/${path}`;
  };

  // Get services based on API data or fallback
  const getDisplayServices = () => {
    if (useFallback && fallbackServices[category as keyof typeof fallbackServices]) {
      return { 
        services: fallbackServices[category as keyof typeof fallbackServices],
        totalPrice: fallbackServices[category as keyof typeof fallbackServices].reduce(
          (sum, service) => sum + (typeof service.price === 'number' ? service.price : 0), 0
        )
      };
    }
    
    return servicesData;
  };

  // Handle retry
  const handleRetry = () => {
    setUseFallback(false);
    refetch();
  };

  const displayData = getDisplayServices();

  if (isLoading && !useFallback) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-brand hover:text-brand-dark">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="space-y-4">
          <div className="text-center mb-4">Loading services...</div>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError && !useFallback) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-brand hover:text-brand-dark">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error loading services</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load services for this category."}
          </AlertDescription>
        </Alert>
        <Button onClick={handleRetry} variant="default" className="mb-4">
          Retry
        </Button>
        <Button onClick={() => setUseFallback(true)} variant="outline" className="ml-2 mb-4">
          Use Sample Data
        </Button>
      </div>
    );
  }

  if ((!displayData?.services || displayData.services.length === 0) && !useFallback) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-brand hover:text-brand-dark">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="text-center">No services found in this category.</div>
        <div className="mt-4 text-center">
          <Button onClick={() => setUseFallback(true)} variant="outline">
            View Sample Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-10">
      <Button
        onClick={onBack}
        variant="outline"
        className="mr-3 mb-4 bg-background border-gray-800 hover:border-brand hover:text-brand rounded-full p-2" 
        size="icon"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <SectionHeader 
        title={`${formattedCategory} Services`} 
        icon={getCategoryIcon(category)}
      />

      {useFallback && (
        <Alert className="mb-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Using sample data</AlertTitle>
          <AlertDescription>
            Displaying sample services as we couldn't load the real data.
            <Button onClick={handleRetry} variant="link" className="underline ml-2 p-0">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {displayData && displayData.services && displayData.services.length > 0 ? (
          displayData.services.map((service: any, index: number) => {
            const serviceItem: SelectedService = {
              category: service.category,
              name: service.name,
              price: service.price
            };
            
            const isSelected = isItemSelected(service.category, service.name);
            const hasDescription = Boolean(service.description);
            const hasExample = Boolean(service.example_content);
            const isTBD = isPriceTBD(service.price);
            
            return (
              <Card 
                key={index} 
                variant={isSelected ? "branded" : "default"}
                className={`card-hover ${isSelected ? 'active-item shadow-glow' : ''}`}
              >
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CardTitle className="flex items-center multi-line">
                        {getCategoryIcon(service.category)}
                        <span className="ml-2">{service.name}</span>
                      </CardTitle>
                      {isSelected && (
                        <TagBadge label="Added" type="brand" />
                      )}
                    </div>
                    {isTBD ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="tbd flex items-center">
                              <span>{formatPrice(service.price)}</span>
                              <HelpCircle className="ml-1 h-3 w-3" />
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Price to be determined based on project requirements</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <p className="price-tag font-medium">
                        {formatPrice(service.price)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {hasDescription && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-400 hover:text-brand hover:border-brand transition-colors"
                        onClick={() => {
                          setSelectedService(service);
                          setIsDescriptionOpen(true);
                        }}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">View Description</span>
                      </Button>
                    )}
                    {service.example_type && service.example_content && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-400 hover:text-brand hover:border-brand transition-colors"
                        onClick={() => {
                          setSelectedService(service);
                          setIsExampleOpen(true);
                        }}
                      >
                        {service.example_type === 'image' ? (
                          <>
                            <Image className="h-4 w-4" />
                            <span className="sr-only">View Image Example</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Live Example</span>
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      onClick={() => !isSelected && addToBoard(serviceItem)}
                      variant={isSelected ? "secondary" : "default"}
                      className={isSelected ? 
                        "bg-gray-700 text-gray-300 cursor-not-allowed flex-1 sm:flex-none" : 
                        "btn-primary flex-1 sm:flex-none"
                      }
                      disabled={isSelected}
                    >
                      {isSelected ? 'Added' : 'Add to Formula'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card variant="outline" className="border-gray-800">
            <CardContent className="py-4 text-gray-400">
              No services found in this category.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Description Dialog */}
      <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <DialogContent className="bg-background-card text-white border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading flex items-center justify-between">
              <span className="flex items-center gap-2">
                {selectedService && getCategoryIcon(selectedService.category)}
                {selectedService?.name}
              </span>
              <span className={isPriceTBD(selectedService?.price) ? "tbd" : "text-secondary"}>
                {formatPrice(selectedService?.price)}
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-4 leading-relaxed">
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Example Dialog */}
      <Dialog open={isExampleOpen} onOpenChange={setIsExampleOpen}>
        <DialogContent className="bg-background-card text-white border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading mb-4">
              {selectedService?.name} Example
            </DialogTitle>
          </DialogHeader>
          <div>
            {selectedService?.example_type === 'image' ? (
              <img 
                src={getImagePath(selectedService?.example_content)} 
                alt={`${selectedService?.name} example`} 
                className="w-full rounded-md border border-gray-800"
                onError={(e) => {
                  // If image fails to load, set a placeholder or default image
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Available';
                }}
              />
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-gray-300 mb-4">Visit the live example:</p>
                <Button 
                  variant="default" 
                  className="btn-primary"
                  onClick={() => window.open(selectedService?.example_content, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Live Example
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServiceList;
