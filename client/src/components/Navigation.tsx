import { Link, useLocation } from "wouter";
import { Home, History, Target } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/history", label: "History", icon: History },
  { href: "/goals", label: "Goals", icon: Target },
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="font-bold text-xl">FitTrack</div>
          
          <div className="flex space-x-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = location === href;
              return (
                <Link key={href} href={href}>
                  <a
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm font-medium
                      ${isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
