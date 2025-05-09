import { ArrowLeft, Info, Image, ExternalLink, Flame, Rocket, Beaker, Zap, HelpCircle } from "lucide-react";
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
import { useState } from "react";
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

interface ServiceListProps {
  category: string;
  onBack: () => void;
}

const ServiceList = ({ category, onBack }: ServiceListProps) => {
  const { addToBoard, isItemSelected } = useStrategyBoard();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isExampleOpen, setIsExampleOpen] = useState(false);

  // Fetch services from the API
  const { data: servicesData, isLoading, error } = useQuery({
    queryKey: ['services', category],
    queryFn: () => services.getByCategory(category)
  });

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

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div>Error loading services: {(error as Error).message}</div>;
  }

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-brand hover:text-brand-dark">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="text-center">No services found in this category.</div>
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

      <div className="space-y-4">
        {servicesData && servicesData.services.length > 0 ? (
          servicesData.services.map((service: any, index: number) => {
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
