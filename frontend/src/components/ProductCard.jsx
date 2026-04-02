import Card from "./ui/Card";
import Button from "./ui/Button";

const ProductCard = ({ product, onAction, actionLabel }) => {
  return (
    <Card hover className="p-0 overflow-hidden flex flex-col group">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-slate-100 dark:bg-[#111a2e] flex items-center justify-center text-4xl">
          📦
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{product.description}</p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">₹{product.price}</span>
          {product.seller && (
            <span className="text-xs text-slate-400 dark:text-slate-500">by {product.seller.name}</span>
          )}
        </div>

        {onAction && (
          <Button onClick={() => onAction(product)} className="mt-3 w-full" size="md">
            {actionLabel || "Buy Now"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
