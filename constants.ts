import type { MenuItem, Table, StockItem } from './types';
import { TableStatus } from './types';

export const INITIAL_MENU_CATEGORIES: string[] = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];

export const INITIAL_STOCK: StockItem[] = [
    { id: 's1', name: 'Angus Beef Patty', quantity: 100, unit: 'patties', lowStockThreshold: 20 },
    { id: 's2', name: 'Brioche Buns', quantity: 120, unit: 'buns', lowStockThreshold: 30 },
    { id: 's3', name: 'Cheddar Cheese', quantity: 80, unit: 'slices', lowStockThreshold: 25 },
    { id: 's4', name: 'Lettuce', quantity: 50, unit: 'heads', lowStockThreshold: 10 },
    { id: 's5', name: 'Tomato', quantity: 60, unit: 'units', lowStockThreshold: 15 },
    { id: 's6', name: 'Potatoes', quantity: 200, unit: 'kg', lowStockThreshold: 20 },
    { id: 's7', name: 'Salmon Fillet', quantity: 40, unit: 'fillets', lowStockThreshold: 10 },
    { id: 's8', name: 'Asparagus', quantity: 30, unit: 'bunches', lowStockThreshold: 5 },
    { id: 's9', name: 'Chocolate Lava Cake Mix', quantity: 50, unit: 'servings', lowStockThreshold: 10 },
    { id: 's10', name: 'Vanilla Ice Cream', quantity: 20, unit: 'liters', lowStockThreshold: 5 },
    { id: 's11', name: 'Cola', quantity: 200, unit: 'cans', lowStockThreshold: 50 },
    { id: 's12', name: 'Lemonade', quantity: 150, unit: 'cans', lowStockThreshold: 40 },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Classic Burger', price: 12.99, category: 'Main Courses', description: 'Juicy Angus beef patty with cheddar cheese, lettuce, and tomato on a brioche bun.', imageUrl: 'https://picsum.photos/seed/burger/400/300', stockItemId: 's1', stockRequired: 1 },
  { id: 'm2', name: 'Fries', price: 4.99, category: 'Appetizers', description: 'Crispy golden fries, lightly salted.', imageUrl: 'https://picsum.photos/seed/fries/400/300', stockItemId: 's6', stockRequired: 0.25 },
  { id: 'm3', 'name': 'Grilled Salmon', price: 22.50, category: 'Main Courses', description: 'Perfectly grilled salmon fillet served with a side of steamed asparagus.', imageUrl: 'https://picsum.photos/seed/salmon/400/300', stockItemId: 's7', stockRequired: 1 },
  { id: 'm4', 'name': 'Chocolate Lava Cake', price: 8.99, category: 'Desserts', description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream.', imageUrl: 'https://picsum.photos/seed/cake/400/300', stockItemId: 's9', stockRequired: 1 },
  { id: 'm5', 'name': 'Cola', price: 2.50, category: 'Beverages', description: 'A refreshing can of cola.', imageUrl: 'https://picsum.photos/seed/cola/400/300', stockItemId: 's11', stockRequired: 1 },
  { id: 'm6', 'name': 'Lemonade', price: 2.75, category: 'Beverages', description: 'Freshly squeezed lemonade.', imageUrl: 'https://picsum.photos/seed/lemonade/400/300', stockItemId: 's12', stockRequired: 1 },
  { id: 'm7', 'name': 'Caesar Salad', price: 10.50, category: 'Appetizers', description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing.', imageUrl: 'https://picsum.photos/seed/salad/400/300', stockItemId: 's4', stockRequired: 0.5 },
];

export const INITIAL_TABLES: Table[] = [
  { id: 't1', name: 'Table 1', capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't2', name: 'Table 2', capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't3', name: 'Table 3', capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't4', name: 'Table 4', capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't5', name: 'Table 5', capacity: 6, status: TableStatus.AVAILABLE },
  { id: 't6', name: 'Table 6', capacity: 6, status: TableStatus.AVAILABLE },
  { id: 't7', name: 'Bar 1', capacity: 1, status: TableStatus.AVAILABLE },
  { id: 't8', name: 'Bar 2', capacity: 1, status: TableStatus.AVAILABLE },
  { id: 't9', name: 'Patio 1', capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't10', name: 'Patio 2', capacity: 4, status: TableStatus.AVAILABLE },
];
