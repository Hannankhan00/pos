import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { LayoutGridIcon } from './icons/LayoutGridIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { LogOutIcon } from './icons/LogOutIcon';
import { Screen } from '../types';

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
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-white shadow-lg'
          : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-surface-light p-4 flex flex-col border-r border-slate-800">
      <div className="flex items-center mb-8 px-2">
        <ChefHatIcon className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold ml-2 text-text-primary tracking-wider">RestroAI</span>
      </div>
      <nav className="flex-grow space-y-2">
        <NavItem screen="Dashboard" icon={<LayoutGridIcon className="h-5 w-5" />} label="Dashboard" />
        <NavItem screen="Orders" icon={<ShoppingCartIcon className="h-5 w-5" />} label="New Order" />
        <NavItem screen="Kitchen" icon={<ClipboardListIcon className="h-5 w-5" />} label="Kitchen View" />
        <NavItem screen="Menu" icon={<ChefHatIcon className="h-5 w-5" />} label="Menu" />
        <NavItem screen="Stock" icon={<PackageIcon className="h-5 w-5" />} label="Inventory" />
        <NavItem screen="Tables" icon={<UsersIcon className="h-5 w-5" />} label="Tables" />
      </nav>
      <div className="mt-auto">
        <button
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-text-secondary hover:bg-surface-light hover:text-text-primary"
        >
          <LogOutIcon className="h-5 w-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
