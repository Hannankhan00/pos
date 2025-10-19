import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import type { MenuItem, OrderItem } from '../types';
import { TableStatus, Screen } from '../types';
import { getOrderSuggestion } from '../services/geminiService';

const MenuItemCard: React.FC<{ item: MenuItem; onAddToOrder: (item: MenuItem) => void }> = ({ item, onAddToOrder }) => (
    <div onClick={() => onAddToOrder(item)} className="bg-surface rounded-lg p-3 flex flex-col cursor-pointer hover:ring-2 ring-primary transition-all duration-200">
        <img src={item.imageUrl} alt={item.name} className="w-full h-24 object-cover rounded-md mb-2" />
        <h3 className="font-semibold text-sm flex-grow text-text-primary">{item.name}</h3>
        <p className="text-secondary font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
    </div>
);

export const OrderScreen: React.FC = () => {
    const { menuItems, placeOrder, tables, setActiveScreen, menuCategories } = useAppContext();
    const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(menuCategories[0] || '');
    const [selectedTableId, setSelectedTableId] = useState<string>('');
    const [suggestion, setSuggestion] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    const availableTables = useMemo(() => tables.filter(t => t.status === TableStatus.AVAILABLE), [tables]);

    const addToOrder = (item: MenuItem) => {
        setCurrentOrder(prevOrder => {
            const existingItem = prevOrder.find(oi => oi.menuItemId === item.id);
            if (existingItem) {
                return prevOrder.map(oi => oi.menuItemId === item.id ? { ...oi, quantity: oi.quantity + 1 } : oi);
            }
            return [...prevOrder, { menuItemId: item.id, quantity: 1 }];
        });
    };
    
    const removeFromOrder = (itemId: string) => {
        setCurrentOrder(prev => {
            const existing = prev.find(oi => oi.menuItemId === itemId);
            if(existing && existing.quantity > 1) {
                 return prev.map(oi => oi.menuItemId === itemId ? { ...oi, quantity: oi.quantity - 1 } : oi);
            }
            return prev.filter(oi => oi.menuItemId !== itemId);
        });
    };

    const total = useMemo(() => {
        return currentOrder.reduce((acc, orderItem) => {
            const menuItem = menuItems.find(mi => mi.id === orderItem.menuItemId);
            return acc + (menuItem ? menuItem.price * orderItem.quantity : 0);
        }, 0);
    }, [currentOrder, menuItems]);
    
    const handlePlaceOrder = () => {
        if (currentOrder.length === 0 || !selectedTableId) {
            alert("Please select a table and add items to the order.");
            return;
        }
        placeOrder(selectedTableId, currentOrder);
        setCurrentOrder([]);
        setSelectedTableId('');
        setSuggestion('');
        setActiveScreen(Screen.KITCHEN);
    };
    
    const handleGetSuggestion = async () => {
        if (currentOrder.length === 0) {
            setSuggestion('Add an item to the order first to get suggestions.');
            return;
        }
        setIsSuggesting(true);
        const orderedItems = currentOrder.map(oi => menuItems.find(mi => mi.id === oi.menuItemId)).filter(Boolean) as MenuItem[];
        const result = await getOrderSuggestion(orderedItems);
        setSuggestion(result);
        setIsSuggesting(false);
    }
    
    const filteredMenuItems = useMemo(() => menuItems.filter(item => item.category === selectedCategory), [menuItems, selectedCategory]);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
            {/* Menu Items */}
            <div className="flex-1 lg:w-2/3 p-4 flex flex-col">
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-3 text-text-primary">Menu</h2>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {menuCategories.map(cat => (
                            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-light'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredMenuItems.map(item => <MenuItemCard key={item.id} item={item} onAddToOrder={addToOrder} />)}
                    </div>
                </div>
            </div>

            {/* Current Order */}
            <div className="w-full lg:w-1/3 bg-surface border-t lg:border-t-0 lg:border-l border-slate-700 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-text-primary">Current Order</h2>
                <div className="mb-4">
                    <select value={selectedTableId} onChange={e => setSelectedTableId(e.target.value)} className="w-full p-2 bg-background border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="">Select a Table</option>
                        {availableTables.map(t => <option key={t.id} value={t.id}>{t.name} ({t.capacity} seats)</option>)}
                    </select>
                </div>
                <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                    {currentOrder.length === 0 ? (
                        <p className="text-text-secondary text-center mt-8">No items in order.</p>
                    ) : (
                        currentOrder.map(orderItem => {
                            const menuItem = menuItems.find(mi => mi.id === orderItem.menuItemId);
                            if (!menuItem) return null;
                            return (
                                <div key={menuItem.id} className="flex justify-between items-center bg-background p-2 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-text-primary text-sm">{menuItem.name}</p>
                                        <p className="text-xs text-text-secondary">${menuItem.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => removeFromOrder(menuItem.id)} className="font-bold text-lg w-6 h-6 rounded bg-surface-light">-</button>
                                        <span className="font-semibold w-4 text-center">{orderItem.quantity}</span>
                                        <button onClick={() => addToOrder(menuItem)} className="font-bold text-lg w-6 h-6 rounded bg-surface-light">+</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="border-t border-slate-700 pt-4 mt-2">
                     <div className="bg-background p-3 rounded-lg mb-4">
                        <button onClick={handleGetSuggestion} disabled={isSuggesting} className="text-sm w-full text-left text-secondary font-semibold disabled:opacity-50 transition-opacity">
                            {isSuggesting ? "Thinking..." : "✨ Get AI Suggestion"}
                        </button>
                        {suggestion && <p className="text-xs mt-2 text-text-secondary">{suggestion}</p>}
                    </div>
                    <div className="flex justify-between font-bold text-xl mb-4 text-text-primary">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button onClick={handlePlaceOrder} disabled={currentOrder.length === 0 || !selectedTableId} className="w-full bg-secondary text-background font-bold py-3 rounded-lg hover:bg-green-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};
