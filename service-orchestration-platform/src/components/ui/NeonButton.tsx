import React from "react";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "purple" | "pink" | "lime";
  glowing?: boolean;
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = "cyan",
  glowing = true,
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "px-6 py-2.5 rounded-lg font-semibold tracking-wide transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white border text-sm flex items-center justify-center gap-2 cursor-pointer";
  
  const variants = {
    cyan: "bg-cyan-950/40 border-cyan-500 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 focus:ring-2 focus:ring-cyan-400",
    purple: "bg-purple-950/40 border-purple-500 hover:bg-purple-500 hover:text-white text-purple-400 focus:ring-2 focus:ring-purple-400",
    pink: "bg-pink-950/40 border-pink-500 hover:bg-pink-500 hover:text-white text-pink-400 focus:ring-2 focus:ring-pink-400",
    lime: "bg-lime-950/40 border-lime-500 hover:bg-lime-500 hover:text-slate-950 text-lime-400 focus:ring-2 focus:ring-lime-400",
  };

  const glows = {
    cyan: "hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] border-cyan-500/50",
    purple: "hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] border-purple-500/50",
    pink: "hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] border-pink-500/50",
    lime: "hover:shadow-[0_0_15px_rgba(132,204,22,0.6)] border-lime-500/50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${glowing ? glows[variant] : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
