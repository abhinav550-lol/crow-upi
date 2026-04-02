import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui/Toast";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Buyer pages
import BuyerDashboard from "./pages/buyer/Dashboard";
import BuyerProducts from "./pages/buyer/Products";
import BuyerOrders from "./pages/buyer/Orders";
import BuyerOrderDetail from "./pages/buyer/OrderDetail";
import PalPay from "./pages/buyer/PalPay";

// Seller pages
import SellerDashboard from "./pages/seller/Dashboard";
import MyProducts from "./pages/seller/MyProducts";
import AddProduct from "./pages/seller/AddProduct";
import SellerOrders from "./pages/seller/Orders";

// Moderator pages
import ModeratorDashboard from "./pages/moderator/Dashboard";
import Disputes from "./pages/moderator/Disputes";
import DisputeDetail from "./pages/moderator/DisputeDetail";

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const dashMap = { BUYER: "/buyer", SELLER: "/seller", MODERATOR: "/moderator" };
  return <Navigate to={dashMap[user.role] || "/login"} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* PalPay — outside Layout so no navbar */}
              <Route path="buyer/add-money" element={<ProtectedRoute roles={["BUYER"]}><PalPay /></ProtectedRoute>} />

              <Route path="/" element={<Layout />}>
                <Route index element={<RootRedirect />} />

                {/* Auth */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* Buyer */}
                <Route path="buyer" element={<ProtectedRoute roles={["BUYER"]}><BuyerDashboard /></ProtectedRoute>} />
                <Route path="buyer/products" element={<ProtectedRoute roles={["BUYER"]}><BuyerProducts /></ProtectedRoute>} />
                <Route path="buyer/orders" element={<ProtectedRoute roles={["BUYER"]}><BuyerOrders /></ProtectedRoute>} />
                <Route path="buyer/orders/:id" element={<ProtectedRoute roles={["BUYER"]}><BuyerOrderDetail /></ProtectedRoute>} />

                {/* Seller */}
                <Route path="seller" element={<ProtectedRoute roles={["SELLER"]}><SellerDashboard /></ProtectedRoute>} />
                <Route path="seller/products" element={<ProtectedRoute roles={["SELLER"]}><MyProducts /></ProtectedRoute>} />
                <Route path="seller/products/new" element={<ProtectedRoute roles={["SELLER"]}><AddProduct /></ProtectedRoute>} />
                <Route path="seller/orders" element={<ProtectedRoute roles={["SELLER"]}><SellerOrders /></ProtectedRoute>} />

                {/* Moderator */}
                <Route path="moderator" element={<ProtectedRoute roles={["MODERATOR"]}><ModeratorDashboard /></ProtectedRoute>} />
                <Route path="moderator/disputes" element={<ProtectedRoute roles={["MODERATOR"]}><Disputes /></ProtectedRoute>} />
                <Route path="moderator/disputes/:id" element={<ProtectedRoute roles={["MODERATOR"]}><DisputeDetail /></ProtectedRoute>} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
