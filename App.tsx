import React from 'react';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './hooks/useAppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Screen } from './types';
import { DashboardScreen } from './screens/DashboardScreen';
import { OrderScreen } from './screens/OrderScreen';
import { TableScreen } from './screens/TableScreen';
import { KitchenScreen } from './screens/KitchenScreen';
import { MenuScreen } from './screens/MenuScreen';
import { StockScreen } from './screens/StockScreen';
import { CustomerView } from './screens/CustomerView';

const ScreenRenderer: React.FC = () => {
    const { activeScreen } = useAppContext();

    switch (activeScreen) {
        case Screen.DASHBOARD: return <DashboardScreen />;
        case Screen.ORDERS: return <OrderScreen />;
        case Screen.TABLES: return <TableScreen />;
        case Screen.KITCHEN: return <KitchenScreen />;
        case Screen.MENU: return <MenuScreen />;
        case Screen.STOCK: return <StockScreen />;
        default: return <DashboardScreen />;
    }
}

const StaffView: React.FC = () => {
    return (
        <div className="flex h-screen bg-background text-text-primary font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    <ScreenRenderer />
                </div>
            </main>
        </div>
    );
};

const MainApp: React.FC = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    const tableId = urlParams.get('tableId');

    if (view === 'customer') {
        return <CustomerView customerTableId={tableId || undefined} />;
    }
    
    return <StaffView />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
