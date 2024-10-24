import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Layout = () => {
  const { user, logout } = useUserStore();
  const { getCartItems, CartItems } = useCartStore();
  useEffect(() => {
    getCartItems();
  }, [getCartItems]);
  // console.log("this is cart items " ,CartItems);

  const Isadmin = user?.role === "admin";
  return (
    <header className="w-fullsticky top-0  bg-white  shadow-2xl shadow-black/5 md:px-4 z-40 transition-all duration-300 border-b  border-[#d4a373]/10 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center  py-4">
        <Link to="/" className="text-3xl font-bold text-[#c4aa69]">
          <span className="text-[#9e5f1f]">E</span>-Commercer
        </Link>

        <nav className="flex justify-center items-center gap-3">
          <Link
            to="/"
            className=" flex items-center justify-center  gap-1 px-2 py-2 font-medium   text-neutral-600"
          >
            Home
          </Link>
          {user ? (
            <Link
              to="/cart"
              className="relative flex items-center justify-center  gap-1 px-2font-medium   text-neutral-600 "
            >
              <ShoppingCart />
              <span className="hidden">Cart</span>
              <span className="absolute -top-2  -right-2 text-xs text-[#7b922d] font-bold rounded-full w-5 h-5 bg-[#f0f5cf] text-center  flex items-center justify-center">
                {CartItems.length}
              </span>
            </Link>
          ) : (
            <>
              <Link
                to="/signin"
                className="bg-[#f0f5cf] rounded-md flex items-center justify-center  gap-1 px-2 py-2 font-medium   text-[#7b922d]"
              >
                Sign in{" "}
              </Link>
              <Link
                to="/signup"
                className=" rounded-md flex items-center justify-center  gap-1 px-2 py-2 font-medium   text-[#7b922d]"
              >
                Sign up{" "}
              </Link>
            </>
          )}

          {Isadmin && (
            <Link
              to="/secret-dashboard"
              className="bg-[#faedcd]/45 rounded-md flex items-center justify-center  gap-1 px-2 py-2 font-medium   text-[#9e5f1f]"
            >
              <Lock size={20} strokeWidth={2} />
              <span>Dashboard</span>
            </Link>
          )}

          {user && (
            <Link
              to="/logout"
              onClick={logout}
              className="flex items-center justify-center  gap-1 px-2 py-2 font-medium   text-neutral-600"
            >
              Logout
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Layout;
