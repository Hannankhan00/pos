import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Screen } from '../context/AppContext';
import { LayoutGridIcon } from './icons/LayoutGridIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { PackageIcon } from './icons/PackageIcon';
import { LogOutIcon } from './icons/LogOutIcon';

interface NavItemProps {
  icon: React.ReactNode;
  label: Screen;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-lg'
        : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC = () => {
  const { activeScreen, setActiveScreen } = useAppContext();

  // 'Staff' and 'Users' screens are commented out in App.tsx, so not included here.
  const navItems: { label: Screen; icon: React.ReactNode }[] = [
    { label: 'Dashboard', icon: <LayoutGridIcon className="w-5 h-5" /> },
    { label: 'Orders', icon: <ShoppingCartIcon className="w-5 h-5" /> },
    { label: 'Kitchen', icon: <ChefHatIcon className="w-5 h-5" /> },
    { label: 'Tables', icon: <UsersIcon className="w-5 h-5" /> },
    { label: 'Menu', icon: <ClipboardListIcon className="w-5 h-5" /> },
    { label: 'Stock', icon: <PackageIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-slate-700 flex flex-col p-4">
      <div className="flex items-center mb-8">
        <div className="p-2 bg-primary rounded-lg">
          <ChefHatIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-bold ml-3 text-text-primary">RestroPOS AI</h1>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={activeScreen === item.label}
            onClick={() => setActiveScreen(item.label)}
          />
        ))}
      </nav>

      <div className="mt-auto">
         <NavItem
            icon={<LogOutIcon className="w-5 h-5" />}
            label={'Logout' as Screen} // Cast as Screen to satisfy type, as it's not a real screen
            isActive={false}
            onClick={() => alert('Logout functionality not implemented.')}
        />
      </div>
    </aside>
  );
};
