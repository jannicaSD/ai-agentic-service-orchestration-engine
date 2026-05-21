"use client";

import React, { useState, useEffect, useRef } from "react";
import { Message, AgentTrace, Booking } from "../../lib/types";
import { orchestrateQuery } from "../../lib/ai/orchestrator";
import { ChatBubble } from "../../components/chat/ChatBubble";
import { GlassmorphicContainer } from "../../components/ui/GlassmorphicContainer";
import { NeonButton } from "../../components/ui/NeonButton";
import providersData from "../../data/providers.json";
import { Send, Sparkles, Terminal, Trash2, Cpu } from "lucide-react";

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [traces, setTraces] = useState<AgentTrace[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [proposedBooking, setProposedBooking] = useState<Booking | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const suggestedPrompts = [
    { label: "Plumber in Lahore (English/Roman)", text: "Need a plumber in Lahore under 3000 PKR tomorrow morning" },
    { label: "Short Circuit in Islamabad (Roman Urdu)", text: "Bijli ka short circuit check karna hai Islamabad main under 5000 rs urgent" },
    { label: "Tutor in Karachi (English)", text: "Need a math tutor in Karachi under 4000 rupees" },
    { label: "AC Service in Lahore (Urdu Script)", text: "اے سی سروس کروانی ہے لاہور میں کل شام" }
  ];

  // Initialize Chat History
  useEffect(() => {
    const savedMessages = localStorage.getItem("antigravity_messages");
    const savedTraces = localStorage.getItem("antigravity_traces");
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const initialMessage: Message = {
        id: "msg-init",
        role: "assistant",
        content: "Hello! I am the AntiGravity AI Assistant. Tell me what service you need (plumber, electrician, tutor, mechanic, AC tech) in English, Urdu, or Roman Urdu, and I will orchestrate a provider for you.",
        timestamp: new Date().toISOString()
      };
      setMessages([initialMessage]);
    }

    if (savedTraces) {
      setTraces(JSON.parse(savedTraces));
    }
  }, []);

  // Save Chat History on Change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("antigravity_messages", JSON.stringify(messages));
    }
    if (traces.length > 0) {
      localStorage.setItem("antigravity_traces", JSON.stringify(traces));
    }
  }, [messages, traces]);

  // Scroll to Bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    // Add User Message
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setUserInput("");
    setIsTyping(true);
    setProposedBooking(null);

    // Simulate Agent Orchestration Processing Delay
    setTimeout(() => {
      // Execute multi-agent orchestration pipeline
      const { message: responseMsg, traces: executionTraces, booking } = orchestrateQuery(
        textToSend,
        providersData as any
      );

      // Append traces
      setTraces(prev => [...prev, ...executionTraces]);

      // Set proposed booking
      if (booking) {
        setProposedBooking(booking);
      }

      // Add Assistant Message
      setMessages(prev => [...prev, responseMsg]);
      setIsTyping(false);
    }, 1800);
  };

  const handleConfirmBooking = () => {
    if (!proposedBooking) return;
    setIsConfirming(true);

    setTimeout(() => {
      // Retrieve existing bookings
      const existing = localStorage.getItem("antigravity_bookings");
      const bookingsList: Booking[] = existing ? JSON.parse(existing) : [];

      // Save new booking with status 'accepted' (Phase 4 Provider Acceptance)
      const finalBooking: Booking = {
        ...proposedBooking,
        status: "accepted",
        updatedAt: new Date().toISOString()
      };

      bookingsList.push(finalBooking);
      localStorage.setItem("antigravity_bookings", JSON.stringify(bookingsList));

      // Append Success message
      const successMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: `🎉 **Booking Confirmed & Accepted!** Your provider is locked in. You can track this booking on your Dashboard.`,
        timestamp: new Date().toISOString()
      };

      // Add verification trace
      const successTrace: AgentTrace = {
        traceId: `trc-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "result",
        component: "BookingAgent",
        status: "success",
        content: `[Booking Agent] Booking ${proposedBooking.id} successfully locked in database status: "accepted".`
      };

      setMessages(prev => {
        // Remove Actionable flag from previous booking proposal message
        const updated = prev.map(m => m.id === messages[messages.length - 1].id ? { ...m, isActionable: false } : m);
        return [...updated, successMsg];
      });
      setTraces(prev => [...prev, successTrace]);
      setProposedBooking(null);
      setIsConfirming(false);

      // Simulate Realtime status update loops (accepted -> en_route -> arrived -> in_progress -> completed)
      simulateBookingLifecycle(finalBooking.id);
    }, 1200);
  };

  const handleDeclineBooking = () => {
    const declineMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: "Booking request declined. Let me know if you would like me to search for another provider or modify the booking parameters.",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => {
      const updated = prev.map(m => m.id === messages[messages.length - 1].id ? { ...m, isActionable: false } : m);
      return [...updated, declineMsg];
    });
    setProposedBooking(null);
  };

  const simulateBookingLifecycle = (bookingId: string) => {
    const addStatusTrace = (status: Booking["status"], text: string, completionProof?: string) => {
      const newTrace: AgentTrace = {
        traceId: `trc-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        type: "action",
        component: "LifecycleSimulator",
        status: "success",
        content: text
      };

      // Read bookings list, update target status, write back
      const existing = localStorage.getItem("antigravity_bookings");
      if (existing) {
        const bookingsList: Booking[] = JSON.parse(existing);
        const updated = bookingsList.map(b => 
          b.id === bookingId 
            ? { 
                ...b, 
                status, 
                updatedAt: new Date().toISOString(),
                ...(completionProof ? { completionProof } : {}) 
              } 
            : b
        );
        localStorage.setItem("antigravity_bookings", JSON.stringify(updated));
      }

      setTraces(prev => [...prev, newTrace]);
    };

    // 1. Accepted -> En Route (8 sec)
    setTimeout(() => {
      addStatusTrace("en_route", `[LifecycleSimulator] Provider is en route to client address. status: "en_route"`);
    }, 8000);

    // 2. En Route -> Arrived (18 sec)
    setTimeout(() => {
      addStatusTrace("arrived", `[LifecycleSimulator] Provider arrived within geofence limits (30m distance verified). status: "arrived"`);
    }, 18000);

    // 3. Arrived -> In Progress (28 sec)
    setTimeout(() => {
      addStatusTrace("in_progress", `[LifecycleSimulator] Provider hit Start Work. service status: "in_progress"`);
    }, 28000);

    // 4. In Progress -> Completed (40 sec)
    setTimeout(() => {
      addStatusTrace("completed", `[LifecycleSimulator] Provider submitted completion report proof. status: "completed"`, "Repairs completed: Leakage isolated, main valve washer replaced.");
    }, 40000);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("antigravity_messages");
    localStorage.removeItem("antigravity_traces");
    
    const initialMessage: Message = {
      id: "msg-init",
      role: "assistant",
      content: "Chat cleared. Ask me anything to start orchestration.",
      timestamp: new Date().toISOString()
    };
    setMessages([initialMessage]);
    setTraces([]);
    setProposedBooking(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex flex-col lg:flex-row gap-6">
      {/* Left Column: Chat Assistant */}
      <div className="flex-1 flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
        <GlassmorphicContainer glowColor="cyan" className="flex-grow flex flex-col justify-between p-4 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="font-mono text-sm font-bold tracking-wider">AI ASSISTANT BUS</span>
            </div>
            <button
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="p-1.5 rounded bg-slate-950 border border-slate-900 text-slate-500 hover:text-rose-400 hover:border-rose-500/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-2">
            {messages.map(msg => (
              <ChatBubble
                key={msg.id}
                message={msg}
                traces={traces}
                onConfirmBooking={handleConfirmBooking}
                onCancelBooking={handleDeclineBooking}
                isConfirming={isConfirming}
              />
            ))}

            {isTyping && (
              <div className="self-start flex items-center gap-2 text-xs text-slate-500 font-mono italic my-2 pl-3">
                <Cpu className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
                <span>AntiGravity pipeline parsing and ranking candidates...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Field */}
          <div className="mt-4 border-t border-slate-900 pt-4 flex flex-col gap-3">
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setUserInput(p.text)}
                  className="text-[10px] px-2.5 py-1 rounded bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer font-semibold"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(userInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask for plumber in Lahore, short circuit in Islamabad, etc..."
                className="flex-grow bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </GlassmorphicContainer>
      </div>

      {/* Right Column: Real-time Trace Pipeline Monitor */}
      <div className="w-full lg:w-96 flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
        <GlassmorphicContainer glowColor="purple" className="flex-grow flex flex-col justify-between p-4 overflow-hidden">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                <span className="font-mono text-sm font-bold tracking-wider">REALTIME TRACE MONITOR</span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-500/30 uppercase font-bold">
                Verification Bus
              </span>
            </div>

            {/* Traces List */}
            <div className="overflow-y-auto max-h-[calc(100vh-320px)] pr-1 font-mono text-[10px] leading-relaxed text-slate-400 flex flex-col gap-3">
              {traces.length === 0 ? (
                <div className="text-center text-slate-600 italic py-10">
                  No active logs. Send a booking query to start trace pipelines.
                </div>
              ) : (
                traces.slice().reverse().map(trace => (
                  <div key={trace.traceId} className="border-b border-slate-900/60 pb-2">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className={`${
                        trace.type === "thought" ? "text-purple-400" : 
                        trace.type === "action" ? "text-cyan-400" : "text-emerald-400"
                      }`}>
                        [{trace.component}]
                      </span>
                      <span className="text-slate-600">
                        {new Date(trace.timestamp).toLocaleTimeString([], { hour12: false })}
                      </span>
                    </div>
                    <p className="text-slate-300 pl-2 border-l border-slate-800">{trace.content}</p>
                    {trace.metadata && (
                      <pre className="mt-1 bg-slate-950 p-1.5 rounded text-[8px] overflow-x-auto text-slate-500">
                        {JSON.stringify(trace.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-600 border-t border-slate-900 pt-3 text-center">
            System status: nominal. Port active on 8081.
          </div>
        </GlassmorphicContainer>
      </div>
    </div>
  );
}
