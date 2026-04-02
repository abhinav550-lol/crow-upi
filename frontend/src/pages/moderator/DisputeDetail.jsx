import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import ChatBox from "../../components/ChatBox";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

const DisputeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState(null);
  const [resolving, setResolving] = useState(false);

  const fetch = () => API.get(`/disputes/${id}`).then((r) => setDispute(r.data.dispute));
  useEffect(() => { fetch(); }, [id]);

  const resolve = async (action) => {
    const label = action === "seller" ? "seller (release funds)" : "buyer (refund)";
    if (!confirm(`Resolve in favor of ${label}?`)) return;
    setResolving(true);
    try {
      await API.patch(`/disputes/${id}/resolve-${action}`);
      alert(`Dispute resolved for ${action}!`);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setResolving(false);
    }
  };

  if (!dispute) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dispute Details</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review evidence and resolve the dispute</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{dispute.order.product.name}</h2>
          <OrderStatusBadge status={dispute.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Buyer:</span>{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">{dispute.order.buyer.name}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Seller:</span>{" "}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{dispute.order.seller.name}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Amount:</span>{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">₹{dispute.order.amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Escrow:</span>
            <OrderStatusBadge status={dispute.order.escrow?.status || "N/A"} />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Reason:</span>{" "}
          <span className="text-red-700 dark:text-red-300">{dispute.reason}</span>
        </div>

        {dispute.status === "OPEN" && (
          <div className="flex gap-3 pt-2">
            <Button onClick={() => resolve("seller")} disabled={resolving} variant="success" className="flex-1" size="lg">
              ✅ Release to Seller
            </Button>
            <Button onClick={() => resolve("buyer")} disabled={resolving} variant="warning" className="flex-1" size="lg">
              💰 Refund Buyer
            </Button>
          </div>
        )}
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Dispute Chat</h3>
        <ChatBox disputeId={dispute.id} />
      </div>
    </div>
  );
};

export default DisputeDetail;
