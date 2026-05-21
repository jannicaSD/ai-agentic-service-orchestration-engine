import React from "react";
import { Provider } from "../../lib/types";
import { Star, MapPin, Briefcase, Phone, Calendar, User } from "lucide-react";

interface ProviderCardProps {
  provider: Provider & { distance?: number };
  variant?: "full" | "mini";
  onBook?: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  variant = "full",
  onBook
}) => {
  const categoryGlows = {
    plumber: "shadow-[0_0_15px_rgba(6,182,212,0.15)] border-cyan-500/20",
    electrician: "shadow-[0_0_15px_rgba(168,85,247,0.15)] border-purple-500/20",
    "ac-tech": "shadow-[0_0_15px_rgba(236,72,153,0.15)] border-pink-500/20",
    mechanic: "shadow-[0_0_15px_rgba(132,204,22,0.15)] border-lime-500/20",
    tutor: "shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/20",
    cleaner: "shadow-[0_0_15px_rgba(245,158,11,0.15)] border-amber-500/20",
    beautician: "shadow-[0_0_15px_rgba(236,72,153,0.15)] border-rose-500/20"
  };

  const categoryLabels = {
    plumber: "Plumber",
    electrician: "Electrician",
    "ac-tech": "AC Tech",
    mechanic: "Mechanic",
    tutor: "Tutor",
    cleaner: "Cleaner",
    beautician: "Beautician"
  };

  const getCategoryImage = (cat: string) => {
    switch (cat) {
      case "plumber": return "🔧";
      case "electrician": return "⚡";
      case "ac-tech": return "❄️";
      case "mechanic": return "🚗";
      case "tutor": return "📚";
      case "cleaner": return "🧹";
      case "beautician": return "💄";
      default: return "👤";
    }
  };

  if (variant === "mini") {
    return (
      <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-100 hover:border-cyan-500/40 transition-all duration-300">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xl overflow-hidden shrink-0 relative">
          <span className="text-lg">{getCategoryImage(provider.category)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold truncate text-slate-100">{provider.name}</h4>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
            <span className="flex items-center text-amber-400 font-bold">
              <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
              {provider.rating.toFixed(1)}
            </span>
            <span>•</span>
            <span className="truncate">{categoryLabels[provider.category]}</span>
          </div>
          <p className="text-[10px] text-cyan-400 font-semibold mt-1">
            PKR {provider.hourlyPrice}/hr
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-950/40 backdrop-blur-md border rounded-xl p-5 text-slate-100 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300 ${categoryGlows[provider.category] || "border-slate-800"}`}>
      {/* Header Info */}
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
              {getCategoryImage(provider.category)}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">{provider.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border border-slate-800">
                  {categoryLabels[provider.category]}
                </span>
                <span className="flex items-center text-xs text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-current mr-0.5" />
                  {provider.rating.toFixed(1)}
                  <span className="text-[10px] text-slate-500 font-normal ml-0.5">({provider.reviews})</span>
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-cyan-400 font-bold text-sm">PKR {provider.hourlyPrice}</span>
            <p className="text-[10px] text-slate-500">per hour</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3.5 border-t border-b border-slate-900 py-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-500" />
            <span className="truncate">{provider.city}{provider.distance !== undefined ? ` (${provider.distance} km)` : ""}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-purple-500" />
            <span>{provider.experience} years exp</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Phone className="w-3.5 h-3.5 text-pink-500" />
            <span>{provider.phoneNumber}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-lime-500" />
            <span>Availability Schedule</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {provider.availability.map((sched, idx) => (
              <span
                key={idx}
                className="text-[9px] px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800 text-slate-400"
              >
                {sched.day.substring(0, 3)} ({sched.startTime}-{sched.endTime})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {onBook && (
        <button
          onClick={() => onBook(provider)}
          className="w-full mt-2 py-2 rounded-lg text-xs font-bold uppercase cursor-pointer border border-cyan-500/40 text-cyan-400 bg-cyan-950/20 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300"
        >
          Request Booking
        </button>
      )}
    </div>
  );
};
