
import React from 'react';
import { useAppContext, Screen } from '../context/AppContext';
import { LayoutGridIcon } from './icons/LayoutGridIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { LogOutIcon } from './icons/LogOutIcon';

interface NavItemProps {
    icon: React.ReactNode;
    label: Screen;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label }) => {
    const { activeScreen, setActiveScreen } = useAppContext();
    const isActive = activeScreen === label;

    return (
        <button
            onClick={() => setActiveScreen(label)}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
            }`}
        >
            {icon}
            <span className="ml-4 font-semibold">{label}</span>
        </button>
    );
};

export const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-surface p-4 flex flex-col border-r border-slate-700">
            <div className="flex items-center mb-8 px-2">
                <ChefHatIcon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold ml-2 text-text-primary tracking-wider">RestroAI</h1>
            </div>
            <nav className="flex-grow space-y-2">
                <NavItem label="Dashboard" icon={<LayoutGridIcon className="h-5 w-5" />} />
                <NavItem label="Orders" icon={<ShoppingCartIcon className="h-5 w-5" />} />
                <NavItem label="Kitchen" icon={<ChefHatIcon className="h-5 w-5" />} />
                <NavItem label="Menu" icon={<ClipboardListIcon className="h-5 w-5" />} />
                <NavItem label="Stock" icon={<PackageIcon className="h-5 w-5" />} />
                <NavItem label="Tables" icon={<LayoutGridIcon className="h-5 w-5" />} />
                {/* <NavItem label="Staff" icon={<UsersIcon className="h-5 w-5" />} />
                <NavItem label="Users" icon={<UsersIcon className="h-5 w-5" />} /> */}
            </nav>
            <div className="mt-auto">
                 <button className="flex items-center w-full px-4 py-3 text-text-secondary hover:bg-surface-light hover:text-text-primary rounded-lg transition-colors">
                    <LogOutIcon className="h-5 w-5" />
                    <span className="ml-4 font-semibold">Log Out</span>
                </button>
            </div>
        </aside>
    );
};
