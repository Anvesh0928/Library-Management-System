import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-emerald-400">
          LibraryMS
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-sm ${isActive ? "text-emerald-400" : "text-slate-300"}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `text-sm ${isActive ? "text-emerald-400" : "text-slate-300"}`
                }
              >
                Books
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `text-sm ${isActive ? "text-emerald-400" : "text-slate-300"}`
                }
              >
                Issue History
              </NavLink>
              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-sm ${
                      isActive ? "text-emerald-400" : "text-slate-300"
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
            </>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm text-slate-300 hover:text-emerald-400"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm text-slate-300 hover:text-emerald-400"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

