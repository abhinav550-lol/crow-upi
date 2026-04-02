import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/products", { ...form, price: Number(form.price) });
      navigate("/seller/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Product</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">List a new product for buyers to purchase</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Product Name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Premium Widget" />
          <Input label="Description" type="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe your product..." />
          <Input label="Price (₹)" type="number" required min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="999" />
          <Input label="Image URL (optional)" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
