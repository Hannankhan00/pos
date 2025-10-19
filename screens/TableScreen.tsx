import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Table, TableStatus } from '../types';
import { Modal } from '../components/Modal';
import { PageTitle } from '../components/PageTitle';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { QrCodeIcon } from '../components/icons/QrCodeIcon';

const TableCard: React.FC<{ 
    table: Table; 
    onCardClick: (table: Table) => void;
    onDelete: (tableId: string) => void;
}> = ({ table, onCardClick, onDelete }) => {
    
    const getStatusStyles = () => {
        switch (table.status) {
            case TableStatus.AVAILABLE:
                return { border: 'border-green-500', bg: 'bg-green-500/10', hover: 'hover:bg-green-500/20', text: 'text-green-400' };
            case TableStatus.OCCUPIED:
                return { border: 'border-yellow-500', bg: 'bg-yellow-500/10', hover: 'hover:bg-yellow-500/20', text: 'text-yellow-400' };
            case TableStatus.NEEDS_BILLING:
                return { border: 'border-red-500', bg: 'bg-red-500/10', hover: 'hover:bg-red-500/20', text: 'text-red-400' };
            default:
                return { border: 'border-slate-600', bg: 'bg-slate-500/10', hover: 'hover:bg-slate-500/20', text: 'text-slate-400' };
        }
    };
    const { border, bg, hover, text } = getStatusStyles();

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event from firing
        if (window.confirm(`Are you sure you want to delete ${table.name}?`)) {
            onDelete(table.id);
        }
    }

    return (
        <div 
            onClick={() => onCardClick(table)}
            className={`relative p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 shadow-lg group ${border} ${bg} ${hover} hover:shadow-primary/30`}
        >
            <button 
                onClick={handleDeleteClick} 
                className="absolute top-2 right-2 p-1.5 rounded-full bg-surface/50 text-text-secondary hover:bg-danger hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Delete ${table.name}`}
            >
                <TrashIcon className="w-4 h-4" />
            </button>
            <p className="text-2xl font-bold text-text-primary">{table.name}</p>
            <p className="text-sm text-text-secondary">{table.capacity} seats</p>
            <p className={`mt-2 text-lg font-semibold ${text}`}>{table.status}</p>
        </div>
    );
};

const AddTableForm: React.FC<{ onSave: (name: string, capacity: number) => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState(2);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name, capacity);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary">Table Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" placeholder="e.g., Patio 3" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary">Capacity</label>
                <input type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value, 10))} min="1" className="mt-1 block w-full bg-background border border-slate-600 rounded-md p-2" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 font-semibold">Add Table</button>
            </div>
        </form>
    );
}

export const TableScreen: React.FC = () => {
    const { tables, addTable, deleteTable } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    const handleSaveTable = (name: string, capacity: number) => {
        addTable(name, capacity);
        setIsAddModalOpen(false);
    };

    const handleTableClick = (table: Table) => {
        setSelectedTable(table);
        setIsDetailModalOpen(true);
    };

    const customerUrl = selectedTable ? `${window.location.origin}${window.location.pathname}?view=customer&tableId=${selectedTable.id}` : '';
    const qrCodeUrl = selectedTable ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(customerUrl)}` : '';

    return (
        <div className="p-6">
            <PageTitle title="Table Management">
                 <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Table
                </button>
            </PageTitle>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {tables.map(table => (
                    <TableCard key={table.id} table={table} onCardClick={handleTableClick} onDelete={deleteTable} />
                ))}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Table">
                <AddTableForm onSave={handleSaveTable} onCancel={() => setIsAddModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title={`Details for ${selectedTable?.name}`}>
                {selectedTable && (
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Customer QR Code</h3>
                        <p className="text-text-secondary mb-4">Customers can scan this code to open the menu and order directly from their table.</p>
                        <div className="flex justify-center p-4 bg-white rounded-lg">
                           {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code for table ordering" /> : <p>Loading QR Code...</p>}
                        </div>
                         <a href={customerUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm text-blue-400 hover:underline">
                            {customerUrl}
                        </a>
                    </div>
                )}
            </Modal>
        </div>
    );
};
