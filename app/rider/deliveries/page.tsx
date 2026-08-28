"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockApi } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  MapPin,
  Clock,
  Navigation,
  Power,
  RotateCcw,
  Check,
  Coins,
  ShieldCheck,
  Leaf,
  Star,
  ThumbsUp,
  MessageSquare,
  Map,
  User,
  Phone,
  ArrowRight,
  TrendingUp,
  Award,
  CircleDot,
  Radio,
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  cropName: string;
  hindiCrop: string;
  quantityKg: number;
  pickupName: string;
  pickupLocation: string;
  dropName: string;
  dropLocation: string;
  payout: number;
  pickupDistanceKm: number;
  tripDistanceKm: number;
  estTimeMins: number;
  vehicleRequired: string;
  isHeavy: boolean;
  pickupLat?: number;
  pickupLng?: number;
  dropLat?: number;
  dropLng?: number;
}

interface RiderReview {
  id: string;
  author: string;
  role: "Farmer" | "Bulk Buyer" | "Retailer";
  rating: number;
  comment: string;
  date: string;
  tag: string;
}

// Initial Delivery Orders
const INITIAL_DELIVERIES: DeliveryOrder[] = [
  {
    id: "del-1",
    cropName: "Fresh Shimla Tomatoes",
    hindiCrop: "ताज़ा टमाटर",
    quantityKg: 350,
    pickupName: "Rameshwar Patel Farms",
    pickupLocation: "Sonipat Vegetable Belt (2 km away)",
    dropName: "Azadpur APMC Terminal Gate 4",
    dropLocation: "Delhi Wholesale Market (12 km trip)",
    payout: 480,
    pickupDistanceKm: 2,
    tripDistanceKm: 14,
    estTimeMins: 40,
    vehicleRequired: "Mini-Truck / Tata Ace (छोटा हाथी)",
    isHeavy: true,
  },
  {
    id: "del-2",
    cropName: "Organic Desi Spinach (Palak)",
    hindiCrop: "जैविक पालक",
    quantityKg: 60,
    pickupName: "Jaivik Krishi Kendra",
    pickupLocation: "Alwar Road Farm Gate (3 km away)",
    dropName: "Gurugram Organic Consumer Co-op",
    dropLocation: "Sector 54 Hub (8 km trip)",
    payout: 180,
    pickupDistanceKm: 3,
    tripDistanceKm: 11,
    estTimeMins: 25,
    vehicleRequired: "2-Wheeler / Cargo Bike (बाइक)",
    isHeavy: false,
  },
  {
    id: "del-3",
    cropName: "MP Sharbati Wheat Sacks",
    hindiCrop: "शरबती गेहूं बोरी",
    quantityKg: 1200,
    pickupName: "Sardar Gurpreet Singh Farms",
    pickupLocation: "Samana Grain Hub (5 km away)",
    dropName: "Patiala Kisan Milling Plant",
    dropLocation: "Focal Point Terminal (18 km trip)",
    payout: 950,
    pickupDistanceKm: 5,
    tripDistanceKm: 23,
    estTimeMins: 60,
    vehicleRequired: "Heavy Cargo Pickup Truck (पिकअप ट्रक)",
    isHeavy: true,
  },
];

// Recent Customer Reviews for Rajesh Kumar
const RIDER_REVIEWS: RiderReview[] = [
  {
    id: "rev-1",
    author: "Rameshwar Patel",
    role: "Farmer",
    rating: 5.0,
    comment:
      "Arrived at Sonipat farm gate at 6:00 AM sharp. Handled 350kg tomato crates with extreme care. Zero bruising or transit squish.",
    date: "Yesterday",
    tag: "Careful Handling",
  },
  {
    id: "rev-2",
    author: "Kisan Milling Cooperative",
    role: "Bulk Buyer",
    rating: 4.9,
    comment:
      "Fast delivery via Delhi-Sonipat expressway. Verified batch seal before unloading. Excellent logistics partner.",
    date: "2 days ago",
    tag: "On-Time Delivery",
  },
  {
    id: "rev-3",
    author: "Jaivik Krishi Kendra",
    role: "Farmer",
    rating: 5.0,
    comment:
      "Polite communication, covered cargo with clean tarpaulin to protect organic greens from sun heat.",
    date: "3 days ago",
    tag: "Protective Tarpaulin",
  },
];

export default function RiderDeliveries() {
  const [isOnline, setIsOnline] = useState(true);
  const [deliveries, setDeliveries] =
    useState<DeliveryOrder[]>(INITIAL_DELIVERIES);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryOrder | null>(
    INITIAL_DELIVERIES[0],
  );
  const [deliveryStep, setDeliveryStep] = useState<
    "pickup" | "dropoff" | "completed"
  >("pickup");
  const [todayEarnings, setTodayEarnings] = useState(660);
  const [todayTrips, setTodayTrips] = useState(2);
  const [selectedReviewFilter, setSelectedReviewFilter] =
    useState<string>("All");

  // Decline request handler
  const handleDecline = (id: string) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
    if (activeDelivery?.id === id) {
      setActiveDelivery(null);
    }
  };

  // Accept request handler
  const handleAccept = (order: DeliveryOrder) => {
    setActiveDelivery(order);
    setDeliveryStep("pickup");
  };

  // Progress active delivery steps
  const handleNextStep = () => {
    if (deliveryStep === "pickup") {
      setDeliveryStep("dropoff");
    } else if (deliveryStep === "dropoff") {
      if (activeDelivery) {
        setTodayEarnings((prev) => prev + activeDelivery.payout);
        setTodayTrips((prev) => prev + 1);
      }
      setDeliveryStep("completed");
    }
  };

  const handleFinishDelivery = () => {
    if (activeDelivery) {
      setDeliveries((prev) => prev.filter((d) => d.id !== activeDelivery.id));
    }
    setActiveDelivery(null);
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] dark:bg-zinc-950 text-emerald-950 dark:text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. ZOMATO-INSPIRED TOP RIDER PROFILE & STATUS BANNER */}
      <div className="bg-[#0b3b20] text-white border-b-2 border-emerald-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Rider Avatar & Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80"
                alt="Rajesh Kumar"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-emerald-950 rounded-full p-1 shadow">
                <ShieldCheck className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
                  Rajesh Kumar (राजेश कुमार)
                </h1>
                <Badge className="bg-amber-400 text-emerald-950 font-black text-[10px] uppercase border-none px-2 py-0.5">
                  ⭐ Diamond Super Rider
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-emerald-200 mt-1 flex-wrap font-medium">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  4.92 Rating (142 ratings)
                </span>
                <span>•</span>
                <span>Vehicle: Electric Tata Ace (छोटा हाथी)</span>
                <span>•</span>
                <span className="text-emerald-300">Delhi-Sonipat Corridor</span>
              </div>
            </div>
          </div>

          {/* Online Toggle & Quick Metrics */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-[#052112] border border-emerald-700/80 px-3.5 py-1.5 rounded-xl text-center hidden sm:block">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                Safety Score
              </span>
              <span className="text-sm font-black text-amber-300">
                99% Safe
              </span>
            </div>

            <div className="bg-[#052112] border border-emerald-700/80 px-3.5 py-1.5 rounded-xl text-center hidden sm:block">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                On-Time SLA
              </span>
              <span className="text-sm font-black text-white">98.4%</span>
            </div>

            {/* Online / Offline Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer select-none shadow-md ${
                isOnline
                  ? "bg-amber-400 hover:bg-amber-300 text-emerald-950 border-2 border-amber-300"
                  : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {isOnline ? "DUTY: ONLINE (ड्यूटी चालू)" : "DUTY: OFFLINE"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD: 2-COLUMN RESPONSIVE LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN (lg:col-span-7): DISPATCHES & ACTIVE TRIP     */}
          {/* ======================================================== */}
          <section className="lg:col-span-7 space-y-6">
            {/* Wallet Statistics Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
              <div className="p-2.5 bg-amber-50/50 dark:bg-zinc-800 rounded-xl">
                <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                  Today's Net Payout
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#0b3b20] dark:text-emerald-400 font-serif">
                  ₹{todayEarnings}
                </span>
              </div>

              <div className="p-2.5 bg-amber-50/50 dark:bg-zinc-800 rounded-xl">
                <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                  Completed Trips
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-white font-serif">
                  {todayTrips} trips
                </span>
              </div>

              <div className="p-2.5 bg-amber-50/50 dark:bg-zinc-800 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                  Weekly Volume
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-white font-serif">
                  1,280 kg
                </span>
              </div>
            </div>

            {/* ACTIVE TRIP STEP CONTROLLER (If Accepted) */}
            {activeDelivery && (
              <Card className="pt-0 border-2 border-amber-400 bg-amber-50/40 dark:bg-zinc-900 shadow-xl rounded-3xl overflow-hidden animate-in zoom-in-95">
                <CardHeader className="bg-[#0b3b20] text-white p-5 border-b border-emerald-800 flex flex-row justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full">
                        ⚡ Active Trip in Progress
                      </span>
                      <span className="text-xs text-emerald-200 font-mono">
                        {activeDelivery.id}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">
                      {activeDelivery.quantityKg} kg {activeDelivery.cropName} (
                      {activeDelivery.hindiCrop})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-emerald-300 block font-bold">
                      GUARANTEED PAYOUT
                    </span>
                    <span className="text-2xl font-black text-amber-300 font-serif">
                      ₹{activeDelivery.payout}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {deliveryStep !== "completed" ? (
                    <div className="space-y-4">
                      {/* Step Progress Checklist */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase text-emerald-950 dark:text-zinc-200 tracking-wider">
                            Dispatch Route Milestones
                          </h4>
                          <span className="text-[11px] font-bold text-amber-700">
                            {deliveryStep === "pickup"
                              ? "Step 1: Farmer Pickup"
                              : "Step 2: Destination Dropoff"}
                          </span>
                        </div>

                        <div className="space-y-3 bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-amber-200/80">
                          {/* Step 1: Pickup */}
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                  deliveryStep === "pickup"
                                    ? "bg-amber-400 text-emerald-950 ring-4 ring-amber-200"
                                    : "bg-emerald-700 text-white"
                                }`}
                              >
                                {deliveryStep === "pickup" ? (
                                  "1"
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div className="w-0.5 h-12 bg-amber-200 dark:bg-zinc-800" />
                            </div>
                            <div className="text-xs flex-grow pb-2">
                              <span className="font-extrabold text-emerald-950 dark:text-white block">
                                🟢 Farm Pickup: {activeDelivery.pickupName}
                              </span>
                              <span className="text-gray-500 block">
                                {activeDelivery.pickupLocation}
                              </span>
                              <span className="text-[10px] bg-amber-100 dark:bg-zinc-800 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded font-black mt-1 inline-block border border-amber-300">
                                Load: {activeDelivery.quantityKg} kg{" "}
                                {activeDelivery.cropName}
                              </span>
                            </div>
                          </div>

                          {/* Step 2: Dropoff */}
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                  deliveryStep === "dropoff"
                                    ? "bg-amber-400 text-emerald-950 ring-4 ring-amber-200"
                                    : "bg-gray-200 dark:bg-zinc-800 text-gray-600"
                                }`}
                              >
                                2
                              </div>
                            </div>
                            <div className="text-xs flex-grow">
                              <span className="font-extrabold text-emerald-950 dark:text-white block">
                                🔴 Drop Destination: {activeDelivery.dropName}
                              </span>
                              <span className="text-gray-500 block">
                                {activeDelivery.dropLocation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Primary Navigation / Step Button */}
                      <Button
                        onClick={handleNextStep}
                        className="w-full bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 py-4 font-black text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>
                          {deliveryStep === "pickup"
                            ? "✓ Arrived at Farm Gate & Loaded Crates"
                            : "✓ Deliver Cargo & Collect ₹" +
                              activeDelivery.payout}
                        </span>
                      </Button>
                    </div>
                  ) : (
                    /* Success Finished screen */
                    <div className="text-center py-4 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mx-auto border-2 border-emerald-400 shadow-sm">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-emerald-950 dark:text-white font-serif">
                          Trip Completed Successfully!
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Direct driver payout of{" "}
                          <strong>₹{activeDelivery.payout}</strong> has been
                          credited to your wallet.
                        </p>
                      </div>
                      <Button
                        onClick={handleFinishDelivery}
                        className="w-full bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-bold rounded-xl"
                      >
                        Accept Next Sourced Trip ➔
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* INCOMING DISPATCH REQUESTS FEED */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-emerald-950 dark:text-white tracking-tight uppercase font-serif">
                    Nearby Sourced Farm Requests
                  </h3>
                  <p className="text-xs text-gray-500">
                    Direct dispatches from verified regional APMC mandi farms
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {deliveries.length} loads available
                </span>
              </div>

              {!isOnline ? (
                /* Offline Mode Banner */
                <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-amber-300 dark:border-zinc-800 p-8 rounded-3xl text-center space-y-3">
                  <span className="text-3xl block">📴</span>
                  <h4 className="font-black text-sm text-emerald-950 dark:text-white">
                    You are currently Offline (ड्यूटी बंद है)
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Toggle your status to ONLINE above to start receiving live
                    farm-to-mandi cargo pickup requests.
                  </p>
                </div>
              ) : deliveries.length === 0 ? (
                /* Empty State */
                <div className="bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 p-8 rounded-3xl text-center space-y-3">
                  <span className="text-3xl block">🔎</span>
                  <h4 className="font-black text-sm text-emerald-950 dark:text-white">
                    Looking for nearby farm loads...
                  </h4>
                  <p className="text-xs text-gray-500">
                    New listings appear as soon as farmers schedule harvest
                    dispatch.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeliveries(INITIAL_DELIVERIES)}
                    className="flex items-center gap-1 mx-auto text-xs font-bold rounded-xl"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Requests
                  </Button>
                </div>
              ) : (
                /* Requests list */
                <div className="space-y-4">
                  {deliveries.map((del) => {
                    const isActive = activeDelivery?.id === del.id;
                    return (
                      <div
                        key={del.id}
                        className={`bg-white dark:bg-zinc-900 border-2 rounded-2xl p-5 shadow-sm transition ${
                          isActive
                            ? "border-amber-400 bg-amber-50/20"
                            : "border-amber-200/80 dark:border-zinc-800 hover:border-amber-400"
                        }`}
                      >
                        {/* Top Details & Payout */}
                        <div className="flex justify-between items-start gap-3 border-b border-amber-100 dark:border-zinc-800 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-sm text-emerald-950 dark:text-white">
                                📦 {del.quantityKg} kg {del.cropName} (
                                {del.hindiCrop})
                              </span>
                              <span className="text-[10px] font-black bg-amber-100 text-emerald-950 px-2 py-0.5 rounded border border-amber-300">
                                {del.vehicleRequired}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400">
                              Order ID: {del.id}
                            </p>
                          </div>

                          {/* Payout */}
                          <div className="text-right shrink-0 bg-[#0b3b20] px-3.5 py-1.5 rounded-xl text-white border border-emerald-700">
                            <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-bold">
                              RIDER PAYOUT
                            </span>
                            <span className="text-xl font-black text-amber-300 font-serif">
                              ₹{del.payout}
                            </span>
                          </div>
                        </div>

                        {/* Route Timeline */}
                        <div className="py-3.5 space-y-2 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-700 shrink-0 font-black">
                              🟢 Pickup:
                            </span>
                            <div>
                              <span className="font-bold text-emerald-950 dark:text-white block">
                                {del.pickupName}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {del.pickupLocation}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 shrink-0 font-black">
                              🔴 Dropoff:
                            </span>
                            <div>
                              <span className="font-bold text-emerald-950 dark:text-white block">
                                {del.dropName}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {del.dropLocation}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Metadata footer strip */}
                        <div className="border-t border-amber-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-xs text-gray-500 font-medium">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 font-semibold text-emerald-900 dark:text-zinc-300">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />{" "}
                              {del.estTimeMins} mins
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-emerald-900 dark:text-zinc-300">
                              <MapPin className="w-3.5 h-3.5 text-amber-600" />{" "}
                              {del.tripDistanceKm} km
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDecline(del.id)}
                              className="px-3 py-1.5 border border-amber-300 rounded-xl hover:bg-amber-50 text-gray-600 font-bold transition cursor-pointer text-xs"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAccept(del)}
                              className="px-4 py-1.5 bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 rounded-xl font-black transition cursor-pointer text-xs shadow-xs"
                            >
                              {isActive ? "Viewing Route 🚀" : "Accept Trip 🚀"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* ======================================================== */}
          {/* RIGHT COLUMN (lg:col-span-5): LIVE MAP & CUSTOMER REVIEWS */}
          {/* ======================================================== */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* 1. OpenStreetMap Interactive Route Card */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-amber-300 dark:border-zinc-800 rounded-3xl p-5 shadow-md overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-zinc-800 flex items-center justify-center text-amber-700">
                    <Map className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-emerald-950 dark:text-white font-serif">
                      Live OpenStreetMap Route
                    </h3>
                    <span className="text-[10px] text-gray-500 font-semibold block">
                      Delhi NCR & Sonipat APMC Corridor
                    </span>
                  </div>
                </div>

                <Badge className="bg-emerald-100 text-emerald-900 text-[10px] font-black border-emerald-300 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-700 animate-pulse" />
                  GPS ACTIVE
                </Badge>
              </div>

              {/* Map Preview Container with simulated OpenStreetMap tiles & route markers */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-200 bg-[#e8ece9] dark:bg-zinc-950 aspect-[4/3] shadow-inner flex flex-col justify-between p-3">
                {/* Embedded OpenStreetMap Leaflet Tile Simulator */}
                <iframe
                  title="OpenStreetMap Sourcing Route"
                  className="absolute inset-0 w-full h-full border-none opacity-85 pointer-events-none"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=76.9000%2C28.6000%2C77.2500%2C29.0500&layer=mapnik"
                />

                {/* Animated Route Path Line Overlay (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <linearGradient
                      id="routeGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  {/* Route Polyline connecting farm gate to Azadpur Mandi */}
                  <path
                    d="M 50,45 Q 120,70 160,110 T 260,170"
                    fill="none"
                    stroke="url(#routeGrad)"
                    strokeWidth="4"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                </svg>

                {/* Top Metrics Floating Pill */}
                <div className="relative z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs border border-amber-300 rounded-xl p-2.5 shadow-md flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-emerald-950 dark:text-white">
                    <Navigation className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      Trip:{" "}
                      {activeDelivery
                        ? `${activeDelivery.tripDistanceKm} km`
                        : "14 km"}
                    </span>
                  </div>
                  <div className="text-amber-800 dark:text-amber-400 font-black">
                    ETA:{" "}
                    {activeDelivery
                      ? `${activeDelivery.estTimeMins} mins`
                      : "40 mins"}
                  </div>
                </div>

                {/* Marker Overlay Indicators */}
                <div className="relative z-20 flex justify-between items-end pt-12">
                  <div className="bg-[#0b3b20] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md border border-amber-300 flex items-center gap-1">
                    <CircleDot className="w-3 h-3 text-emerald-400" />
                    <span>Sonipat Farm Gate</span>
                  </div>
                  <div className="bg-red-700 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md border border-red-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white" />
                    <span>Azadpur Terminal Gate 4</span>
                  </div>
                </div>
              </div>

              {/* Turn-by-Turn Guidance Preview */}
              <div className="bg-amber-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                <span className="font-extrabold text-amber-900 dark:text-amber-300 block text-[10px] uppercase">
                  🛣️ Next Highway Milestone:
                </span>
                <p className="text-emerald-950 dark:text-zinc-200 font-medium">
                  Take NH-44 (Grand Trunk Road) South toward Mukarba Chowk
                  Flyover. Smooth flow reported.
                </p>
              </div>
            </div>

            {/* 2. Rider Rating & Customer Reviews Card */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-zinc-800 flex items-center justify-center text-emerald-800">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-emerald-950 dark:text-white font-serif">
                      Customer & Farmer Feedback
                    </h3>
                    <span className="text-[10px] text-gray-500 font-semibold block">
                      Based on 142 recent farm dispatches
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.92 / 5.0</span>
                </div>
              </div>

              {/* Review Item List */}
              <div className="space-y-3">
                {RIDER_REVIEWS.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#faf8f2] dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-amber-200/70 dark:border-zinc-700 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-emerald-950 dark:text-white">
                          {rev.author}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-emerald-950 px-1.5 py-0.2 rounded border border-amber-300">
                          {rev.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                      <span className="bg-emerald-50 dark:bg-zinc-900 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        ✓ {rev.tag}
                      </span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 4. UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
