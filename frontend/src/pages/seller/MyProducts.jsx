import { useEffect, useState } from "react";
import API from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { Link } from "react-router-dom";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => API.get("/products/seller/mine").then((r) => { setProducts(r.data.products); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const toggleActive = async (p) => {
    try {
      await API.patch(`/products/${p.id}`, { isActive: !p.isActive });
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your product listings</p>
        </div>
        <Link to="/seller/products/new"><Button>+ Add Product</Button></Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon="🏪"
          title="No products yet"
          description="Start listing products to sell on the marketplace."
          action={<Link to="/seller/products/new"><Button>Add Your First Product</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <Card key={p.id} className={`p-5 ${!p.isActive ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">₹{p.price} {!p.isActive && "· Inactive"}</p>
                  </div>
                </div>
                <Button onClick={() => toggleActive(p)} variant={p.isActive ? "danger" : "success"} size="sm">
                  {p.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
