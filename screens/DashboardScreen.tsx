import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { getBusinessInsights } from '../services/geminiService';
import { OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PageTitle } from '../components/PageTitle';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-surface p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-all hover:shadow-primary/20 hover:scale-105 duration-300">
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-text-secondary text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

export const DashboardScreen: React.FC = () => {
    const { orders, menuItems, tables } = useAppContext();
    const [insights, setInsights] = useState('Click "Regenerate" to get AI-powered insights on your sales data.');
    const [isLoading, setIsLoading] = useState(false);

    const totalSales = orders
        .filter(o => o.status === OrderStatus.PAID)
        .reduce((sum, order) => sum + order.total, 0)
        .toFixed(2);
    
    const activeOrders = orders.filter(o => ![OrderStatus.PAID, OrderStatus.CANCELLED].includes(o.status)).length;
    const availableTables = tables.filter(t => t.status === 'Available').length;
    
    // Mock data for sales chart, can be replaced with real aggregated data
    const salesData = [
        { name: 'Breakfast', sales: orders.filter(o => new Date(o.createdAt).getHours() < 11).reduce((sum, o) => sum + o.total, 0) },
        { name: 'Lunch', sales: orders.filter(o => new Date(o.createdAt).getHours() >= 11 && new Date(o.createdAt).getHours() < 16).reduce((sum, o) => sum + o.total, 0) },
        { name: 'Dinner', sales: orders.filter(o => new Date(o.createdAt).getHours() >= 16 && new Date(o.createdAt).getHours() < 21).reduce((sum, o) => sum + o.total, 0) },
        { name: 'Late Night', sales: orders.filter(o => new Date(o.createdAt).getHours() >= 21).reduce((sum, o) => sum + o.total, 0) },
    ].filter(d => d.sales > 0);


    const handleGenerateInsights = useCallback(async () => {
        if(orders.length === 0) {
            setInsights("No order data available to generate insights.");
            return;
        }
        setIsLoading(true);
        const result = await getBusinessInsights(orders, menuItems);
        setInsights(result);
        setIsLoading(false);
    }, [orders, menuItems]);
    
    useEffect(() => {
        handleGenerateInsights();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <PageTitle title="Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Sales Today" value={`$${totalSales}`} icon={<span className="text-2xl">💰</span>} color="bg-green-500/20" />
                <StatCard title="Active Orders" value={activeOrders} icon={<span className="text-2xl">🔥</span>} color="bg-orange-500/20" />
                <StatCard title="Available Tables" value={`${availableTables} / ${tables.length}`} icon={<span className="text-2xl">🪑</span>} color="bg-blue-500/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="bg-surface p-6 rounded-xl shadow-lg lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">Sales Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        {salesData.length > 0 ? (
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #4b5563', borderRadius: '0.75rem' }}/>
                                <Legend />
                                <Bar dataKey="sales" fill="#10b981" name="Sales ($)" />
                            </BarChart>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">No sales data for today yet.</div>
                        )}
                    </ResponsiveContainer>
                </div>

                <div className="bg-surface p-6 rounded-xl shadow-lg lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-text-primary">AI Business Insights</h2>
                        <button onClick={handleGenerateInsights} disabled={isLoading} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-sm font-semibold transition-colors">
                            {isLoading ? 'Generating...' : 'Regenerate'}
                        </button>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary"></div>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none text-text-secondary h-48 overflow-y-auto" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }}></div>
                    )}
                </div>
            </div>
        </div>
    );
};
