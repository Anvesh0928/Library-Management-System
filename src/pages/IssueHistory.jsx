import React, { useEffect, useState } from "react";
import api from "../services/api.js";

const IssueHistory = ({ showToast }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await api.get("/issues/me");
      setIssues(res.data);
    } catch (error) {
      showToast("Failed to load issue history", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReturn = async (id) => {
    try {
      setReturningId(id);
      await api.post("/issues/return", { issueId: id });
      showToast("Book returned", "success");
      fetchIssues();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to return book",
        "error"
      );
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Issue History</h1>
      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : issues.length === 0 ? (
        <p className="text-sm text-slate-400">No issue records found.</p>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            >
              <div>
                <p className="text-sm font-semibold">
                  {issue.book?.title || "Unknown Book"}
                </p>
                <p className="text-xs text-slate-400">
                  Status:{" "}
                  <span className="capitalize">{issue.status}</span> · Issued:{" "}
                  {new Date(issue.issuedAt).toLocaleDateString()}
                  {issue.returnedAt && (
                    <> · Returned: {new Date(issue.returnedAt).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              {issue.status === "issued" && (
                <button
                  onClick={() => handleReturn(issue._id)}
                  disabled={returningId === issue._id}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-medium disabled:opacity-60"
                >
                  {returningId === issue._id ? "Returning..." : "Return Book"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueHistory;

