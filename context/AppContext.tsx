import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { MenuItem, Order, OrderItem, StockItem, Table } from '../types';
import { OrderStatus, Screen, TableStatus } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_STOCK, INITIAL_TABLES, INITIAL_MENU_CATEGORIES } from '../constants';

export interface AppContextType {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  placeOrder: (tableId: string, items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  tables: Table[];
  addTable: (name: string, capacity: number) => void;
  deleteTable: (tableId: string) => void;
  updateTableStatus: (tableId: string, status: TableStatus, orderId?: string) => void;
  stockItems: StockItem[];
  setStockItems: React.Dispatch<React.SetStateAction<StockItem[]>>;
  updateStock: (itemId: string, quantityChange: number) => void;
  menuCategories: string[];
  addCategory: (categoryName: string) => boolean;
  deleteCategory: (categoryName: string) => boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.DASHBOARD);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK);
  const [menuCategories, setMenuCategories] = useState<string[]>(INITIAL_MENU_CATEGORIES);

  const updateStock = useCallback((itemId: string, quantityChange: number) => {
    setStockItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + quantityChange } : item
    ));
  }, []);
  
  const updateTableStatus = useCallback((tableId: string, status: TableStatus, orderId?: string) => {
      setTables(prev => prev.map(table =>
          table.id === tableId ? { ...table, status, orderId: status === TableStatus.AVAILABLE ? undefined : (orderId || table.orderId) } : table
      ));
  }, []);

  const placeOrder = useCallback((tableId: string, items: OrderItem[]) => {
    const newOrderId = `ORD-${Date.now()}`;
    const total = items.reduce((acc, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      return acc + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    const newOrder: Order = {
      id: newOrderId,
      tableId,
      items,
      status: OrderStatus.PENDING,
      total,
      createdAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Only update table status if it's a dine-in order (not "Takeout")
    if(tables.some(t => t.id === tableId)) {
      updateTableStatus(tableId, TableStatus.OCCUPIED, newOrderId);
    }
    
    items.forEach(item => {
        const menuItem = menuItems.find(m => m.id === item.menuItemId);
        if (menuItem && menuItem.stockItemId) {
            updateStock(menuItem.stockItemId, -menuItem.stockRequired * item.quantity);
        }
    });

  }, [menuItems, updateStock, updateTableStatus, tables]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
            if (status === OrderStatus.PAID) {
                if(tables.some(t => t.id === order.tableId)) {
                    updateTableStatus(order.tableId, TableStatus.AVAILABLE);
                }
            }
            return { ...order, status };
        }
        return order;
    }));
  }, [updateTableStatus, tables]);

  const addCategory = useCallback((categoryName: string): boolean => {
    if (categoryName && !menuCategories.includes(categoryName)) {
        setMenuCategories(prev => [...prev, categoryName].sort());
        return true;
    }
    alert("Category already exists or name is invalid.");
    return false;
  }, [menuCategories]);

  const deleteCategory = useCallback((categoryName: string): boolean => {
      const isCategoryInUse = menuItems.some(item => item.category === categoryName);
      if (isCategoryInUse) {
          alert('Cannot delete category: it is currently assigned to one or more menu items.');
          return false;
      }
      setMenuCategories(prev => prev.filter(cat => cat !== categoryName));
      return true;
  }, [menuItems]);

  const addTable = useCallback((name: string, capacity: number) => {
      const newTable: Table = {
          id: `t-${Date.now()}`,
          name,
          capacity,
          status: TableStatus.AVAILABLE,
      };
      setTables(prev => [...prev, newTable]);
  }, []);

  const deleteTable = useCallback((tableId: string) => {
      const tableToDelete = tables.find(t => t.id === tableId);
      if (tableToDelete && tableToDelete.status !== TableStatus.AVAILABLE) {
          alert('Cannot delete: table is currently occupied or needs billing.');
          return;
      }
      setTables(prev => prev.filter(t => t.id !== tableId));
  }, [tables]);

  const value = {
    activeScreen,
    setActiveScreen,
    menuItems,
    setMenuItems,
    orders,
    placeOrder,
    updateOrderStatus,
    tables,
    addTable,
    deleteTable,
    updateTableStatus,
    stockItems,
    setStockItems,
    updateStock,
    menuCategories,
    addCategory,
    deleteCategory
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
