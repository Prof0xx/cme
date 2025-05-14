import { useState } from "react";
import Header from "@/components/Header";
import ServiceCategory from "@/components/ServiceCategory";
import ServiceList from "@/components/ServiceList";
import StrategyBoard from "@/components/StrategyBoard";
import MobileStrategyBoard from "@/components/MobileStrategyBoard";
import InterestForm from "@/components/InterestForm";
import SuccessModal from "@/components/SuccessModal";
import RequestServiceModal from "@/components/RequestServiceModal";
import PackagesSection from "@/components/PackagesSection";
import { useStrategyBoard } from "@/context/StrategyBoardContext";
import { Button } from "@/components/ui/button";
import { Flame, Zap, Rocket, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryData {
  categories: string[];
  categoryMinPrices: Record<string, number>;
  services: Record<string, any[]>;
}

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isInterestFormOpen, setIsInterestFormOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRequestServiceModalOpen, setIsRequestServiceModalOpen] = useState(false);
  const { selectedItems, getTotal } = useStrategyBoard();

  // Fetch categories from API
  const { data: categoriesData, isLoading, error } = useQuery<CategoryData>({
    queryKey: ['/api/services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      return response.json();
    }
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleExpressInterest = () => {
    setIsInterestFormOpen(true);
  };

  const handleFormSubmitSuccess = () => {
    setIsInterestFormOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
      <Header />

      <div className="flex-grow flex flex-col md:flex-row">
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-24 md:pb-6">
          {/* Service Categories Section */}
          {!selectedCategory ? (
            <>
              {/* Hero Section */}
              <section className="mb-10">
                <div className="rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border border-gray-700 p-6 md:p-8 relative overflow-hidden">
                  {/* Animated background with sparkles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-4 left-8 w-24 h-24 opacity-20 sparkle-animation">
                      <img src="/branding/sparkles.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute bottom-8 right-12 w-20 h-20 opacity-15 sparkle-animation" style={{ animationDelay: '1.5s' }}>
                      <img src="/branding/sparkles.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute top-1/3 right-1/4 w-16 h-16 opacity-10 sparkle-animation" style={{ animationDelay: '0.8s' }}>
                      <img src="/branding/sparkles.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute bottom-1/3 left-1/3 w-16 h-16 opacity-10 sparkle-animation" style={{ animationDelay: '2.1s' }}>
                      <img src="/branding/sparkles.png" alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16">
                        <img 
                          src="/branding/logo-with-sparkles.png" 
                          alt="Boost Labs" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Boost Your Crypto Project
                      </h1>
                    </div>
                    <p className="text-gray-300 max-w-2xl mb-6 text-lg">
                      Explore our comprehensive range of marketing services designed to help your project gain visibility, traction, and success in the competitive crypto space.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        className="px-6 py-6 bg-primary-600 hover:bg-primary-700 transition text-white rounded-lg font-medium flex items-center shadow-md"
                        onClick={() => window.scrollTo({ top: document.getElementById('categories')?.offsetTop, behavior: 'smooth' })}
                      >
                        <Flame className="mr-2 h-5 w-5" />
                        Explore Services
                      </Button>
                      <Button
                        variant="outline"
                        className="px-6 py-6 bg-gray-800/80 border border-gray-700 hover:bg-gray-800 transition text-white rounded-lg font-medium flex items-center"
                        onClick={() => window.scrollTo({ top: document.getElementById('packages')?.offsetTop, behavior: 'smooth' })}
                      >
                        <Zap className="mr-2 h-5 w-5 text-primary-500" />
                        View Formulas
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12" id="categories">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white flex items-center">
                    <span className="bg-primary-600/20 p-1 rounded-md mr-2">
                      <Flame className="h-5 w-5 text-primary-500" />
                    </span>
                    Service Categories
                  </h2>
                  <div className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">Select to explore</div>
                </div>
                
                {isLoading ? (
                  // Loading state
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                      <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-5 relative">
                        <div className="flex items-center mb-3">
                          <Skeleton className="h-12 w-12 rounded-lg bg-gray-700" />
                          <Skeleton className="h-6 w-32 ml-3 bg-gray-700" />
                        </div>
                        <Skeleton className="h-4 w-full mb-3 bg-gray-700" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-20 bg-gray-700" />
                          <Skeleton className="h-6 w-6 rounded-full bg-gray-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  // Error state
                  <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300">
                    Error loading categories. Please refresh the page and try again.
                  </div>
                ) : categoriesData && categoriesData.categories && categoriesData.categories.length > 0 ? (
                  // Data loaded successfully
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoriesData.categories.map((category: string) => {
                      // Calculate minimum price for the category
                      const servicesInCategory = categoriesData.services[category] || [];
                      const minPrice = servicesInCategory.reduce((min: number, service: any) => {
                        const price = typeof service.price === 'number' ? service.price : 
                          typeof service.price === 'string' && !isNaN(parseInt(service.price)) ? 
                          parseInt(service.price) : Number.MAX_VALUE;
                        return price < min ? price : min;
                      }, Number.MAX_VALUE);

                      return (
                        <ServiceCategory 
                          key={category} 
                          category={category}
                          minPrice={minPrice === Number.MAX_VALUE ? 0 : minPrice}
                          onSelect={handleCategorySelect} 
                        />
                      );
                    })}
                  </div>
                ) : (
                  // No categories found
                  <div className="bg-dark-900 border border-gray-800 rounded-lg p-4 text-gray-400">
                    No service categories available.
                  </div>
                )}
              </section>
              
              {/* Formulas Section */}
              <div id="packages">
                <PackagesSection />
              </div>

              {/* Official Partners Section */}
              <section className="mt-12 mb-12">
                <div className="rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border border-gray-700 p-6 relative overflow-hidden">
                  {/* Subtle background effect */}
                  <div className="absolute -inset-[10px] bg-gradient-to-r from-primary-600/5 via-transparent to-primary-600/5 opacity-30 blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <h3 className="text-2xl font-semibold text-white">Official Partners</h3>
                      <div className="ml-2 h-[1px] w-12 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-900 p-4 rounded-xl w-40 h-24 flex items-center justify-center border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-lg">
                          <img 
                            src="/branding/dext.png" 
                            alt="DEXTools" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span className="mt-2 text-gray-300 font-medium">DEXTools</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-900 p-4 rounded-xl w-40 h-24 flex items-center justify-center border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-lg">
                          <img 
                            src="/branding/dex.png" 
                            alt="DEX Screener" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span className="mt-2 text-gray-300 font-medium">DEX Screener</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-900 p-4 rounded-xl w-40 h-24 flex items-center justify-center border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-lg">
                          <img 
                            src="/branding/pink.png" 
                            alt="PinkSale" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span className="mt-2 text-gray-300 font-medium">PinkSale</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Can't Find What You're Looking For Section */}
              <section className="mt-12 mb-16">
                <div className="rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border border-gray-700 p-6 text-center relative overflow-hidden">
                  <div className="absolute -inset-[10px] bg-gradient-to-r from-accent-600/10 via-purple-600/10 to-accent-600/10 opacity-30 blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-3">Can't Find What You're Looking For?</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                      Need a specific marketing service not listed here? Let us know what you're looking for and we'll get back to you.
                    </p>
                    <Button
                      className="px-6 py-3  bg-primary-600 hover:bg-primary-700 transition text-white rounded-lg font-medium flex items-center mx-auto shadow-md"
                      onClick={() => setIsRequestServiceModalOpen(true)}
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Request a Specific Service
                    </Button>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <ServiceList 
              category={selectedCategory} 
              onBack={handleBackToCategories} 
            />
          )}
        </main>

        {/* Desktop Boost Kit */}
        <StrategyBoard onExpressInterest={handleExpressInterest} />
      </div>

      {/* Mobile Boost Kit */}
      <MobileStrategyBoard onExpressInterest={handleExpressInterest} />

      {/* Interest Form Modal */}
      <InterestForm 
        isOpen={isInterestFormOpen}
        onClose={() => setIsInterestFormOpen(false)}
        onSuccess={handleFormSubmitSuccess}
        selectedServices={selectedItems}
        totalValue={getTotal()}
      />

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      {/* Request Service Modal */}
      <RequestServiceModal
        isOpen={isRequestServiceModalOpen}
        onClose={() => setIsRequestServiceModalOpen(false)}
        onSuccess={() => {
          setIsRequestServiceModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />
    </div>
  );
};

export default Home;
