import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { Screen, MenuItem, Order, StockItem, Table, OrderItem, OrderStatus, TableStatus } from '../types';
import { INITIAL_MENU, INITIAL_ORDERS, INITIAL_STOCK, INITIAL_TABLES, MENU_CATEGORIES } from '../constants';

// Helper to use local storage
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
};

export interface AppContextType {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  menuCategories: string[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  stockItems: StockItem[];
  setStockItems: React.Dispatch<React.SetStateAction<StockItem[]>>;
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  addTable: (name: string, capacity: number) => void;
  deleteTable: (tableId: string) => void;
  placeOrder: (tableId: string, items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Dashboard');
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('menuItems', INITIAL_MENU);
  const [stockItems, setStockItems] = useLocalStorage<StockItem[]>('stockItems', INITIAL_STOCK);
  const [tables, setTables] = useLocalStorage<Table[]>('tables', INITIAL_TABLES);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', INITIAL_ORDERS);

  const menuCategories = useMemo(() => {
      const categories = new Set(menuItems.map(item => item.category));
      return [...MENU_CATEGORIES, ...Array.from(categories).filter(c => !MENU_CATEGORIES.includes(c))];
  }, [menuItems]);

  const addTable = (name: string, capacity: number) => {
    const newTable: Table = {
      id: `t-${Date.now()}`,
      name,
      capacity,
      status: TableStatus.AVAILABLE,
    };
    setTables(prev => [...prev, newTable]);
  };
  
  const deleteTable = (tableId: string) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
  };

  const placeOrder = (tableId: string, items: OrderItem[]) => {
    const total = items.reduce((acc, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      return acc + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    const newOrder: Order = {
      id: `o-${Date.now()}`,
      tableId: tables.find(t => t.id === tableId)?.name || tableId,
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
            setStockItems(prevStock => prevStock.map(stockItem => 
                stockItem.id === menuItem.stockItemId 
                ? { ...stockItem, quantity: stockItem.quantity - (menuItem.stockRequired * orderItem.quantity) }
                : stockItem
            ));
        }
    });

    // Update table status
    if (!tableId.startsWith('Takeaway')) {
      setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: TableStatus.OCCUPIED } : t));
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const value: AppContextType = {
    activeScreen,
    setActiveScreen,
    menuItems,
    setMenuItems,
    menuCategories,
    orders,
    setOrders,
    stockItems,
    setStockItems,
    tables,
    setTables,
    addTable,
    deleteTable,
    placeOrder,
    updateOrderStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
