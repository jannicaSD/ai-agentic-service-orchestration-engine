import React, { useState } from "react";
import { Message, AgentTrace } from "../../lib/types";
import { ProviderCard } from "../providers/ProviderCard";
import { Cpu, Terminal, ChevronDown, ChevronUp, Clock } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
  traces?: AgentTrace[];
  onConfirmBooking?: () => void;
  onCancelBooking?: () => void;
  isConfirming?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  traces = [],
  onConfirmBooking,
  onCancelBooking,
  isConfirming = false
}) => {
  const isUser = message.role === "user";
  const [showTraces, setShowTraces] = useState(false);

  // Filter traces belonging to this message or related query execution
  const msgTraces = traces.filter(t => t.timestamp <= message.timestamp);

  return (
    <div className={`flex flex-col gap-2 my-4 max-w-[85%] ${isUser ? "self-end ml-auto" : "self-start mr-auto"}`}>
      {/* Sender Header */}
      <div className={`flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />}
        <span>{isUser ? "User" : "AntiGravity Core"}</span>
        <Clock className="w-3 h-3 ml-1" />
        <span>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Bubble Container */}
      <div
        className={`rounded-xl p-4 border text-sm leading-relaxed ${
          isUser
            ? "bg-slate-900/60 border-purple-500/40 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
            : "bg-slate-950/70 border-cyan-500/40 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {/* Display recommendations if present */}
        {message.providers && message.providers.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-cyan-500/20 pb-1 mb-1">
              Top Ranked Providers Match:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {message.providers.map(provider => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  variant="mini"
                />
              ))}
            </div>
          </div>
        )}

        {/* Display Actions (Confirm Booking) */}
        {message.isActionable && onConfirmBooking && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-cyan-500/20 pt-4">
            <button
              onClick={onConfirmBooking}
              disabled={isConfirming}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            >
              {isConfirming ? "Processing..." : "Confirm Booking"}
            </button>
            <button
              onClick={onCancelBooking}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              Decline
            </button>
          </div>
        )}
      </div>

      {/* Orchestration Trace logs toggle */}
      {!isUser && msgTraces.length > 0 && (
        <div className="self-start">
          <button
            onClick={() => setShowTraces(!showTraces)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showTraces ? "Hide Agent Orchestration Logs" : "View Agent Orchestration Logs"}</span>
            {showTraces ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showTraces && (
            <div className="mt-2 p-3 bg-slate-950/90 border border-slate-800/80 rounded-lg max-w-[450px] font-mono text-[11px] leading-relaxed text-slate-400 max-h-[220px] overflow-y-auto shadow-inner">
              <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
                <span>VERIFICATION TRACE PIPELINE</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400">ACTIVE</span>
              </div>
              {msgTraces.map((trace, i) => (
                <div key={trace.traceId || i} className="mb-2 last:mb-0">
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className={`font-bold ${
                      trace.type === "thought" ? "text-purple-400" : 
                      trace.type === "action" ? "text-blue-400" : "text-green-400"
                    }`}>
                      [{trace.component}]
                    </span>
                    <span className="text-slate-600">
                      {new Date(trace.timestamp).toLocaleTimeString([], { hour12: false })}
                    </span>
                  </div>
                  <p className="pl-2 border-l border-slate-800 text-slate-300">
                    {trace.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
