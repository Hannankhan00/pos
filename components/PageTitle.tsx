import React from 'react';

interface PageTitleProps {
  title: string;
  children?: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, children }) => (
  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
    <h1 className="text-3xl font-bold text-text-primary tracking-tight">{title}</h1>
    {children && <div className="flex items-center space-x-2">{children}</div>}
  </div>
);
