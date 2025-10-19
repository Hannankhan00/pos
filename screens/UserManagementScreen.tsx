import React from 'react';
import { PageTitle } from '../components/PageTitle';

export const UserManagementScreen: React.FC = () => {
  return (
    <div className="p-6">
      <PageTitle title="Customer Management" />
      <div className="bg-surface rounded-lg p-6 text-center text-text-secondary">
        <p>Customer management features are coming soon.</p>
      </div>
    </div>
  );
};
