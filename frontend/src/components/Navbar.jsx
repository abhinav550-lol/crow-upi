import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleLinks = {
    BUYER: [
      { to: "/buyer", label: "Dashboard" },
      { to: "/buyer/products", label: "Browse" },
      { to: "/buyer/orders", label: "Orders" },
    ],
    SELLER: [
      { to: "/seller", label: "Dashboard" },
      { to: "/seller/products", label: "My Products" },
      { to: "/seller/orders", label: "Orders" },
    ],
    MODERATOR: [
      { to: "/moderator", label: "Dashboard" },
      { to: "/moderator/disputes", label: "Disputes" },
    ],
  };

  const links = user ? roleLinks[user.role] || [] : [];

  const roleBadgeColors = {
    BUYER: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
    SELLER: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
    MODERATOR: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700",
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#111a2e]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={user ? (user.role === "BUYER" ? "/buyer" : user.role === "SELLER" ? "/seller" : "/moderator") : "/"}
            className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            CrowUPI
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(l.to)
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

                {/* Dark mode toggle */}
                <button
                  onClick={toggle}
                  className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 cursor-pointer flex items-center p-0.5"
                  aria-label="Toggle dark mode"
                >
                  <div className={`w-6 h-6 rounded-full bg-white dark:bg-blue-500 shadow-sm flex items-center justify-center transition-all duration-300 ${dark ? "translate-x-7" : "translate-x-0"}`}>
                    {dark ? (
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadgeColors[user.role] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                  {user.role}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center ml-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-200">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Dark mode toggle for non-logged-in */}
                <button
                  onClick={toggle}
                  className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 cursor-pointer flex items-center p-0.5 mr-2"
                  aria-label="Toggle dark mode"
                >
                  <div className={`w-6 h-6 rounded-full bg-white dark:bg-blue-500 shadow-sm flex items-center justify-center transition-all duration-300 ${dark ? "translate-x-7" : "translate-x-0"}`}>
                    {dark ? (
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
                <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#111a2e] px-4 py-3 space-y-1 animate-slide-up">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className={`block px-4 py-2 rounded-lg text-sm font-medium ${isActive(l.to) ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-100"}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50 cursor-pointer">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-sm bg-blue-600 text-white text-center font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
