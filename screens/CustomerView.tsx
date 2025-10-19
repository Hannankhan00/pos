import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { MenuItem, OrderItem } from '../types';
import { ChefHatIcon } from '../components/icons/ChefHatIcon';

const CustomerMenuItem: React.FC<{ item: MenuItem, onAddToCart: (item: MenuItem) => void }> = ({ item, onAddToCart }) => (
    <div className="bg-surface rounded-xl p-4 flex space-x-4 shadow-lg">
        <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
        <div className="flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-text-primary">{item.name}</h3>
            <p className="text-sm text-text-secondary flex-grow my-1">{item.description}</p>
            <div className="flex justify-between items-center mt-2">
                <span className="text-secondary font-bold text-lg">${item.price.toFixed(2)}</span>
                <button onClick={() => onAddToCart(item)} className="bg-primary text-white px-5 py-1.5 rounded-full hover:bg-blue-700 font-semibold text-sm transition-transform hover:scale-105">Add</button>
            </div>
        </div>
    </div>
);

type OrderType = 'Dine-in' | 'Takeaway';

export const CustomerView: React.FC<{ customerTableId?: string }> = ({ customerTableId }) => {
    const { menuItems, placeOrder, tables } = useAppContext();
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderType, setOrderType] = useState<OrderType>(customerTableId ? 'Dine-in' : 'Takeaway');
    
    const tableName = useMemo(() => {
        if (!customerTableId) return null;
        return tables.find(t => t.id === customerTableId)?.name || `Table ${customerTableId}`;
    }, [customerTableId, tables]);

    useEffect(() => {
        if(customerTableId) {
            setOrderType('Dine-in');
        }
    }, [customerTableId]);

    const addToCart = (item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(ci => ci.menuItemId === item.id);
            if (existingItem) {
                return prevCart.map(ci => ci.menuItemId === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
            }
            return [...prevCart, { menuItemId: item.id, quantity: 1 }];
        });
    };

    const total = useMemo(() => {
        return cart.reduce((acc, cartItem) => {
            const menuItem = menuItems.find(mi => mi.id === cartItem.menuItemId);
            return acc + (menuItem ? menuItem.price * cartItem.quantity : 0);
        }, 0);
    }, [cart, menuItems]);

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;
        const orderId = orderType === 'Dine-in' && customerTableId ? customerTableId : `Takeaway-${Date.now()}`;
        placeOrder(orderId, cart);
        setCart([]);
        setOrderPlaced(true);
        window.scrollTo(0, 0);
        setTimeout(() => setOrderPlaced(false), 5000);
    };

    return (
        <div className="min-h-screen bg-background text-text-primary p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <div className="flex justify-center items-center gap-3">
                       <ChefHatIcon className="w-10 h-10 text-secondary" />
                       <h1 className="text-4xl font-extrabold text-text-primary">Our Menu</h1>
                    </div>
                    <p className="text-text-secondary mt-2">
                        {tableName ? `Welcome to ${tableName}!` : 'Order for takeaway.'}
                    </p>
                </header>
                
                {orderPlaced && (
                    <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Order Placed! </strong>
                        <span className="block sm:inline">Your order has been sent to the kitchen. Thank you!</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {menuItems.map(item => (
                            <CustomerMenuItem key={item.id} item={item} onAddToCart={addToCart} />
                        ))}
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-surface rounded-xl p-4 sticky top-8 shadow-lg">
                            <h2 className="text-2xl font-bold border-b border-slate-700 pb-2 mb-4">Your Order</h2>
                            {!customerTableId && (
                                <div className="flex bg-background rounded-lg p-1 mb-4">
                                    <button onClick={() => setOrderType('Dine-in')} className={`w-1/2 py-2 rounded-md text-sm font-semibold ${orderType === 'Dine-in' ? 'bg-primary text-white' : ''}`}>Dine-in</button>
                                    <button onClick={() => setOrderType('Takeaway')} className={`w-1/2 py-2 rounded-md text-sm font-semibold ${orderType === 'Takeaway' ? 'bg-primary text-white' : ''}`}>Takeaway</button>
                                </div>
                            )}
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                {cart.length === 0 ? (
                                    <p className="text-text-secondary text-center py-4">Your cart is empty.</p>
                                ) : (
                                    cart.map(cartItem => {
                                        const menuItem = menuItems.find(mi => mi.id === cartItem.menuItemId);
                                        if (!menuItem) return null;
                                        return (
                                            <div key={menuItem.id} className="flex justify-between items-center text-sm">
                                                <div>
                                                    <p className="font-semibold">{menuItem.name}</p>
                                                    <p className="text-text-secondary">${menuItem.price.toFixed(2)}</p>
                                                </div>
                                                <p className="font-bold">x {cartItem.quantity}</p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="border-t border-slate-700 pt-4 mt-4">
                                <div className="flex justify-between font-bold text-xl mb-4">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <button onClick={handlePlaceOrder} disabled={cart.length === 0} className="w-full bg-secondary text-background font-bold py-3 rounded-lg hover:bg-green-500 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105">
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
