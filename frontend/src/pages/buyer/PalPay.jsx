import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const PalPay = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState("enter");
  const [error, setError] = useState("");

  const presets = [100, 500, 1000, 2000, 5000];

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setError("");
    setStep("processing");
    await new Promise((r) => setTimeout(r, 1800));
    try {
      await API.post("/wallet/add-money", { amount: Number(amount) });
      setStep("success");
      setTimeout(() => navigate("/buyer"), 2000);
    } catch (err) {
      setStep("enter");
      setError(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c1222] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="rounded-2xl overflow-hidden shadow-xl dark:shadow-none bg-white dark:bg-[#152039] border border-slate-200 dark:border-slate-700/50 animate-fade-in transition-colors duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-lg font-bold">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Pal<span className="text-blue-200">Pay</span>
                </h1>
                <p className="text-blue-200 text-xs font-medium">Secure Payment Gateway</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {step === "enter" && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Add funds to your CrowUPI wallet</p>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Enter Amount</h2>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 text-sm">{error}</div>
                )}

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-slate-500">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    autoFocus
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-[#0f1729] border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-3xl font-bold placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-center"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => setAmount(String(p))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 cursor-pointer ${
                        Number(amount) === p
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      ₹{p.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handlePay}
                  disabled={!amount || Number(amount) <= 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-bold transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Pay ₹{amount ? Number(amount).toLocaleString() : "0"}
                </button>

                <button
                  onClick={() => navigate("/buyer")}
                  className="w-full py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-all cursor-pointer font-medium"
                >
                  ← Back to Dashboard
                </button>

                <div className="flex items-center justify-center gap-4 pt-2 text-xs text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">🔒 SSL Secured</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">🛡️ Encrypted</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">✅ Verified</span>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                  <div className="absolute inset-3 rounded-full border-4 border-blue-400 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Processing Payment</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Verifying transaction of ₹{Number(amount).toLocaleString()}...</p>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500 flex items-center justify-center animate-bounce">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Payment Successful!</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">₹{Number(amount).toLocaleString()} added to your wallet</p>
                </div>
                <button
                  onClick={() => navigate("/buyer")}
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalPay;
