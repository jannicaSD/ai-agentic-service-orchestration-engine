"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NeonButton } from "../components/ui/NeonButton";
import { GlassmorphicContainer } from "../components/ui/GlassmorphicContainer";
import { LanguageToggle } from "../components/ui/LanguageToggle";
import { Cpu, ShieldCheck, Zap, Sparkles, BookOpen, Star, Clock, HeartHandshake } from "lucide-react";

export default function LandingPage() {
  const [language, setLanguage] = useState<"english" | "urdu" | "roman_urdu">("english");

  // Content dictionary for language toggling
  const content = {
    english: {
      heroTitle: "ORCHESTRATE YOUR ON-DEMAND SERVICES",
      heroSubtitle: "Decentralized AI Agent Orchestration for Pakistan's Informal Economy",
      heroDesc: "AntiGravity links you to verified local plumbers, electricians, teachers, mechanics, and technicians instantly using advanced multi-agent intent parsing and ranking pipelines.",
      ctaAssistant: "Launch Booking Agent",
      ctaProviders: "Browse Service Providers",
      featureTitle: "AGENT AUTOMATION NODES",
      featureSub: "Centralized Agent Bus Coordinates and Validates Every Booking Task",
      statTitle: "CORE STATS"
    },
    urdu: {
      heroTitle: "اپنی سروسز کو سمارٹ بنائیں",
      heroSubtitle: "پاکستان کی غیر رسمی معیشت کے لئے ڈی سینٹرلائزڈ AI ایجنٹ آرکیسٹریشن",
      heroDesc: "اینٹی گریویٹی آپ کو تصدیق شدہ پلمبر، الیکٹریشن، ٹیچرز، اور مکینک سے سیکنڈوں میں جوڑتا ہے۔ ملٹی ایجنٹ پائپ لائنز کے ذریعے بہترین ریٹنگ والے پروفیشنلز کا انتخاب کریں۔",
      ctaAssistant: "بکنگ ایجنٹ شروع کریں",
      ctaProviders: "سروس فراہم کنندہ دیکھیں",
      featureTitle: "ایجنٹ آٹومیشن نوڈس",
      featureSub: "بکنگ کے ہر ٹاسک کو خودکار طریقے سے منظم اور مانیٹر کیا جاتا ہے",
      statTitle: "اہم اعداد و شمار"
    },
    roman_urdu: {
      heroTitle: "APNI ON-DEMAND SERVICES COORDINATE KARAIN",
      heroSubtitle: "Pakistan Ki Informal Economy Ke Liye Decentralized AI Agent Orchestration",
      heroDesc: "AntiGravity aapko verified plumbers, electricians, teachers, mechanics, aur technicians se foran connect karta hai, advanced multi-agent processing pipeline ke zariye.",
      ctaAssistant: "Launch Booking Agent",
      ctaProviders: "Browse Service Providers",
      featureTitle: "AGENT AUTOMATION NODES",
      featureSub: "Centralized Agent Bus Coordinates and Validates Every Booking Task",
      statTitle: "CORE STATS"
    }
  };

  const currentContent = content[language];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
          {/* Language Toggle Demo */}
          <div className="mb-8 animate-fade-in">
            <LanguageToggle language={language} onLanguageChange={(l) => setLanguage(l)} />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 font-mono">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 animate-pulse">
              {currentContent.heroTitle}
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg font-bold text-cyan-400/90 tracking-wide uppercase font-mono max-w-2xl">
            {currentContent.heroSubtitle}
          </p>

          <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            {currentContent.heroDesc}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/assistant">
              <NeonButton variant="cyan" glowing={true} className="w-52 py-3 text-xs uppercase font-bold">
                <Cpu className="w-4 h-4" /> {currentContent.ctaAssistant}
              </NeonButton>
            </Link>
            <Link href="/providers">
              <NeonButton variant="purple" glowing={true} className="w-52 py-3 text-xs uppercase font-bold">
                <HeartHandshake className="w-4 h-4" /> {currentContent.ctaProviders}
              </NeonButton>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Line Highlights */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] pointer-events-none rounded-full" />
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono font-bold tracking-widest text-pink-500 uppercase">{currentContent.featureTitle}</h2>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-2 font-mono">{currentContent.featureSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassmorphicContainer glowColor="cyan" hoverEffect={true}>
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-lg text-cyan-400 w-fit mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-mono">1. Intent Classification</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Analyzes Urdu script, Roman Urdu, and English to parse service demands, target areas, budgets, and times.
            </p>
          </GlassmorphicContainer>

          <GlassmorphicContainer glowColor="purple" hoverEffect={true}>
            <div className="p-3 bg-purple-950/40 border border-purple-500/20 rounded-lg text-purple-400 w-fit mb-4">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-mono">2. Intelligent Score Ranking</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Ranks providers using distance computations (Haversine formula), ratings, experience, and budget fit.
            </p>
          </GlassmorphicContainer>

          <GlassmorphicContainer glowColor="pink" hoverEffect={true}>
            <div className="p-3 bg-pink-950/40 border border-pink-500/20 rounded-lg text-pink-400 w-fit mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-mono">3. Agentic Verification logs</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Inspect behind-the-scenes thoughts, decisions, and statuses of all sub-agents in real-time execution.
            </p>
          </GlassmorphicContainer>
        </div>
      </section>

      {/* Provider Statistics Dashboard Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full border-t border-slate-900">
        <div className="text-center mb-8">
          <h2 className="text-xs font-mono font-bold tracking-widest text-lime-500 uppercase">{currentContent.statTitle}</h2>
          <p className="text-lg font-bold text-slate-100 mt-2">AntiGravity Live Network Performance Metrics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-lg">
            <span className="text-3xl font-extrabold text-cyan-400">1.2K+</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-2">Total Bookings</p>
          </div>
          <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-lg">
            <span className="text-3xl font-extrabold text-purple-400">25</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-2">Verified Pros</p>
          </div>
          <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-lg">
            <span className="text-3xl font-extrabold text-pink-400">4.8★</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-2">Average Rating</p>
          </div>
          <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-lg">
            <span className="text-3xl font-extrabold text-lime-400">&lt;10m</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-2">Response Time</p>
          </div>
        </div>
      </section>
    </div>
  );
}
