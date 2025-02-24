import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import Goals from "@/pages/Goals";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

function Router() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-sky-500/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
      </div>
      <Navigation />
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/dashboard">
            <motion.main 
              className="container mx-auto px-6 py-8 relative"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
            >
              <Dashboard />
            </motion.main>
          </Route>
          <Route path="/history">
            <motion.main 
              className="container mx-auto px-6 py-8 relative"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
            >
              <History />
            </motion.main>
          </Route>
          <Route path="/goals">
            <motion.main 
              className="container mx-auto px-6 py-8 relative"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
            >
              <Goals />
            </motion.main>
          </Route>
          <Route path="/analytics">
            <motion.main 
              className="container mx-auto px-6 py-8 relative"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
            >
              <Analytics />
            </motion.main>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
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