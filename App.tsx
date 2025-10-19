import React, { useState, useEffect } from 'react';
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
import { StaffManagementScreen } from './screens/StaffManagementScreen';
import { UserManagementScreen } from './screens/UserManagementScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CustomerView } from './screens/CustomerView';

const AppContent: React.FC = () => {
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
            case 'Staff':
                return <StaffManagementScreen />;
            case 'Customers':
                return <UserManagementScreen />;
            default:
                return <DashboardScreen />;
        }
    };

    return (
        <div className="flex h-screen bg-background text-text-primary font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {renderScreen()}
                </div>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCustomerView, setIsCustomerView] = useState(false);
    const [customerTableId, setCustomerTableId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view');
        const tableId = params.get('tableId');
        if (view === 'customer') {
            setIsCustomerView(true);
            setCustomerTableId(tableId || undefined);
        }
    }, []);

    if (isCustomerView) {
        return (
            <AppProvider>
                <CustomerView customerTableId={customerTableId} />
            </AppProvider>
        );
    }
    
    // For this demo, we can just use a simple flag. 
    // In a real app, this would be a proper auth flow.
    if (!isAuthenticated) {
        return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
