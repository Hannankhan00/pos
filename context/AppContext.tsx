
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderItem, MenuItem, StockItem, Table, OrderStatus, TableStatus } from '../types';
import { INITIAL_MENU, INITIAL_STOCK, INITIAL_TABLES, MENU_CATEGORIES } from '../constants';

export type Screen = 'Dashboard' | 'Orders' | 'Kitchen' | 'Menu' | 'Stock' | 'Tables' | 'Staff' | 'Users';

export interface AppContextType {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  stockItems: StockItem[];
  setStockItems: React.Dispatch<React.SetStateAction<StockItem[]>>;
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  menuCategories: string[];
  placeOrder: (tableId: string, items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addTable: (name: string, capacity: number) => void;
  deleteTable: (tableId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Dashboard');
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('menuItems', INITIAL_MENU);
  const [stockItems, setStockItems] = useLocalStorage<StockItem[]>('stockItems', INITIAL_STOCK);
  const [tables, setTables] = useLocalStorage<Table[]>('tables', INITIAL_TABLES);

  const menuCategories = MENU_CATEGORIES;

  const placeOrder = (tableId: string, items: OrderItem[]) => {
    const total = items.reduce((acc, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return acc + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    const newOrder: Order = {
      id: `o-${Date.now()}`,
      tableId: tableId.startsWith('t-') ? tables.find(t=>t.id === tableId)?.name || 'Unknown Table' : tableId,
      items,
      total,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [...prev, newOrder]);

    // Update stock
    items.forEach(orderItem => {
        const menuItem = menuItems.find(mi => mi.id === orderItem.menuItemId);
        if (menuItem && menuItem.stockItemId) {
            setStockItems(prev => prev.map(stockItem => 
                stockItem.id === menuItem.stockItemId
                ? { ...stockItem, quantity: stockItem.quantity - (menuItem.stockRequired * orderItem.quantity) }
                : stockItem
            ));
        }
    });

    // Update table status
    if (tableId.startsWith('t-')) {
        setTables(prev => prev.map(t => t.id === tableId ? {...t, status: TableStatus.OCCUPIED} : t));
    }
  };
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: newStatus} : o));
  };

  const addTable = (name: string, capacity: number) => {
      const newTable: Table = {
          id: `t-${Date.now()}`,
          name,
          capacity,
          status: TableStatus.AVAILABLE
      };
      setTables(prev => [...prev, newTable]);
  };
    
  const deleteTable = (tableId: string) => {
      setTables(prev => prev.filter(t => t.id !== tableId));
  }

  return (
    <AppContext.Provider value={{
      activeScreen,
      setActiveScreen,
      orders,
      setOrders,
      menuItems,
      setMenuItems,
      stockItems,
      setStockItems,
      tables,
      setTables,
      menuCategories,
      placeOrder,
      updateOrderStatus,
      addTable,
      deleteTable
    }}>
      {children}
    </AppContext.Provider>
  );
};
