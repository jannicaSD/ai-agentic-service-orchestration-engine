"use client";

import React, { useState } from "react";
import { AnalyticsDashboard } from "../../../components/analytics/AnalyticsDashboard";
import { GlassmorphicContainer } from "../../../components/ui/GlassmorphicContainer";
import { Calendar, Download, RefreshCw, BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30");
  const [isResetting, setIsResetting] = useState(false);

  const handleResetSimulatedStats = () => {
    setIsResetting(true);
    setTimeout(() => {
      // Clear local storage metrics if desired
      localStorage.removeItem("antigravity_messages");
      localStorage.removeItem("antigravity_traces");
      localStorage.removeItem("antigravity_bookings");
      setIsResetting(false);
      alert("Simulated database records and traces reset successfully!");
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <BarChart2 className="w-5 h-5" /> ADMIN PERFORMANCE ANALYTICS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System performance logs, revenue metrics, and booking throughput details.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
            {[
              { id: "7", label: "7D" },
              { id: "30", label: "30D" },
              { id: "90", label: "90D" },
              { id: "365", label: "1Y" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`px-3 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  timeframe === t.id
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Reset Simulated Data */}
          <button
            onClick={handleResetSimulatedStats}
            disabled={isResetting}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
            <span>{isResetting ? "Resetting..." : "Reset Data"}</span>
          </button>
        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <AnalyticsDashboard />
    </div>
  );
}
