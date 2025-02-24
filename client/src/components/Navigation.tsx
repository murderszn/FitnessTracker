import { Link, useLocation } from "wouter";
import { Home, History, Target } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/history", label: "History", icon: History },
  { href: "/goals", label: "Goals", icon: Target },
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <motion.nav 
      className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <motion.div 
            className="font-bold text-xl text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            FitTrack
          </motion.div>

          <div className="flex space-x-1">
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
                      className={`
                        nav-link
                        ${isActive ? "active" : "hover:bg-muted"}
                      `}
                    >
                      <Icon className="h-4 w-4 mr-2" />
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