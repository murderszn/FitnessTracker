import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="header">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="logo"
      >
        SimpleCRM
      </motion.div>

      <div className="user-menu">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="notification-button"
        >
          <BellIcon className="w-6 h-6" />
          <span className="notification-badge">3</span>
        </motion.button>

        <Menu as="div" className="user-dropdown">
          <Menu.Button className="user-dropdown-button">
            <UserCircleIcon className="w-8 h-8" />
            <span>John Doe</span>
            <ChevronDownIcon className="w-4 h-4" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="user-dropdown-items">
              <Menu.Item>
                {({ active }) => (
                  <button className={`dropdown-item ${active ? 'active' : ''}`}>
                    Profile Settings
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button className={`dropdown-item ${active ? 'active' : ''}`}>
                    Preferences
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button className={`dropdown-item ${active ? 'active' : ''}`}>
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header; 