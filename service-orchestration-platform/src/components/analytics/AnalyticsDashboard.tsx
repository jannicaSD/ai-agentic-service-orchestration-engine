import React from "react";
import { GlassmorphicContainer } from "../ui/GlassmorphicContainer";
import { TrendingUp, Users, Clock, DollarSign, Activity, ChevronRight } from "lucide-react";

export const AnalyticsDashboard: React.FC = () => {
  // Mock Data for Visuals
  const categories = [
    { name: "Plumbing", count: 142, percentage: 32, color: "bg-cyan-500", shadow: "shadow-cyan-500/50" },
    { name: "Electrical", count: 119, percentage: 27, color: "bg-purple-500", shadow: "shadow-purple-500/50" },
    { name: "AC Tech", count: 88, percentage: 20, color: "bg-pink-500", shadow: "shadow-pink-500/50" },
    { name: "Mechanics", count: 56, percentage: 13, color: "bg-lime-500", shadow: "shadow-lime-500/50" },
    { name: "Tutoring", count: 40, percentage: 8, color: "bg-blue-500", shadow: "shadow-blue-500/50" }
  ];

  const recentJobs = [
    { id: "J-9482", customer: "Zainab B.", provider: "Arshad M.", service: "Plumbing", status: "completed", amount: "PKR 3,750" },
    { id: "J-9481", customer: "Farooq H.", provider: "Faisal M.", service: "Electrical", status: "completed", amount: "PKR 2,900" },
    { id: "J-9480", customer: "Amina K.", provider: "Yasir A.", service: "AC Tech", status: "in_progress", amount: "PKR 5,000" },
    { id: "J-9479", customer: "Bilal S.", provider: "Shoaib A.", service: "Mechanics", status: "en_route", amount: "PKR 4,200" }
  ];

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassmorphicContainer glowColor="cyan" className="p-4 flex items-center gap-4">
          <div className="p-3 bg-cyan-950/50 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">1,284</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.4% this month
            </p>
          </div>
        </GlassmorphicContainer>

        <GlassmorphicContainer glowColor="purple" className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-lg text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Providers</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">25</h3>
            <p className="text-[10px] text-purple-400 flex items-center gap-1 mt-1">
              <span>●</span> 100% capacity mock node
            </p>
          </div>
        </GlassmorphicContainer>

        <GlassmorphicContainer glowColor="pink" className="p-4 flex items-center gap-4">
          <div className="p-3 bg-pink-950/50 border border-pink-500/30 rounded-lg text-pink-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Avg Response Time</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">8.2 min</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> -14.6% vs last week
            </p>
          </div>
        </GlassmorphicContainer>

        <GlassmorphicContainer glowColor="lime" className="p-4 flex items-center gap-4">
          <div className="p-3 bg-lime-950/50 border border-lime-500/30 rounded-lg text-lime-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gross Revenue</p>
            <h3 className="text-xl font-bold text-slate-100 mt-1">PKR 482.5K</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18.2% vs last month
            </p>
          </div>
        </GlassmorphicContainer>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completed Jobs Chart - Gorgeous SVG Line Graph */}
        <GlassmorphicContainer className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-3 mb-4">
              Booking Volume & Completed Jobs Timeline
            </h3>
            
            {/* SVG Chart */}
            <div className="w-full relative mt-2">
              <svg className="w-full h-56 overflow-visible" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="cyanLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="#334155" />

                {/* Axis Labels */}
                <text x="15" y="25" fill="#64748b" className="text-[9px] font-mono">150</text>
                <text x="15" y="75" fill="#64748b" className="text-[9px] font-mono">100</text>
                <text x="15" y="125" fill="#64748b" className="text-[9px] font-mono">50</text>
                <text x="15" y="175" fill="#64748b" className="text-[9px] font-mono">0</text>

                {/* X Axis Months */}
                <text x="60" y="190" fill="#64748b" className="text-[10px] font-semibold font-mono">JAN</text>
                <text x="130" y="190" fill="#64748b" className="text-[10px] font-semibold font-mono">FEB</text>
                <text x="200" y="190" fill="#64748b" className="text-[10px] font-semibold font-mono">MAR</text>
                <text x="270" y="190" fill="#64748b" className="text-[10px] font-semibold font-mono">APR</text>
                <text x="340" y="190" fill="#64748b" className="text-[10px] font-semibold font-mono">MAY</text>
                <text x="410" y="190" fill="#64748b" className="text-[10px] font-semibold font-mono">JUN</text>

                {/* Chart Path Area */}
                <path
                  d="M 60,150 Q 130,120 200,90 T 270,110 T 340,60 T 410,40 L 410,170 L 60,170 Z"
                  fill="url(#areaGradient)"
                />

                {/* Chart Line */}
                <path
                  d="M 60,150 Q 130,120 200,90 T 270,110 T 340,60 T 410,40"
                  fill="none"
                  stroke="url(#cyanLineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points Glow */}
                <circle cx="60" cy="150" r="5" fill="#06b6d4" className="shadow-[0_0_10px_#06b6d4]" />
                <circle cx="200" cy="90" r="5" fill="#8b5cf6" />
                <circle cx="340" cy="60" r="5" fill="#d946ef" />
                <circle cx="410" cy="40" r="6" fill="#ec4899" className="animate-pulse" />
              </svg>
            </div>
          </div>
          <div className="flex gap-4 items-center justify-end text-xs font-semibold text-slate-500 font-mono mt-4">
            <span className="flex items-center gap-1"><span className="w-3 h-1.5 bg-cyan-500 rounded-full inline-block"></span> Booking volume</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1.5 bg-purple-500 rounded-full inline-block"></span> Completed jobs</span>
          </div>
        </GlassmorphicContainer>

        {/* Service Category Breakdown - Cyan/Purple/Pink bars */}
        <GlassmorphicContainer>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-3 mb-4">
            Category Breakdown
          </h3>
          <div className="flex flex-col gap-4 mt-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-200">{cat.name}</span>
                  <span className="text-slate-400">{cat.count} bookings ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full ${cat.color} ${cat.shadow} shadow-lg rounded-full`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassmorphicContainer>
      </div>

      {/* Recent Bookings and Realtime Events */}
      <GlassmorphicContainer>
        <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            Recent Orchestrated Jobs Log
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            Realtime DB Feed
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5">Job ID</th>
                <th>Client</th>
                <th>Agent Assigned</th>
                <th>Category</th>
                <th>Status</th>
                <th className="text-right">Total Est</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-3 text-cyan-400 font-semibold">{job.id}</td>
                  <td>{job.customer}</td>
                  <td>{job.provider}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                      {job.service}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                      job.status === "completed" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" :
                      job.status === "in_progress" ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 animate-pulse" :
                      "bg-purple-950/40 text-purple-400 border border-purple-500/20"
                    }`}>
                      {job.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="text-right font-bold text-slate-100">{job.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassmorphicContainer>
    </div>
  );
};
