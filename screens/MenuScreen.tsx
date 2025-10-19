import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Modal } from '../components/Modal';
import { getMenuDescription } from '../services/geminiService';
import { PageTitle } from '../components/PageTitle';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import type { MenuItem } from '../types';

const emptyMenuItem: Omit<MenuItem, 'id'> = {
  name: '',
  price: 0,
  category: '',
  description: '',
  imageUrl: 'https://picsum.photos/400/300',
  stockItemId: '',
  stockRequired: 1,
};

const MenuForm: React.FC<{
    item: Omit<MenuItem, 'id'> | MenuItem;
    onSave: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
    onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
    const { stockItems, menuCategories } = useAppContext();
    const [formState, setFormState] = useState(() => ({
        ...item,
        category: item.category || menuCategories[0] || '',
    }));
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: name === 'price' || name === 'stockRequired' ? parseFloat(value) : value }));
    };

    const handleGenerateDescription = async () => {
        if (!formState.name || !formState.category) {
            alert("Please enter a name and category first.");
            return;
        }
        setIsGenerating(true);
        const desc = await getMenuDescription(formState.name, formState.category);
        setFormState(prev => ({...prev, description: desc}));
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-text-secondary">Name</label>
                    <input type="text" name="name" value={formState.name} onChange={handleChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Category</label>
                    <select name="category" value={formState.category} onChange={handleChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2">
                        {menuCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary">Description</label>
                <textarea name="description" value={formState.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required></textarea>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="text-sm mt-2 text-secondary font-semibold disabled:opacity-50">
                    {isGenerating ? "Generating..." : "✨ Generate with AI"}
                </button>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-text-secondary">Price</label>
                    <input type="number" name="price" value={formState.price} onChange={handleChange} step="0.01" className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Tracked Stock Item</label>
                    <select name="stockItemId" value={formState.stockItemId} onChange={handleChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2">
                        <option value="">None</option>
                        {stockItems.map(si => <option key={si.id} value={si.id}>{si.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 font-semibold">Save Item</button>
            </div>
        </form>
    );
};

const CategoryManager: React.FC = () => {
    const { menuCategories, addCategory, deleteCategory } = useAppContext();
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = () => {
        if(addCategory(newCategory.trim())) {
            setNewCategory('');
        }
    };

    const handleDelete = (cat: string) => {
        if(window.confirm(`Are you sure you want to delete the "${cat}" category?`)) {
            deleteCategory(cat);
        }
    }

    return (
        <div className="bg-surface p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Manage Categories</h2>
            <div className="flex space-x-2 mb-3">
                <input 
                    type="text" 
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="flex-grow bg-background border border-slate-600 rounded-md p-2 text-sm"
                    placeholder="New category name..."
                />
                <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
                {menuCategories.map(cat => (
                    <div key={cat} className="bg-background rounded-full px-3 py-1 flex items-center space-x-2 text-sm">
                        <span>{cat}</span>
                        <button onClick={() => handleDelete(cat)} className="text-slate-400 hover:text-danger">
                            <TrashIcon className="w-3 h-3"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const MenuScreen: React.FC = () => {
    const { menuItems, setMenuItems } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const handleOpenModal = (item: MenuItem | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = (itemData: Omit<MenuItem, 'id'> | MenuItem) => {
        if ('id' in itemData) {
            setMenuItems(prev => prev.map(item => item.id === itemData.id ? itemData : item));
        } else {
            const newItem: MenuItem = { ...itemData, id: `m-${Date.now()}` };
            setMenuItems(prev => [...prev, newItem]);
        }
        handleCloseModal();
    };
    
    const handleDeleteItem = (id: string) => {
      if(window.confirm('Are you sure you want to delete this menu item?')) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
      }
    }

    return (
        <div className="p-6">
            <PageTitle title="Menu Management">
                <button onClick={() => handleOpenModal()} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add New Item
                </button>
            </PageTitle>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-surface rounded-lg shadow-md overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-700 bg-surface-light/50">
                                <tr>
                                    <th className="p-4 text-sm font-semibold tracking-wider">Name</th>
                                    <th className="p-4 text-sm font-semibold tracking-wider">Category</th>
                                    <th className="p-4 text-sm font-semibold tracking-wider">Price</th>
                                    <th className="p-4 text-sm font-semibold tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map(item => (
                                    <tr key={item.id} className="border-b border-slate-700 hover:bg-surface-light transition-colors">
                                        <td className="p-4 font-semibold">{item.name}</td>
                                        <td className="p-4 text-text-secondary">{item.category}</td>
                                        <td className="p-4 text-secondary font-bold">${item.price.toFixed(2)}</td>
                                        <td className="p-4 space-x-4">
                                            <button onClick={() => handleOpenModal(item)} className="text-blue-400 hover:text-blue-300 font-semibold">Edit</button>
                                            <button onClick={() => handleDeleteItem(item.id)} className="text-danger hover:text-red-400 font-semibold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <CategoryManager />
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Edit Menu Item' : 'Add New Item'}>
                <MenuForm 
                  item={editingItem || emptyMenuItem}
                  onSave={handleSaveItem}
                  onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};
