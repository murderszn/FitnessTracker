import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import Goals from "@/pages/Goals";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard">
          <main className="container mx-auto px-4 py-6">
            <Dashboard />
          </main>
        </Route>
        <Route path="/history">
          <main className="container mx-auto px-4 py-6">
            <History />
          </main>
        </Route>
        <Route path="/goals">
          <main className="container mx-auto px-4 py-6">
            <Goals />
          </main>
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;