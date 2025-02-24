import { Link, useLocation } from "wouter";
import { Home, History, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/history", label: "History", icon: History },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
];

export default function Navigation() {
  const [location] = useLocation();

  // Don't show navigation on landing page
  if (location === "/") return null;

  return (
    <motion.nav 
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-slate-200/50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <motion.div 
            className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            FitTrack
          </motion.div>

          <div className="flex space-x-2">
            {links.map(({ href, label, icon: Icon }, index) => {
              const isActive = location === href;
              return (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={href}>
                    <a
                      className={cn(
                        "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                        "hover:bg-white/80",
                        isActive && "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md",
                        !isActive && "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 mr-2 transition-colors",
                        isActive ? "text-white" : "text-slate-400"
                      )} />
                      {label}
                    </a>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}