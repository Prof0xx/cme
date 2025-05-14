import { useState, useEffect } from "react";
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

// Direct imports of logo images
import dextoolsLogo from "../assets/dext.png";
import dexScreenerLogo from "../assets/dex.png";
import pinkSaleLogo from "../assets/pink.png";

// Base64 encoded fallback logos for partners
const FALLBACK_DEXTOOLS = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABEUlEQVR4nO2ZMQ6DMAxFuQOVekZW7sDACXoBll7F7VDSgc2HPAu1UtOkJBZ88hCSPxHJl2cDlpVSKpVKRQLoADfQA82Cc4+Yi8QCWkTynBvtI3Kj58zBO6J9JKKkJeZEIJCsdxGJgMZGxIN+RH+rld3XuVciE7DfQKTn+aEbkez3VZM6B9vRn7YNBaJ9JKKkJeZEIJDm1cg/0s97JXIOt4NIr0oJgdb5HF2TOs0r4fsxPkSKbiO20l36xNwjIqndimT3QlNrYyXNI1J0ID1iDnvX3moFPgdSfhvZI+awN7anbSQgkLaRXUSS45+UnUBqt9Kt3QqBRNcoQNr1G9tGKkiqViqVSiUYFx8T+R2dvLkdAAAAAElFTkSuQmCC";
const FALLBACK_DEXSCREENER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACJUlEQVR4nO2aMU8UQRiG33sJBIdESENFQYKFUFIYC42WVPofbCj5BUQKS0IJNCbGmh9AYSU0JsRQaCLRSCxITEiAsNz5GN/gsjd7e7t3O7t7y32TlTs733zzPjvzze5MLoerCeBy4BpwA5gHukCICsAqsAPsAVupkJoG3lEOb1MhdK0y0Qd+AB+BR8AUsJoEsce/S2dgDJgDWsCvOIdDT0LeAlsxv02NqwBs+hCpKRMtg30+JHJnQUhsRApx+xm3eu4sCWnbhMySENtoAk+An6nldRb4X0IP8C5kz1U9qRntZAKGDboXQKNCoSawUGVGXgDjETFGgafAwUUIwan3jUwopRZrYSG6V6rx3ivZtYBvFQnpW7JrAQfeLfKJ2Ham7PrArndLPgHTBtvnQKcCoX2g7d2SO8AHYExM5Hgf6ZYspAe8BlreM7HBaqCYYTB1sODYM+FBCICPwHvgA3BPCeGddcEpnrD0AVJBCLwNRMTpAm+GkWnpwwvtQIScb8BDYBJYAVYkG7KuWfHcoFuKhJw2cE9E5IDrMgL1kBJKXnbKRf8BHAMNxdaQNspFugtckJB7gdSiB/h35gagFZqBpsh2lKnrlFMDmA0JQmNKXshDDSrE6LXvJLLypkGl5YVo94BHwGtJryMjcxB1Iy06dtISSkkehIpA9jH9Aj7JW0pnzM7PRcSomcuaNmWQFPkW/QKYUNU6kFf0NnByzqa3FnJ7xY3ru/RXWwOoBRowFuO1AAAAAElFTkSuQmCC"; 
const FALLBACK_PINKSALE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEA0lEQVR4nO2aW4hVVRjHf+fMOINkpimZSRcVLBQvy7QIgqK7dKGHoi6UkC9FGPQQQRrSgw8+REVgQb1EXaAeKpAeoii6QWVQUYJYoqKWynibuXj+fPs71HYfc/Y+Z+2ZM9r54Vl77bP2/tb37fVd1odOOumkk/8hgDHAcuAQ0KHt17DvSqAnahR4BjgBdKdsR8VbjNNR4HVgTJAkEwrfCjwZwrn4lgIP6/9UYD3wewr7LPCcvhEj4BpgH/AJ0JzGwcQvEu8Y4GlgN/AZ8GCU0sFjwBZgoYVOY4yB+cDbwCFgPfBAkNTBoyz4M/AycGM5xloMGAssBjbJ6V7gsSDJg8cu4d8BrwA3p2NouoW6gVnAxsD5A8G7Md4SYJvwm1UNB4M5wB7hN6qX/Js0iTnAv8DzwI3AQ8A+4X8HJgbX+A6Zr5F7WvjDwLPAzcAC4Gfhu7WfCHzI2YTbFfoFCu+dOrj8lNZPZmF4LvCXcGeDGujWseVJYe8K2wuMDzz+5gg/CCyTspMLv5zR7pFvlv1SCL0uHXzlQ8iQxsl0YalC+0dhJ4QdkM3PETYZZTS8pQv7+cKKwqcWcd6n8+uhul8a3h7hXxY+kGWeM0LI9eqZI8L3CzslfETYX8JuE9anF1irAe+ScD8VXpOFDDmO0D4J2Qu8boxqmwfrP0U28NUxyDJH1tEnirLpUIaIzKYTGW/fCDuRsDNaLxb2iLD9wm4Jzbu2Fo/szdLB8BLXnuYp7qCe6dtejMGN0iX2XNrYhyWkPvA9gZOQxandGgBL6hsw/ag2n0ls1LG8r8iSVENCakCfAuuWBC5s9JpXMlp1Bv9XJL9kNMmQRgzTOjaBN2TakRQnK8GfFvZ4TtdvRrbPmobZ98fn/B5P4AN57kgSOpRDRDNwJkc7+11zbqzltoOvP8fHPJtYGokMvbzucoh4zhJBssOcr+VqoaZnLLyvKUaTdnZmoDGfjPkqy9elLHTPp06492p3z0NdJjZcXqdClsUU0qPvzKxqF23bVEmjJLEtxXN36BvzdexZjNC4mZ1ZmHPP9WmoA67PaxzzBXTIkPuA1/Qes2ttwDwhlpdo/Wbrb0GC6uq9Y+ptkVc+aSBsFCtnZMCy5FPuOWPVPQNCJqljbLT6W+aehWVKUfT1ml0GK9tkXzyIYvcncs1i971xvHrO35zjmImao55hv76MUwOSEwplG3qqy7Htr+lNsvBnqr1WR+06Na1n+pXbJcPFSjlmJpjqsHLNLpXJ3WX+fjFiZojnwpI1VxnC/hE7qi4R15xvqlmLVRKvpCQPpHx7MUrfGwtHqWfaR9S64BK/WBGlN9TebnpiLHX8JlDM4XtFp5NOOumkE0XHf1Ua7PxHQMbbAAAAAElFTkSuQmCC";

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
  
  // State for partner logo loading errors
  const [dextoolsError, setDextoolsError] = useState(false);
  const [dexScreenerError, setDexScreenerError] = useState(false);
  const [pinkSaleError, setPinkSaleError] = useState(false);

  // Debug logging for partner images
  useEffect(() => {
    console.log("Partner logos imported:");
    console.log("DEXTools:", dextoolsLogo || "Not loaded");
    console.log("DEX Screener:", dexScreenerLogo || "Not loaded");
    console.log("PinkSale:", pinkSaleLogo || "Not loaded");
  }, []);

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
                        <div className="bg-gray-800 p-4 rounded-xl w-40 h-24 flex items-center justify-center border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-lg relative">
                          <img 
                            src={dextoolsLogo}
                            alt="DEXTools" 
                            className="max-w-full max-h-full object-contain z-10"
                            onLoad={() => console.log("DEXTools logo loaded successfully")}
                            onError={(e) => {
                              console.error("DEXTools logo failed to load:", e);
                              setDextoolsError(true);
                            }}
                          />
                        </div>
                        <span className="mt-2 text-gray-300 font-medium">DEXTools</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 p-4 rounded-xl w-40 h-24 flex items-center justify-center border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-lg relative">
                          <img 
                            src={dexScreenerLogo}
                            alt="DEX Screener" 
                            className="max-w-[105%] max-h-[105%] scale-110 object-contain z-10"
                            onLoad={() => console.log("DEX Screener logo loaded successfully")}
                            onError={(e) => {
                              console.error("DEX Screener logo failed to load:", e);
                              setDexScreenerError(true);
                            }}
                          />
                        </div>
                        <span className="mt-2 text-gray-300 font-medium">DEX Screener</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 p-4 rounded-xl w-40 h-24 flex items-center justify-center border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-lg relative">
                          <img 
                            src={pinkSaleLogo}
                            alt="PinkSale" 
                            className="max-w-full max-h-full object-contain z-10"
                            onLoad={() => console.log("PinkSale logo loaded successfully")}
                            onError={(e) => {
                              console.error("PinkSale logo failed to load:", e);
                              setPinkSaleError(true);
                            }}
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
