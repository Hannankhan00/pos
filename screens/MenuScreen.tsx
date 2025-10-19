
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { MenuItem } from '../types';
import { PageTitle } from '../components/PageTitle';
import { Modal } from '../components/Modal';
import { PlusIcon } from '../components/icons/PlusIcon';
import { getMenuDescription } from '../services/geminiService';

const MenuForm: React.FC<{
    initialItem?: MenuItem | null;
    onSave: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
    onCancel: () => void;
}> = ({ initialItem, onSave, onCancel }) => {
    const { menuCategories, stockItems } = useAppContext();
    const [item, setItem] = useState<Partial<MenuItem>>(initialItem || { name: '', price: 0, category: menuCategories[0] || '', description: '', imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`, stockItemId: '', stockRequired: 1 });
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setItem(prev => ({ ...prev, [name]: name === 'price' || name === 'stockRequired' ? parseFloat(value) : value }));
    };

    const handleGenerateDescription = async () => {
        if (!item.name || !item.category) {
            alert("Please enter an item name and select a category first.");
            return;
        }
        setIsGeneratingDesc(true);
        const description = await getMenuDescription(item.name, item.category);
        setItem(prev => ({ ...prev, description }));
        setIsGeneratingDesc(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item as MenuItem);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-text-secondary">Item Name</label>
                <input type="text" name="name" value={item.name} onChange={handleChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-text-secondary">Category</label>
                    <select name="category" value={item.category} onChange={handleChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required>
                        {menuCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Price</label>
                    <input type="number" name="price" value={item.price} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-text-secondary">Description</label>
                <textarea name="description" value={item.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2"></textarea>
                <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="mt-2 text-sm text-blue-400 hover:underline disabled:text-gray-500">{isGeneratingDesc ? 'Generating...' : 'Generate with AI'}</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-text-secondary">Linked Stock Item</label>
                    <select name="stockItemId" value={item.stockItemId} onChange={handleChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2">
                        <option value="">None</option>
                        {stockItems.map(si => <option key={si.id} value={si.id}>{si.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Stock units used</label>
                    <input type="number" name="stockRequired" value={item.stockRequired} onChange={handleChange} min="0" step="0.1" className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 font-semibold">Save Item</button>
            </div>
        </form>
    );
};


export const MenuScreen: React.FC = () => {
    const { menuItems, setMenuItems, menuCategories } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const groupedMenu = useMemo(() => {
        return menuCategories.reduce((acc, category) => {
            acc[category] = menuItems.filter(item => item.category === category);
            return acc;
        }, {} as Record<string, MenuItem[]>);
    }, [menuItems, menuCategories]);
    
    const handleSaveItem = (itemData: Omit<MenuItem, 'id'> | MenuItem) => {
        if ('id' in itemData) {
            setMenuItems(prev => prev.map(item => item.id === itemData.id ? itemData : item));
        } else {
            const newItem: MenuItem = { ...itemData, id: `m-${Date.now()}` } as MenuItem;
            setMenuItems(prev => [...prev, newItem]);
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            setMenuItems(prev => prev.filter(item => item.id !== itemId));
        }
    };
    
    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: MenuItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <PageTitle title="Menu Management">
                <button onClick={openAddModal} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Menu Item
                </button>
            </PageTitle>

            <div className="space-y-8">
                {menuCategories.map(category => (
                    <div key={category}>
                        <h2 className="text-2xl font-bold text-text-primary mb-4 border-b border-slate-700 pb-2">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedMenu[category].map(item => (
                                <div key={item.id} className="bg-surface rounded-lg shadow-md p-4 flex flex-col">
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg text-text-primary">{item.name}</h3>
                                            <p className="font-bold text-secondary text-lg">${item.price.toFixed(2)}</p>
                                        </div>
                                        <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button onClick={() => openEditModal(item)} className="text-sm px-3 py-1 rounded bg-slate-600 hover:bg-slate-500 font-semibold">Edit</button>
                                        <button onClick={() => handleDeleteItem(item.id)} className="text-sm px-3 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white font-semibold">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}>
                <MenuForm 
                    initialItem={editingItem}
                    onSave={handleSaveItem}
                    onCancel={() => { setIsModalOpen(false); setEditingItem(null); }} 
                />
            </Modal>
        </div>
    );
};
