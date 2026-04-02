const EmptyState = ({ icon = "📭", title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#111a2e]/50">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
