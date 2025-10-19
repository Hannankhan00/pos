
import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { PageTitle } from '../components/PageTitle';
import { OrderStatus } from '../types';
import { getBusinessInsights } from '../services/geminiService';
import { BarChartIcon } from '../components/icons/BarChartIcon';
import { ShoppingCartIcon } from '../components/icons/ShoppingCartIcon';
import { PackageIcon } from '../components/icons/PackageIcon';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface rounded-xl p-6 flex items-center space-x-4 shadow-lg">
        <div className="bg-surface-light p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary font-medium">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

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


export const DashboardScreen: React.FC = () => {
    const { orders, menuItems, stockItems } = useAppContext();
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoading(true);
            try {
                const result = await getBusinessInsights(orders, menuItems);
                setInsights(result);
            } catch (error) {
                console.error("Failed to fetch insights:", error);
                setInsights("Could not load AI insights at the moment.");
            } finally {
                setIsLoading(false);
            }
        };
        
        if (orders.length > 0) {
            fetchInsights();
        } else {
            setInsights("No order data available yet to generate insights.");
            setIsLoading(false);
        }
    }, [orders, menuItems]);

    const dashboardStats = useMemo(() => {
        const completedOrders = orders.filter(o => o.status === OrderStatus.PAID || o.status === OrderStatus.SERVED);
        const totalRevenue = completedOrders.reduce((acc, order) => acc + order.total, 0);
        const ordersToday = orders.length;
        const avgOrderValue = ordersToday > 0 ? totalRevenue / ordersToday : 0;
        return {
            totalRevenue: `$${totalRevenue.toFixed(2)}`,
            ordersToday: ordersToday.toString(),
            avgOrderValue: `$${avgOrderValue.toFixed(2)}`,
        };
    }, [orders]);

    const lowStockItems = useMemo(() => {
        return stockItems.filter(item => item.quantity <= item.lowStockThreshold);
    }, [stockItems]);

    return (
        <div className="p-6">
            <PageTitle title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Revenue" value={dashboardStats.totalRevenue} icon={<BarChartIcon className="h-6 w-6 text-secondary" />} />
                <StatCard title="Orders Today" value={dashboardStats.ordersToday} icon={<ShoppingCartIcon className="h-6 w-6 text-primary" />} />
                <StatCard title="Avg. Order Value" value={dashboardStats.avgOrderValue} icon={<BarChartIcon className="h-6 w-6 text-yellow-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                        <BarChartIcon className="h-6 w-6 text-secondary mr-2" />
                        AI Business Insights
                    </h2>
                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                        </div>
                    ) : (
                        <MarkdownRenderer content={insights} />
                    )}
                </div>

                <div className="bg-surface rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                        <PackageIcon className="h-6 w-6 text-yellow-500 mr-2" />
                        Low Stock Alert
                    </h2>
                    {lowStockItems.length > 0 ? (
                        <ul className="space-y-3">
                            {lowStockItems.map(item => (
                                <li key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-text-primary">{item.name}</span>
                                    <span className="font-bold text-red-400">{item.quantity} {item.unit} left</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-text-secondary mt-4">All stock levels are good.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
