"use client";

import React, { useState, useMemo } from "react";
import { Provider, Booking } from "../../lib/types";
import providersData from "../../data/providers.json";
import { ProviderCard } from "../../components/providers/ProviderCard";
import { GlassmorphicContainer } from "../../components/ui/GlassmorphicContainer";
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, Calendar, Clock, CheckCircle } from "lucide-react";

export default function ProvidersPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating-desc");
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  // Booking Modal State
  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("morning");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState("");

  const categories = ["all", "plumber", "electrician", "ac-tech", "mechanic", "tutor", "cleaner", "beautician"];
  const cities = ["all", "Lahore", "Karachi", "Islamabad"];

  // Filter and Sort Pipeline
  const processedProviders = useMemo(() => {
    let result = [...providersData] as Provider[];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || 
             p.city.toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q)
      );
    }

    // 2. Filter Category
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Filter City
    if (selectedCity !== "all") {
      result = result.filter(p => p.city === selectedCity);
    }

    // 4. Filter Price
    result = result.filter(p => p.hourlyPrice <= maxPrice);

    // 5. Sort
    if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.hourlyPrice - b.hourlyPrice);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.hourlyPrice - a.hourlyPrice);
    } else if (sortBy === "exp-desc") {
      result.sort((a, b) => b.experience - a.experience);
    }

    return result;
  }, [search, selectedCategory, selectedCity, sortBy, maxPrice]);

  const handleBookClick = (provider: Provider) => {
    setBookingProvider(provider);
    setBookingSuccess(false);
    
    // Default date is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
  };

  const handleConfirmDirectBooking = () => {
    if (!bookingProvider) return;

    const bookingId = `b-${Date.now()}`;
    const scheduledTime = `${bookingDate}T${bookingTime === "morning" ? "10:00:00" : bookingTime === "afternoon" ? "14:00:00" : bookingTime === "evening" ? "18:00:00" : "21:00:00"}`;
    const estimatedCost = bookingProvider.hourlyPrice * 1.5;

    const newBooking: Booking = {
      id: bookingId,
      providerId: bookingProvider.id,
      userId: "u-current-user",
      status: "accepted",
      scheduledTime,
      estimatedCost,
      serviceDetails: `Direct booking: ${bookingProvider.category.toUpperCase()} service`,
      location: {
        latitude: bookingProvider.coordinates.lat,
        longitude: bookingProvider.coordinates.lng,
        address: `${bookingProvider.city} Central Area`
      },
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const existing = localStorage.getItem("antigravity_bookings");
    const bookingsList: Booking[] = existing ? JSON.parse(existing) : [];
    bookingsList.push(newBooking);
    localStorage.setItem("antigravity_bookings", JSON.stringify(bookingsList));

    // Simulate lifecycle status loop
    simulateBookingLifecycle(bookingId);

    setCreatedBookingId(bookingId);
    setBookingSuccess(true);

    setTimeout(() => {
      setBookingProvider(null);
      setBookingSuccess(false);
    }, 2500);
  };

  const simulateBookingLifecycle = (bookingId: string) => {
    // Helper to simulate background agent work
    const addStatusTrace = (status: Booking["status"], text: string, completionProof?: string) => {
      const existingBookings = localStorage.getItem("antigravity_bookings");
      if (existingBookings) {
        const list: Booking[] = JSON.parse(existingBookings);
        const updated = list.map(b => 
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

      // Add trace to trace list
      const existingTraces = localStorage.getItem("antigravity_traces");
      const tracesList: any[] = existingTraces ? JSON.parse(existingTraces) : [];
      tracesList.push({
        traceId: `trc-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        type: "action",
        component: "LifecycleSimulator",
        status: "success",
        content: text
      });
      localStorage.setItem("antigravity_traces", JSON.stringify(tracesList));
    };

    setTimeout(() => {
      addStatusTrace("en_route", `[LifecycleSimulator] Provider is en route to client address. status: "en_route"`);
    }, 8000);

    setTimeout(() => {
      addStatusTrace("arrived", `[LifecycleSimulator] Provider arrived at location coordinates. status: "arrived"`);
    }, 18000);

    setTimeout(() => {
      addStatusTrace("in_progress", `[LifecycleSimulator] Service work initiated at location. status: "in_progress"`);
    }, 28000);

    setTimeout(() => {
      addStatusTrace("completed", `[LifecycleSimulator] Service complete. Client signed off on task invoice. status: "completed"`, "Direct booked repairs completed successfully.");
    }, 40000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold uppercase tracking-wider text-cyan-400 font-mono">
          SERVICE PROVIDERS DATABASE
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore and book 25 verified professional service nodes in real-time.
        </p>
      </div>

      {/* Search and Filters Panel */}
      <GlassmorphicContainer glowColor="cyan" className="p-4 flex flex-col md:flex-row gap-4 flex-wrap items-center">
        {/* Search */}
        <div className="relative flex-grow min-w-[200px] w-full md:w-auto">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, category..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            {cities.map(c => (
              <option key={c} value={c}>
                {c === "all" ? "All Cities" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="rating-desc">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="exp-desc">Most Experienced</option>
          </select>
        </div>

        {/* Price Slider */}
        <div className="flex items-center gap-3 w-full md:w-auto min-w-[180px]">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Max Rate:</span>
          <input
            type="range"
            min="1000"
            max="5000"
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="flex-grow accent-cyan-500 cursor-pointer h-1 bg-slate-900 rounded-lg appearance-none"
          />
          <span className="text-xs text-cyan-400 font-bold font-mono">PKR {maxPrice}</span>
        </div>
      </GlassmorphicContainer>

      {/* Providers Grid */}
      {processedProviders.length === 0 ? (
        <div className="text-center py-20 text-slate-500 italic font-mono border border-dashed border-slate-900 rounded-xl">
          No service providers match the chosen query filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {processedProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onBook={handleBookClick}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingProvider && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassmorphicContainer glowColor="cyan" className="max-w-md w-full p-6 relative border-cyan-500/40">
            {bookingSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce mb-3" />
                <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                  Booking Created!
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Request successfully confirmed. Booking ID: <span className="text-cyan-400 font-mono font-bold">{createdBookingId}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Closing window...
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-3 mb-4">
                  Schedule Direct Booking
                </h3>
                <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-lg mb-4 border border-slate-800">
                  <span className="text-2xl">👤</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{bookingProvider.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{bookingProvider.category}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xs font-bold text-cyan-400 font-mono">PKR {bookingProvider.hourlyPrice}/hr</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Select Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" /> Choose Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  {/* Select Time Slot */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-400" /> Select Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                      {[
                        { id: "morning", label: "Morning (10:00 AM)" },
                        { id: "afternoon", label: "Afternoon (02:00 PM)" },
                        { id: "evening", label: "Evening (06:00 PM)" },
                        { id: "night", label: "Night (09:00 PM)" }
                      ].map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => setBookingTime(slot.id)}
                          className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                            bookingTime === slot.id
                              ? "bg-cyan-500 text-slate-950 border-cyan-400"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex justify-between items-center text-xs">
                    <span className="text-slate-400">Estimated Total (1.5 hrs):</span>
                    <span className="font-bold text-slate-100 font-mono">PKR {bookingProvider.hourlyPrice * 1.5}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={handleConfirmDirectBooking}
                      className="flex-grow py-2.5 rounded-lg text-xs font-bold uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all"
                    >
                      Confirm Direct Booking
                    </button>
                    <button
                      onClick={() => setBookingProvider(null)}
                      className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </GlassmorphicContainer>
        </div>
      )}
    </div>
  );
}
