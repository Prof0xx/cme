import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { StrategyBoardProvider } from "./context/StrategyBoardContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StrategyBoardProvider>
          <div className="app-container">
            <Toaster />
            <Router />
          </div>
        </StrategyBoardProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
