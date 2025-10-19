import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

export const Header: React.FC = () => {
    const { activeScreen } = useAppContext();

    return (
        <header className="p-4 border-b border-slate-700 bg-surface">
            <h1 className="text-2xl font-bold text-text-primary tracking-wide">{activeScreen}</h1>
        </header>
    );
};
