import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#0c1222] text-slate-900 dark:text-slate-200 transition-colors duration-300">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
  </div>
);

export default Layout;
