import React, { useState, useCallback } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { getReorderSuggestions } from '../services/geminiService';
import { PageTitle } from '../components/PageTitle';

export const StockScreen: React.FC = () => {
    const { stockItems, orders } = useAppContext();
    const [report, setReport] = useState('Click "Generate" to get an AI-powered reorder suggestion list based on current stock and sales velocity.');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateReport = useCallback(async () => {
        setIsLoading(true);
        const result = await getReorderSuggestions(stockItems, orders);
        setReport(result);
        setIsLoading(false);
    }, [stockItems, orders]);

    return (
        <div className="p-6">
            <PageTitle title="Stock Management" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-700 bg-surface-light/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold tracking-wider">Item Name</th>
                                <th className="p-4 text-sm font-semibold tracking-wider">Quantity</th>
                                <th className="p-4 text-sm font-semibold tracking-wider">Unit</th>
                                <th className="p-4 text-sm font-semibold tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockItems.map(item => {
                                const isLowStock = item.quantity <= item.lowStockThreshold;
                                return (
                                    <tr key={item.id} className="border-b border-slate-700 hover:bg-surface-light transition-colors">
                                        <td className="p-4 font-semibold">{item.name}</td>
                                        <td className={`p-4 font-bold ${isLowStock ? 'text-red-400' : 'text-text-primary'}`}>{item.quantity}</td>
                                        <td className="p-4 text-text-secondary">{item.unit}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isLowStock ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                                {isLowStock ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="lg:col-span-1 bg-surface p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-text-primary">AI Reorder Report</h2>
                        <button onClick={handleGenerateReport} disabled={isLoading} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-sm font-semibold">
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full min-h-[300px]">
                           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary"></div>
                        </div>
                    ) : (
                         <div className="prose prose-sm prose-invert max-w-none text-text-secondary h-96 overflow-y-auto" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />') }}></div>
                    )}
                </div>
            </div>
        </div>
    );
};
