import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Activity,
  Plus,
  Edit,
  Trash2,
  Calendar,
  IndianRupee,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Activities() {
  const [logs, setLogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const endpoint = id
      ? `http://localhost:4000/api/transactionLog/${id}`
      : `http://localhost:4000/api/transactionLog`;

    setLoading(true);
    
    axios.get(endpoint)
      .then((res) => {
        const sortedLogs = res.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLogs(sortedLogs);
        setLoading(false);
      })

      .catch((err) => {
        console.error("Error loading logs:", err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const handleToggleLogs = () => {
    setVisibleCount((prev) => (prev >= logs.length ? 10 : prev + 10));
  };

  const visibleLogs = logs.slice(0, visibleCount);

  const getActionIcon = (action) => {
    switch (action) {
      case "CREATED":
        return <Plus className="w-5 h-5 text-green-600" />;
      case "UPDATED":
        return <Edit className="w-5 h-5 text-blue-600" />;
      case "DELETED":
        return <Trash2 className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "CREATED":
        return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden";
      case "UPDATED":
        return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden";
      case "DELETED":
        return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden";
      default:
        return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden";
    }
  };

  const getActionBadge = (action) => {
    const colors = {
      CREATED: "bg-green-100 text-green-800",
      UPDATED: "bg-blue-100 text-blue-800",
      DELETED: "bg-red-100 text-red-800",
    };
    return `${
      colors[action] || "bg-gray-100 text-gray-800"
    } px-3 py-1 rounded-full text-xs font-medium`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden rounded-2xl shadow-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-500 rounded w-1/3"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  mt-2 rounded-xl p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Transaction Activity Log</h1>
            </div>
            <p className="text-blue-100 mt-2">
              {logs.length} {logs.length === 1 ? "activity" : "activities"}{" "}
              recorded
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {logs.length > 0 ? (
              <>
                {/* Activity Timeline */}
                <div className="space-y-4">
                  {visibleLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`border-l-4 border-opacity-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${getActionColor(
                        log.action
                      )}`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getActionIcon(log.action)}
                          <span
                            className={`font-semibold ${
                              log.action === "CREATED"
                                ? "text-green-700"
                                : log.action === "UPDATED"
                                ? "text-blue-700"
                                : "text-red-700"
                            }`}
                          >
                            {log.action}
                          </span>
                          <span className={getActionBadge(log.action)}>
                            {log.action}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-white">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        {log.action === "UPDATED" &&
                          log.changes?.before &&
                          log.changes?.after && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                  Before
                                </h4>
                                <div className="text-sm text-red-700 space-y-1">
                                  <p className="font-medium">
                                    {log.changes.before.name}
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <IndianRupee className="w-3 h-3" />
                                    <span>{log.changes.before.price}</span>
                                  </div>
                                  <p className="text-xs">
                                    {formatDate(log.changes.before.date)}
                                  </p>
                                  <p className="text-xs italic">
                                    {log.changes.before.description}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  After
                                </h4>
                                <div className="text-sm text-green-700 space-y-1">
                                  <p className="font-medium">
                                    {log.changes.after.name}
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <IndianRupee className="w-3 h-3" />
                                    <span>{log.changes.after.price}</span>
                                  </div>
                                  <p className="text-xs">
                                    {formatDate(log.changes.after.date)}
                                  </p>
                                  <p className="text-xs italic">
                                    {log.changes.after.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {log.action === "CREATED" && log.changes && (
                          <div className="bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100 text-white overflow-hidden rounded-lg p-4">
                            <div className="text-sm text-green-700 bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100 space-y-2">
                              <p className="font-medium text-lg">
                                {log.changes.name}
                              </p>
                              <div className="flex space-x-1 text-green-600">
                                <IndianRupee className="w-4 h-4" />
                                <span className="font-semibold">
                                  {log.changes.price}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {formatDate(log.changes.date)}
                              </p>
                              <p className="text-sm text-gray-600 italic">
                                {log.changes.description}
                              </p>
                            </div>
                          </div>
                        )}

                        {log.action === "DELETED" && log.changes && (
                          <div className="bg-white border border-red-200 rounded-lg p-4">
                            <div className="text-sm text-red-700 space-y-2">
                              <p className="font-medium text-lg line-through">
                                {log.changes.name}
                              </p>
                              <div className="flex items-center space-x-1 text-red-600">
                                <IndianRupee className="w-4 h-4" />
                                <span className="font-semibold">
                                  {log.changes.price}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {formatDate(log.changes.date)}
                              </p>
                              <p className="text-sm italic">
                                {log.changes.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {logs.length > 10 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleToggleLogs}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                    >
                      {visibleCount >= logs.length ? (
                        <>
                          <EyeOff className="w-5 h-5 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <Eye className="w-5 h-5 mr-2" />
                          Show More ({logs.length - visibleCount} remaining)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  No Activity Found
                </h3>
                <p className="text-white">
                  No transaction activity logs have been recorded yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
