import React from "react";

interface GlassmorphicContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: "cyan" | "purple" | "pink" | "lime" | "none";
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const GlassmorphicContainer: React.FC<GlassmorphicContainerProps> = ({
  glowColor = "none",
  hoverEffect = false,
  children,
  className = "",
  ...props
}) => {
  const glows = {
    cyan: "shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-500/20",
    purple: "shadow-[0_0_20px_rgba(168,85,247,0.15)] border-purple-500/20",
    pink: "shadow-[0_0_20px_rgba(236,72,153,0.15)] border-pink-500/20",
    lime: "shadow-[0_0_20px_rgba(132,204,22,0.15)] border-lime-500/20",
    none: "border-slate-800/80"
  };

  const hoverStyles = hoverEffect
    ? "hover:bg-slate-900/60 hover:border-slate-700/80 transition-all duration-300 hover:translate-y-[-2px]"
    : "";

  return (
    <div
      className={`bg-slate-950/40 backdrop-blur-md border rounded-xl p-6 ${glows[glowColor]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
