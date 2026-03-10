import React, { useEffect } from "react";

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const colors = {
    success: "bg-emerald-600",
    error: "bg-rose-600",
    info: "bg-slate-700"
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-4 py-2 rounded-md shadow-lg text-sm ${colors[type]} text-white`}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;

