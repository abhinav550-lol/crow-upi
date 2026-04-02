import { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate, onComplete }) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, Math.floor((new Date(targetDate) - Date.now()) / 1000));
      setRemaining(diff);
      if (diff <= 0 && onComplete) onComplete();
      return diff;
    };

    calc();
    const interval = setInterval(() => {
      if (calc() <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const pct = Math.min(100, (remaining / 48) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
          <circle
            cx="18" cy="18" r="15" fill="none"
            stroke={remaining > 10 ? "#2563eb" : "#ef4444"}
            strokeWidth="3"
            strokeDasharray={`${pct * 0.942} 100`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
          {remaining}s
        </span>
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        {remaining > 0 ? "Auto-release in" : "Released"}
      </span>
    </div>
  );
};

export default CountdownTimer;
