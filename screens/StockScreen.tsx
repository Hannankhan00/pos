
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { StockItem } from '../types';
import { PageTitle } from '../components/PageTitle';
import { Modal } from '../components/Modal';
import { PlusIcon } from '../components/icons/PlusIcon';
import { getReorderSuggestions } from '../services/geminiService';

const StockForm: React.FC<{
    onSave: (item: Omit<StockItem, 'id'>) => void;
    onCancel: () => void;
}> = ({ onSave, onCancel }) => {
    const [item, setItem] = useState<Omit<StockItem, 'id'>>({ name: '', quantity: 0, unit: '', lowStockThreshold: 10 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setItem(prev => ({ ...prev, [name]: name === 'quantity' || name === 'lowStockThreshold' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item);
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary">Item Name</label>
                <input type="text" name="name" value={item.name} onChange={handleChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" placeholder="e.g., Angus Beef Patty" required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Current Quantity</label>
                    <input type="number" name="quantity" value={item.quantity} onChange={handleChange} min="0" className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary">Unit</label>
                    <input type="text" name="unit" value={item.unit} onChange={handleChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" placeholder="e.g., kg, patties, cans" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary">Low Stock Threshold</label>
                <input type="number" name="lowStockThreshold" value={item.lowStockThreshold} onChange={handleChange} min="0" className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 font-semibold">Add Item</button>
            </div>
        </form>
    );
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)\n/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/# (.*?)\n/g, '<h1 class="text-2xl font-extrabold mt-8 mb-4">$1</h1>')
        .replace(/^- (.*?)/gm, '<li class="ml-5 list-disc">$1</li>')
        .replace(/^\* (.*?)/gm, '<li class="ml-5 list-disc">$1</li>')
        .replace(/(<li.*?>.*?<\/li>)+/g, (match) => `<ul class="space-y-1">${match}</ul>`)
        .replace(/\n/g, '<br />')
        .replace(/<br \s*\/?><ul>/g, '<ul>')
        .replace(/<\/ul><br \s*\/?>/g, '</ul>');
    return <div className="text-text-secondary space-y-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


export const StockScreen: React.FC = () => {
    const { stockItems, setStockItems, orders } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAISuggestionModalOpen, setIsAISuggestionModalOpen] = useState(false);
    const [reorderSuggestions, setReorderSuggestions] = useState('');
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const handleSaveItem = (itemData: Omit<StockItem, 'id'>) => {
        const newItem: StockItem = { ...itemData, id: `s-${Date.now()}` };
        setStockItems(prev => [...prev, newItem].sort((a, b) => a.name.localeCompare(b.name)));
        setIsAddModalOpen(false);
    };

    const handleGetSuggestions = async () => {
        setIsAISuggestionModalOpen(true);
        setIsLoadingSuggestions(true);
        const suggestions = await getReorderSuggestions(stockItems, orders);
        setReorderSuggestions(suggestions);
        setIsLoadingSuggestions(false);
    };

    return (
        <div className="p-6">
            <PageTitle title="Stock Management">
                <div className="flex items-center space-x-2">
                    <button onClick={handleGetSuggestions} className="bg-secondary text-background px-4 py-2 rounded-lg hover:bg-green-500 font-semibold transition-colors">
                        AI Reorder Suggestions
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Stock Item
                    </button>
                </div>
            </PageTitle>

            <div className="bg-surface rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-surface-light">
                        <tr>
                            <th className="p-4 font-semibold">Item Name</th>
                            <th className="p-4 font-semibold">Quantity</th>
                            <th className="p-4 font-semibold">Unit</th>
                            <th className="p-4 font-semibold">Low Stock At</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockItems.map(item => {
                            const isLowStock = item.quantity <= item.lowStockThreshold;
                            return (
                                <tr key={item.id} className="border-b border-slate-700 last:border-b-0">
                                    <td className="p-4 text-text-primary">{item.name}</td>
                                    <td className={`p-4 font-bold ${isLowStock ? 'text-red-400' : 'text-text-primary'}`}>{item.quantity}</td>
                                    <td className="p-4 text-text-secondary">{item.unit}</td>
                                    <td className="p-4 text-text-secondary">{item.lowStockThreshold}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isLowStock ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {isLowStock ? 'Low Stock' : 'In Stock'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

             <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Stock Item">
                <StockForm onSave={handleSaveItem} onCancel={() => setIsAddModalOpen(false)} />
            </Modal>

            <Modal isOpen={isAISuggestionModalOpen} onClose={() => setIsAISuggestionModalOpen(false)} title="AI Reorder Suggestions">
                {isLoadingSuggestions ? (
                     <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                    </div>
                ) : (
                    <MarkdownRenderer content={reorderSuggestions} />
                )}
            </Modal>
        </div>
    );
};
