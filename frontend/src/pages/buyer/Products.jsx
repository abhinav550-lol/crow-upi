import { useEffect, useState } from "react";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Skeleton";
import { useNavigate } from "react-router-dom";

const BuyerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products").then((r) => { setProducts(r.data.products); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleBuy = async (product) => {
    if (!confirm(`Buy "${product.name}" for ₹${product.price}?`)) return;
    try {
      await API.post(`/orders/${product.id}`);
      alert("Order placed! Funds locked in escrow.");
      navigate("/buyer/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Browse Products</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Discover products from verified sellers</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState icon="📦" title="No products available" description="Check back later for new listings from sellers." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAction={handleBuy} actionLabel="Buy Now" />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerProducts;
