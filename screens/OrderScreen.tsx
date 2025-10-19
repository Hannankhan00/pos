
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { MenuItem, OrderItem, TableStatus } from '../types';
import { PageTitle } from '../components/PageTitle';

const MenuItemCard: React.FC<{ item: MenuItem; onAdd: () => void; }> = ({ item, onAdd }) => (
    <div className="bg-surface p-4 rounded-xl flex space-x-4 items-center shadow-md">
        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
        <div className="flex-grow">
            <p className="font-bold text-text-primary">{item.name}</p>
            <p className="text-sm text-text-secondary">${item.price.toFixed(2)}</p>
        </div>
        <button onClick={onAdd} className="bg-primary text-white font-bold w-10 h-10 rounded-full text-xl hover:bg-blue-700 transition-transform hover:scale-110">+</button>
    </div>
);

export const OrderScreen: React.FC = () => {
    const { menuItems, tables, placeOrder } = useAppContext();
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string>('takeout');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const availableTables = useMemo(() => tables.filter(t => t.status === TableStatus.AVAILABLE), [tables]);
    const categories = useMemo(() => ['All', ...Array.from(new Set(menuItems.map(item => item.category)))], [menuItems]);

    const filteredMenuItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [menuItems, searchQuery, selectedCategory]);

    const addToCart = (menuItemId: string) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.menuItemId === menuItemId);
            if (existingItem) {
                return prev.map(item => item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { menuItemId, quantity: 1 }];
        });
    };
    
    const removeFromCart = (menuItemId: string) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.menuItemId === menuItemId);
            if (existingItem && existingItem.quantity > 1) {
                return prev.map(item => item.menuItemId === menuItemId ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter(item => item.menuItemId !== menuItemId);
        });
    };

    const cartTotal = useMemo(() => {
        return cart.reduce((total, cartItem) => {
            const menuItem = menuItems.find(item => item.id === cartItem.menuItemId);
            return total + (menuItem ? menuItem.price * cartItem.quantity : 0);
        }, 0);
    }, [cart, menuItems]);

    const handlePlaceOrder = () => {
        if (cart.length === 0 || !selectedTableId) {
            alert('Please add items to the cart and select a table or takeout.');
            return;
        }
        placeOrder(selectedTableId, cart);
        setCart([]);
        setSelectedTableId('takeout');
        alert('Order placed successfully!');
    };
    
    return (
        <div className="p-6 h-[calc(100vh-65px)] flex flex-col">
            <PageTitle title="Create New Order" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
                {/* Menu Items Section */}
                <div className="lg:col-span-2 flex flex-col overflow-hidden">
                    <div className="mb-4 flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search for food..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-surface border border-slate-600 rounded-lg p-2 flex-grow"
                        />
                         <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-surface border border-slate-600 rounded-lg p-2"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                        {filteredMenuItems.map(item => (
                            <MenuItemCard key={item.id} item={item} onAdd={() => addToCart(item.id)} />
                        ))}
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="bg-surface rounded-xl p-6 shadow-lg flex flex-col overflow-hidden">
                    <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Order Summary</h2>
                    <div className="mb-4">
                        <label htmlFor="table-select" className="block text-sm font-medium text-text-secondary mb-1">Order for:</label>
                        <select 
                            id="table-select" 
                            value={selectedTableId} 
                            onChange={(e) => setSelectedTableId(e.target.value)}
                            className="w-full bg-background border border-slate-600 rounded-lg p-2"
                        >
                            <option value="takeout">Takeout</option>
                            {availableTables.map(table => (
                                <option key={table.id} value={table.id}>{table.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                        {cart.length > 0 ? cart.map(cartItem => {
                            const menuItem = menuItems.find(item => item.id === cartItem.menuItemId);
                            if (!menuItem) return null;
                            return (
                                <div key={menuItem.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-text-primary">{menuItem.name}</p>
                                        <p className="text-sm text-text-secondary">${menuItem.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => removeFromCart(menuItem.id)} className="bg-slate-600 w-6 h-6 rounded-full font-bold">-</button>
                                        <span className="w-6 text-center font-bold">{cartItem.quantity}</span>
                                        <button onClick={() => addToCart(menuItem.id)} className="bg-slate-600 w-6 h-6 rounded-full font-bold">+</button>
                                    </div>
                                </div>
                            );
                        }) : <p className="text-text-secondary text-center mt-8">Cart is empty.</p>}
                    </div>
                    <div className="border-t border-slate-700 pt-4 mt-4">
                        <div className="flex justify-between font-bold text-xl mb-4">
                            <span>Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={handlePlaceOrder} disabled={cart.length === 0} className="w-full bg-secondary text-background font-bold py-3 rounded-lg hover:bg-green-500 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed">
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
