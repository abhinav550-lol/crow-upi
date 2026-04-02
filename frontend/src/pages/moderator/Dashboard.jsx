import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";

const ModeratorDashboard = () => {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    API.get("/disputes").then((r) => setDisputes(r.data.disputes)).catch(() => {});
  }, []);

  const open = disputes.filter((d) => d.status === "OPEN");
  const resolved = disputes.filter((d) => d.status !== "OPEN");

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Moderator Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Oversee and resolve marketplace disputes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center justify-center border-l-4 border-l-red-500">
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Open Disputes</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{open.length}</p>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center border-l-4 border-l-emerald-500">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Resolved</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{resolved.length}</p>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center border-l-4 border-l-blue-500">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{disputes.length}</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Open Disputes</h2>
        <Link to="/moderator/disputes" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">View all →</Link>
      </div>

      {open.length === 0 ? (
        <EmptyState icon="🎉" title="No open disputes" description="All disputes have been resolved. Great job!" />
      ) : (
        <div className="space-y-3">
          {open.slice(0, 5).map((d) => (
            <Link key={d.id} to={`/moderator/disputes/${d.id}`}>
              <Card hover className="p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{d.order.product.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{d.order.buyer.name} vs {d.order.seller.name} · ₹{d.order.amount}</p>
                  </div>
                  <OrderStatusBadge status={d.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;
