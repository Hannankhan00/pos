import { MenuItem, StockItem, Table, TableStatus, Order, OrderStatus } from './types';

export const MENU_CATEGORIES = ['Burgers', 'Sides', 'Drinks', 'Desserts'];

export const INITIAL_STOCK: StockItem[] = [
  { id: 's-1', name: 'Beef Patty', quantity: 50, unit: 'patties', lowStockThreshold: 20 },
  { id: 's-2', name: 'Burger Bun', quantity: 80, unit: 'buns', lowStockThreshold: 30 },
  { id: 's-3', name: 'Potatoes', quantity: 20, unit: 'kg', lowStockThreshold: 10 },
  { id: 's-4', name: 'Cheddar Cheese', quantity: 10, unit: 'kg', lowStockThreshold: 5 },
  { id: 's-5', name: 'Lettuce', quantity: 5, unit: 'heads', lowStockThreshold: 3 },
  { id: 's-6', name: 'Tomatoes', quantity: 10, unit: 'kg', lowStockThreshold: 5 },
  { id: 's-7', name: 'Cola Can', quantity: 100, unit: 'cans', lowStockThreshold: 40 },
  { id: 's-8', name: 'Vanilla Ice Cream', quantity: 15, unit: 'liters', lowStockThreshold: 5 },
];

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm-1', name: 'Classic Burger', price: 9.99, category: 'Burgers', description: 'A juicy beef patty with cheddar cheese, lettuce, and tomato.', imageUrl: 'https://picsum.photos/seed/burger1/400/300', stockItemId: 's-1', stockRequired: 1 },
  { id: 'm-2', name: 'Double Cheeseburger', price: 12.99, category: 'Burgers', description: 'Two beef patties for the extra hungry.', imageUrl: 'https://picsum.photos/seed/burger2/400/300', stockItemId: 's-1', stockRequired: 2 },
  { id: 'm-3', name: 'Fries', price: 3.99, category: 'Sides', description: 'Crispy golden french fries.', imageUrl: 'https://picsum.photos/seed/fries/400/300', stockItemId: 's-3', stockRequired: 0.3 },
  { id: 'm-4', name: 'Cola', price: 1.99, category: 'Drinks', description: 'A refreshing can of cola.', imageUrl: 'https://picsum.photos/seed/cola/400/300', stockItemId: 's-7', stockRequired: 1 },
  { id: 'm-5', name: 'Vanilla Shake', price: 4.99, category: 'Desserts', description: 'A classic vanilla milkshake.', imageUrl: 'https://picsum.photos/seed/shake/400/300', stockItemId: 's-8', stockRequired: 0.2 },
];

export const INITIAL_TABLES: Table[] = [
  { id: 't-1', name: 'Table 1', capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't-2', name: 'Table 2', capacity: 4, status: TableStatus.OCCUPIED },
  { id: 't-3', name: 'Table 3', capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't-4', name: 'Table 4', capacity: 6, status: TableStatus.NEEDS_BILLING },
  { id: 't-5', name: 'Patio 1', capacity: 4, status: TableStatus.AVAILABLE },
];

export const INITIAL_ORDERS: Order[] = [
    { id: 'o-1', tableId: 't-2', items: [{ menuItemId: 'm-1', quantity: 2 }, { menuItemId: 'm-3', quantity: 1 }], status: OrderStatus.PREPARING, total: 23.97, createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: 'o-2', tableId: 't-4', items: [{ menuItemId: 'm-2', quantity: 1 }], status: OrderStatus.SERVED, total: 12.99, createdAt: new Date(Date.now() - 20 * 60000).toISOString() },
    { id: 'o-3', tableId: 'takeout-1', items: [{ menuItemId: 'm-4', quantity: 4 }], status: OrderStatus.READY, total: 7.96, createdAt: new Date(Date.now() - 2 * 60000).toISOString() },
    { id: 'o-4', tableId: 't-2', items: [{ menuItemId: 'm-5', quantity: 2 }], status: OrderStatus.PENDING, total: 9.98, createdAt: new Date(Date.now() - 1 * 60000).toISOString() },
];
