import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Screen } from '../types';
import { BarChartIcon } from './icons/BarChartIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { LayoutGridIcon } from './icons/LayoutGridIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';


const NavItem: React.FC<{
  screen: Screen;
  icon: React.ReactNode;
  label: string;
}> = ({ screen, icon, label }) => {
  const { activeScreen, setActiveScreen } = useAppContext();
  const isActive = activeScreen === screen;

  return (
    <button
      onClick={() => setActiveScreen(screen)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-lg'
          : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
      }`}
    >
      <span className="mr-4">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-surface p-4 flex flex-col h-full border-r border-slate-700">
      <div className="flex items-center mb-10 px-2">
        <ChefHatIcon className="h-9 w-9 text-secondary" />
        <h1 className="ml-3 text-2xl font-bold text-text-primary">AI POS</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem screen={Screen.DASHBOARD} icon={<BarChartIcon className="h-5 w-5" />} label="Dashboard" />
        <NavItem screen={Screen.ORDERS} icon={<ShoppingCartIcon className="h-5 w-5" />} label="New Order" />
        <NavItem screen={Screen.TABLES} icon={<LayoutGridIcon className="h-5 w-5" />} label="Tables" />
        <NavItem screen={Screen.KITCHEN} icon={<ChefHatIcon className="h-5 w-5" />} label="Kitchen View" />
        <NavItem screen={Screen.MENU} icon={<ClipboardListIcon className="h-5 w-5" />} label="Menu Mgmt" />
        <NavItem screen={Screen.STOCK} icon={<PackageIcon className="h-5 w-5" />} label="Stock Mgmt" />
        <div className="pt-4 mt-4 border-t border-slate-700">
             <a 
                href="?view=customer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors text-text-secondary hover:bg-surface-light hover:text-text-primary"
            >
                <UsersIcon className="h-5 w-5 mr-4" />
                <span>Customer Portal</span>
            </a>
        </div>
      </nav>
    </div>
  );
};
