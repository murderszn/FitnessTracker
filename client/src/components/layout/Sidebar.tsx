import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartBarIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface NavItem {
  id: string;
  label: string;
  path: string;
}

const mainMenu: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/' },
  { id: 'contacts', label: 'Contacts', path: '/contacts' },
  { id: 'companies', label: 'Companies', path: '/companies' },
  { id: 'deals', label: 'Deals', path: '/deals' },
  { id: 'tasks', label: 'Tasks', path: '/tasks' }
];

const reportLinks = [
  {
    name: 'Sales Pipeline',
    href: '/reports/sales-pipeline',
    icon: ChartBarIcon
  },
  {
    name: 'Activity Report',
    href: '/reports/activity',
    icon: ClockIcon
  },
  {
    name: 'Revenue Analytics',
    href: '/reports/revenue',
    icon: CurrencyDollarIcon
  }
];

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="nav-section">
        <h2>Main Menu</h2>
        <ul className="nav-links">
          {mainMenu.map(item => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="nav-link-content"
                >
                  {item.label}
                </motion.div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-section">
        <h2>Reports</h2>
        <ul className="nav-links">
          {reportLinks.map((item, index) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="nav-link-content"
                >
                  {item.name}
                </motion.div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar; 