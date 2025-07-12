import { Moon, Sun, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { useTheme } from "@/context/ThemeContext";

// Base64 encoded placeholder logo for reliability
const FALLBACK_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZiwgMjAyMS8xMS8xNy0xNzoyMzoxOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTEwLTI1VDE1OjA2OjA4KzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMC0yNVQxNTowNjozOSswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0xMC0yNVQxNTowNjozOSswMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozZWNjMWFkMS1lZjc2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";

// SVG components for social media icons
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const Header = () => {
  const [logoError, setLogoError] = useState(false);
  const [fallbackLogo, setFallbackLogo] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Set a fallback logo for reliability
    setFallbackLogo(FALLBACK_LOGO);
  }, []);

  return (
    <header className="bg-background border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 relative group">
            <div className="absolute inset-0 bg-brand/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-brand"></div>
            <img 
              src={logoError ? fallbackLogo || FALLBACK_LOGO : "/branding/logo.png"} 
              alt="Boost Labs" 
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              onError={() => setLogoError(true)}
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
        <div className="flex items-center space-x-2">
          <a 
            href="https://x.com/BoostLabs0x" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Follow us on Twitter/X"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-800 hover:text-brand transition-colors"
            >
              <TwitterIcon />
            </Button>
          </a>
          <a 
            href="https://t.me/BoostLabsSupport" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Contact us on Telegram"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-800 hover:text-brand transition-colors"
            >
              <TelegramIcon />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
