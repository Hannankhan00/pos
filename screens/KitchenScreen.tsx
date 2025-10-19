import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Order, OrderStatus, MenuItem } from '../types';

const OrderTicket: React.FC<{ order: Order; menuItems: MenuItem[]; onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void; }> = ({ order, menuItems, onUpdateStatus }) => {
    
    const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
        [OrderStatus.PENDING]: OrderStatus.PREPARING,
        [OrderStatus.PREPARING]: OrderStatus.READY,
    };
    const nextStatus = nextStatusMap[order.status];

    const prevStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
        [OrderStatus.PREPARING]: OrderStatus.PENDING,
        [OrderStatus.READY]: OrderStatus.PREPARING,
    };
    const prevStatus = prevStatusMap[order.status];

    const timeSince = new Date().getTime() - new Date(order.createdAt).getTime();
    const minutes = Math.floor(timeSince / 60000);

    const timeColor = minutes > 15 ? 'text-red-400' : minutes > 7 ? 'text-yellow-400' : 'text-text-secondary';

    return (
        <div className="bg-surface p-4 rounded-lg shadow-lg w-80 flex-shrink-0 flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-slate-600 pb-2">
                <h3 className="font-bold text-lg text-text-primary">{order.tableId}</h3>
                <span className={`text-sm font-semibold ${timeColor}`}>{minutes}m ago</span>
            </div>
            <ul className="space-y-1 mb-4 flex-grow">
                {order.items.map((item, index) => {
                    const menuItem = menuItems.find(m => m.id === item.menuItemId);
                    return (
                        <li key={index} className="flex text-sm text-text-primary">
                            <span className="font-bold mr-2">{item.quantity}x</span>
                            <span>{menuItem?.name || 'Unknown Item'}</span>
                        </li>
                    )
                })}
            </ul>
            <div className="flex justify-between items-center mt-2">
                 {prevStatus ? (
                    <button onClick={() => onUpdateStatus(order.id, prevStatus)} className="text-xs px-3 py-1 rounded bg-slate-600 hover:bg-slate-500 font-semibold transition-colors">Back</button>
                 ) : <div></div>}
                 {nextStatus && <button onClick={() => onUpdateStatus(order.id, nextStatus)} className="text-sm px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 font-semibold transition-colors">{nextStatus}</button>}
            </div>
        </div>
    );
};

const KDSColumn: React.FC<{ title: OrderStatus; orders: Order[]; color: string }> = ({ title, orders, color }) => {
    const { menuItems, updateOrderStatus } = useAppContext();
    return (
        <div className="bg-background rounded-lg p-3 w-88 flex flex-col flex-shrink-0 h-full">
            <h2 className={`font-bold text-xl mb-4 text-center p-2 rounded-md ${color} text-text-primary`}>{title} ({orders.length})</h2>
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {orders.length > 0 ? (
                    orders.map(order => <OrderTicket key={order.id} order={order} menuItems={menuItems} onUpdateStatus={updateOrderStatus} />)
                ) : (
                    <div className="text-center text-text-secondary mt-10">No orders</div>
                )}
            </div>
        </div>
    );
};

export const KitchenScreen: React.FC = () => {
    const { orders } = useAppContext();

    const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const preparingOrders = orders.filter(o => o.status === OrderStatus.PREPARING).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const readyOrders = orders.filter(o => o.status === OrderStatus.READY).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return (
        <div className="flex space-x-4 p-4 overflow-x-auto h-[calc(100vh-65px)]">
            <KDSColumn title={OrderStatus.PENDING} orders={pendingOrders} color="bg-red-800/50"/>
            <KDSColumn title={OrderStatus.PREPARING} orders={preparingOrders} color="bg-yellow-800/50" />
            <KDSColumn title={OrderStatus.READY} orders={readyOrders} color="bg-green-800/50" />
        </div>
    );
};
