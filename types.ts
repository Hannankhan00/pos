export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY = 'Ready',
  SERVED = 'Served',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
}

export enum TableStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  NEEDS_BILLING = 'Needs Billing',
}

export enum Screen {
    DASHBOARD = 'Dashboard',
    ORDERS = 'Orders',
    TABLES = 'Tables',
    KITCHEN = 'Kitchen',
    MENU = 'Menu',
    STOCK = 'Stock',
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  stockItemId: string;
  stockRequired: number;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  orderId?: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}
