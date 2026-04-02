import { useEffect, useState } from "react";
import API from "../../services/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/seller-orders").then((r) => { setOrders(r.data.orders); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Received Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Orders placed by buyers for your products</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon="📋" title="No orders received yet" description="When buyers purchase your products, orders will appear here." />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{o.product.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Buyer: {o.buyer.name} · ₹{o.amount}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={o.status} />
                  {o.disputed && <OrderStatusBadge status="DISPUTED" />}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
