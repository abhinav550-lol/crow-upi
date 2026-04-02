import { useEffect, useState } from "react";
import WalletCard from "../../components/WalletCard";
import API from "../../services/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const BuyerDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/my-orders").then((r) => setOrders(r.data.orders)).catch(() => {});
  }, []);

  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Buyer Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WalletCard />
        <Card className="p-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{orders.length}</p>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active Disputes</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{orders.filter((o) => o.disputed).length}</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Orders</h2>
        <Link to="/buyer/orders" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">View all →</Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="No orders yet"
          description="Start shopping to see your orders here."
          action={<Button as={Link} onClick={() => window.location.href = "/buyer/products"}>Browse Products</Button>}
        />
      ) : (
        <div className="space-y-3">
          {recent.map((o) => (
            <Link key={o.id} to={`/buyer/orders/${o.id}`}>
              <Card hover className="p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{o.product.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">₹{o.amount}</p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
