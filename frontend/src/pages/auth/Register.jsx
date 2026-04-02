import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const roles = [
  { value: "BUYER", label: "Buyer", icon: "🛒", desc: "Buy products & use wallet" },
  { value: "SELLER", label: "Seller", icon: "🏪", desc: "List products & receive payments" },
  { value: "MODERATOR", label: "Moderator", icon: "⚖️", desc: "Resolve disputes" },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUYER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      const dashMap = { BUYER: "/buyer", SELLER: "/seller", MODERATOR: "/moderator" };
      navigate(dashMap[data.user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#152039] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-lg dark:shadow-none p-8 animate-fade-in transition-colors duration-300">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose your role to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setForm({ ...form, role: r.value })}
                className={`p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                  form.role === r.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "border-slate-200 dark:border-slate-600 bg-white dark:bg-[#0f1729] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                }`}
              >
                <div className="text-2xl mb-1">{r.icon}</div>
                <div className="text-xs font-semibold">{r.label}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            <Input label="Password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
