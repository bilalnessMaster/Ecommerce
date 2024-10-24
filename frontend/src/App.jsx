import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import SignupPage from "./pages/SignupPage.JSX";
import HomePage from "./pages/HomePage.jsx";
import SigninPage from "./pages/SigninPage.jsx";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.jsx";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { useCartStore } from "./stores/useCartStore.js";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "./pages/PurchaseCancelPage.jsx";
function App() {
  const Navigate = useNavigate();
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems, CartItems } = useCartStore();
  useEffect(() => {
    if(user) return
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if (!user) return;

    getCartItems();
  }, [getCartItems , user]);

  if (checkingAuth) return <Loader className="m-auto animate-spin mt-36" />;
  return (
    <>
      <Layout />
      <div className="max-w-7xl mx-auto">
        <Toaster position="bottom-right " />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path="/Signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route path="/Signin" element={!user ? <SigninPage /> : <Navigate to="/" />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />
            }
          />
          <Route path="/cart" element={!user ?<Navigate to="/" /> :<CartPage />} />
          <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
          <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
