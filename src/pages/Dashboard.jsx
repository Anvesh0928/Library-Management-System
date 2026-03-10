import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-2">
        Welcome, {user?.name || "User"}
      </h1>
      <p className="text-sm text-slate-400 mb-6">
        Role: <span className="capitalize">{user?.role}</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-1">Browse Books</h2>
          <p className="text-xs text-slate-400">
            View all books available in the library and search by title or
            author.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-1">Issue History</h2>
          <p className="text-xs text-slate-400">
            Track books you have issued and returned over time.
          </p>
        </div>
        {user?.role === "admin" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-1">Admin Panel</h2>
            <p className="text-xs text-slate-400">
              Manage books and users, and view all issued books.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

