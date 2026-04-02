const Card = ({ children, className = "", hover = false, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-[#152039] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none ${
        hover ? "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200" : ""
      } transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
