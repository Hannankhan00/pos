
import { MenuItem, StockItem, Table, TableStatus } from './types';

export const MENU_CATEGORIES = ['Burgers', 'Sides', 'Drinks', 'Desserts'];

export const INITIAL_STOCK: StockItem[] = [
    { id: 's-1', name: 'Beef Patty', quantity: 50, unit: 'patties', lowStockThreshold: 20 },
    { id: 's-2', name: 'Brioche Buns', quantity: 60, unit: 'buns', lowStockThreshold: 20 },
    { id: 's-3', name: 'Cheddar Cheese', quantity: 100, unit: 'slices', lowStockThreshold: 30 },
    { id: 's-4', name: 'Potatoes', quantity: 20, unit: 'kg', lowStockThreshold: 5 },
    { id: 's-5', name: 'Cola Cans', quantity: 100, unit: 'cans', lowStockThreshold: 24 },
    { id: 's-6', name: 'Ice Cream', quantity: 10, unit: 'liters', lowStockThreshold: 3 },
];

export const INITIAL_MENU: MenuItem[] = [
    {
        id: 'm-1',
        name: 'Classic Cheeseburger',
        price: 12.50,
        category: 'Burgers',
        description: 'A juicy beef patty with melted cheddar, lettuce, tomato, and our special sauce on a brioche bun.',
        imageUrl: `https://picsum.photos/seed/burger1/400/300`,
        stockItemId: 's-1',
        stockRequired: 1,
    },
    {
        id: 'm-2',
        name: 'Bacon Deluxe Burger',
        price: 14.75,
        category: 'Burgers',
        description: 'Our classic burger topped with crispy bacon and an extra slice of cheese.',
        imageUrl: `https://picsum.photos/seed/burger2/400/300`,
        stockItemId: 's-1',
        stockRequired: 1,
    },
    {
        id: 'm-3',
        name: 'Crispy Fries',
        price: 4.50,
        category: 'Sides',
        description: 'Golden, crispy, and perfectly salted. The perfect companion to any burger.',
        imageUrl: `https://picsum.photos/seed/fries/400/300`,
        stockItemId: 's-4',
        stockRequired: 0.3,
    },
    {
        id: 'm-4',
        name: 'Onion Rings',
        price: 5.50,
        category: 'Sides',
        description: 'Thick-cut onion rings, beer-battered and fried to perfection.',
        imageUrl: `https://picsum.photos/seed/rings/400/300`,
        stockItemId: '',
        stockRequired: 0,
    },
    {
        id: 'm-5',
        name: 'Classic Cola',
        price: 2.50,
        category: 'Drinks',
        description: 'A refreshing can of your favorite cola, served ice-cold.',
        imageUrl: `https://picsum.photos/seed/cola/400/300`,
        stockItemId: 's-5',
        stockRequired: 1,
    },
     {
        id: 'm-6',
        name: 'Chocolate Milkshake',
        price: 6.00,
        category: 'Desserts',
        description: 'Rich and creamy chocolate milkshake made with real ice cream.',
        imageUrl: `https://picsum.photos/seed/shake/400/300`,
        stockItemId: 's-6',
        stockRequired: 0.2,
    },
];

export const INITIAL_TABLES: Table[] = [
    { id: 't-1', name: 'Table 1', capacity: 4, status: TableStatus.AVAILABLE },
    { id: 't-2', name: 'Table 2', capacity: 4, status: TableStatus.AVAILABLE },
    { id: 't-3', name: 'Table 3', capacity: 2, status: TableStatus.OCCUPIED },
    { id: 't-4', name: 'Table 4', capacity: 6, status: TableStatus.AVAILABLE },
    { id: 't-5', name: 'Patio 1', capacity: 4, status: TableStatus.NEEDS_BILLING },
];
