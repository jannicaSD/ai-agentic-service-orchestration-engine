import React from "react";

interface LanguageToggleProps {
  language: "english" | "urdu" | "roman_urdu";
  onLanguageChange: (lang: "english" | "urdu" | "roman_urdu") => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
      <button
        onClick={() => onLanguageChange("english")}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
          language === "english"
            ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange("roman_urdu")}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
          language === "roman_urdu"
            ? "bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Roman
      </button>
      <button
        onClick={() => onLanguageChange("urdu")}
        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 cursor-pointer ${
          language === "urdu"
            ? "bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        اردو
      </button>
    </div>
  );
};
