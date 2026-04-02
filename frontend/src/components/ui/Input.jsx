const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      {props.type === "textarea" ? (
        <textarea
          {...props}
          type={undefined}
          className={`w-full px-4 py-2.5 rounded-lg bg-white dark:bg-[#0f1729] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
            error ? "border-red-400 focus:ring-red-500/20 focus:border-red-500" : ""
          } ${className}`}
        />
      ) : (
        <input
          {...props}
          className={`w-full px-4 py-2.5 rounded-lg bg-white dark:bg-[#0f1729] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
            error ? "border-red-400 focus:ring-red-500/20 focus:border-red-500" : ""
          } ${className}`}
        />
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
