
import React from 'react';
// FIX: `useAppContext` is exported from `hooks/useAppContext`, not `context/AppContext`.
import { AppProvider } from './context/AppContext';
import { useAppContext } from './hooks/useAppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardScreen } from './screens/DashboardScreen';
import { OrderScreen } from './screens/OrderScreen';
import { KitchenScreen } from './screens/KitchenScreen';
import { MenuScreen } from './screens/MenuScreen';
import { StockScreen } from './screens/StockScreen';
import { TableScreen } from './screens/TableScreen';
import { CustomerView } from './screens/CustomerView';
// import { StaffManagementScreen } from './screens/StaffManagementScreen';
// import { UserManagementScreen } from './screens/UserManagementScreen';

const MainApp: React.FC = () => {
    const { activeScreen } = useAppContext();

    const renderScreen = () => {
        switch (activeScreen) {
            case 'Dashboard':
                return <DashboardScreen />;
            case 'Orders':
                return <OrderScreen />;
            case 'Kitchen':
                return <KitchenScreen />;
            case 'Menu':
                return <MenuScreen />;
            case 'Stock':
                return <StockScreen />;
            case 'Tables':
                return <TableScreen />;
            // case 'Staff':
            //     return <StaffManagementScreen />;
            // case 'Users':
            //     return <UserManagementScreen />;
            default:
                return <DashboardScreen />;
        }
    };
    
    // Logic to show customer view based on URL param
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    const tableId = urlParams.get('tableId');

    if (view === 'customer') {
        return <CustomerView customerTableId={tableId || undefined} />;
    }

    return (
        <div className="flex h-screen bg-background text-text-primary font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {renderScreen()}
                </div>
            </main>
        </div>
    );
}

const App: React.FC = () => {
    return (
        <AppProvider>
            <MainApp />
        </AppProvider>
    );
};

export default App;