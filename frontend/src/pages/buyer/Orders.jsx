import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import CountdownTimer from "../../components/CountdownTimer";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    API.get("/orders/my-orders").then((r) => { setOrders(r.data.orders); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage your purchases</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon="📋" title="No orders yet" description="Your order history will appear here after your first purchase." />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">{o.product.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Seller: {o.seller.name} · ₹{o.amount}</p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={o.status} />
                  {o.status === "ESCROWED" && o.autoReleaseAt && (
                    <CountdownTimer targetDate={o.autoReleaseAt} onComplete={fetchOrders} />
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {o.status === "ESCROWED" && !o.disputed && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      const reason = prompt("Reason for dispute:");
                      if (!reason) return;
                      try {
                        await API.post(`/disputes/${o.id}`, { reason });
                        alert("Dispute raised!");
                        fetchOrders();
                      } catch (err) {
                        alert(err.response?.data?.message || "Failed");
                      }
                    }}
                  >
                    Raise Dispute
                  </Button>
                )}
                <Link to={`/buyer/orders/${o.id}`}>
                  <Button variant="secondary" size="sm">View Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
