
export enum OrderStatus {
    PENDING = 'Pending',
    PREPARING = 'Preparing',
    READY = 'Ready',
    SERVED = 'Served',
    PAID = 'Paid',
}

export enum TableStatus {
    AVAILABLE = 'Available',
    OCCUPIED = 'Occupied',
    NEEDS_BILLING = 'Needs Billing',
}

export interface OrderItem {
    menuItemId: string;
    quantity: number;
}

export interface Order {
    id: string;
    tableId: string; // 'takeout' or a table id
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: string; // ISO string
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    imageUrl: string;
    stockItemId?: string; // Optional link to a stock item
    stockRequired: number; // How many units of stock this item consumes
}

export interface StockItem {
    id: string;
    name: string;
    quantity: number;
    unit: string; // e.g., 'kg', 'bottles', 'patties'
    lowStockThreshold: number;
}

export interface Table {
    id: string;
    name: string;
    capacity: number;
    status: TableStatus;
}
