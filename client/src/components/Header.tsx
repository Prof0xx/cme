import { Moon, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-background border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 relative group">
            <div className="absolute inset-0 bg-brand/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-brand"></div>
            <img 
              src="/branding/logo.png" 
              alt="Boost Labs" 
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h1 className="ml-3 text-xl font-heading font-bold text-white flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-dark">Boost</span>
            <span className="ml-1 flex items-center">
              Labs
              <Beaker className="ml-1 h-4 w-4 text-brand-light" />
            </span>
          </h1>
        </div>
        <div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800 hover:text-brand transition-colors">
            <Moon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
