import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import CountdownTimer from "../../components/CountdownTimer";
import ChatBox from "../../components/ChatBox";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const fetch = () => API.get(`/orders/${id}`).then((r) => setOrder(r.data.order));
  useEffect(() => { fetch(); }, [id]);

  if (!order) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    );
  }

  const steps = ["ESCROWED", "DISPUTED", "RELEASED"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Order Details</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Order #{order.id?.slice(0, 8)}</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i <= currentStep
                    ? step === "DISPUTED" ? "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400" : "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                }`}>
                  {i <= currentStep ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-1 font-medium ${i <= currentStep ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
                  {step.charAt(0) + step.slice(1).toLowerCase()}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{order.product.name}</h2>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div><span className="text-slate-500 dark:text-slate-400">Amount:</span> <span className="font-medium text-slate-900 dark:text-slate-100">₹{order.amount}</span></div>
          <div><span className="text-slate-500 dark:text-slate-400">Seller:</span> <span className="font-medium text-slate-900 dark:text-slate-100">{order.seller.name}</span></div>
          <div><span className="text-slate-500 dark:text-slate-400">Buyer:</span> <span className="font-medium text-slate-900 dark:text-slate-100">{order.buyer.name}</span></div>
          <div><span className="text-slate-500 dark:text-slate-400">Date:</span> <span className="font-medium text-slate-900 dark:text-slate-100">{new Date(order.createdAt).toLocaleDateString()}</span></div>
        </div>

        {order.status === "ESCROWED" && order.autoReleaseAt && (
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50">
            <CountdownTimer targetDate={order.autoReleaseAt} onComplete={fetch} />
          </div>
        )}

        {order.escrow && (
          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50">
            <span className="text-sm text-slate-500 dark:text-slate-400">Escrow Status:</span>
            <OrderStatusBadge status={order.escrow.status} />
          </div>
        )}
      </Card>

      {order.dispute && (
        <div className="space-y-4">
          <Card className="p-4 border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-medium text-red-800 dark:text-red-300">Dispute: {order.dispute.reason}</span>
              </div>
              <OrderStatusBadge status={order.dispute.status} />
            </div>
          </Card>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Dispute Chat</h3>
            <ChatBox disputeId={order.dispute.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
