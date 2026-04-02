import { useEffect, useState } from "react";
import API from "../../services/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";

const SellerDashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/wallet/me").then((r) => setWallet(r.data.wallet)).catch(() => {});
    API.get("/orders/seller-orders").then((r) => setOrders(r.data.orders)).catch(() => {});
    API.get("/products/seller/mine").then((r) => setProducts(r.data.products)).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Seller Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your products and track sales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-lg shadow-emerald-600/20 dark:shadow-emerald-900/30">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-sm text-emerald-100 font-medium">Wallet Balance</p>
            <p className="text-3xl font-bold tracking-tight mt-1">₹{wallet?.balance?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
        <Card className="p-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Products Listed</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{products.length}</p>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{orders.length}</p>
        </Card>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Orders</h2>
      {orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders received yet" description="Orders from buyers will show up here." />
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 5).map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{o.product.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Buyer: {o.buyer.name} · ₹{o.amount}</p>
                </div>
                <OrderStatusBadge status={o.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
