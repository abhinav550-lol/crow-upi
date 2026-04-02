import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";

const Disputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    API.get("/disputes").then((r) => { setDisputes(r.data.disputes); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? disputes : disputes.filter((d) => d.status === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-2">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-8 w-20 rounded-lg" />)}</div>
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Disputes</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review and resolve marketplace disputes</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "OPEN", "RESOLVED_FOR_SELLER", "RESOLVED_FOR_BUYER", "CLOSED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              filter === f
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/30"
            }`}
          >
            {f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No disputes found" description="No disputes match the selected filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <Link key={d.id} to={`/moderator/disputes/${d.id}`}>
              <Card hover className="p-5 mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{d.order.product.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{d.order.buyer.name} vs {d.order.seller.name} · ₹{d.order.amount}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Reason: {d.reason}</p>
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

export default Disputes;
