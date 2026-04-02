const Skeleton = ({ className = "", variant = "rect" }) => {
  const base = "animate-pulse bg-slate-200 dark:bg-slate-700 rounded";

  if (variant === "circle") {
    return <div className={`${base} rounded-full ${className}`} />;
  }

  if (variant === "text") {
    return <div className={`${base} h-4 ${className}`} />;
  }

  return <div className={`${base} ${className}`} />;
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#152039] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none p-6 space-y-4">
    <Skeleton className="h-40 w-full rounded-lg" />
    <Skeleton variant="text" className="w-3/4" />
    <Skeleton variant="text" className="w-1/2" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton variant="text" className="w-20" />
      <Skeleton className="h-9 w-24 rounded-lg" />
    </div>
  </div>
);

export { Skeleton, SkeletonCard };
export default Skeleton;
