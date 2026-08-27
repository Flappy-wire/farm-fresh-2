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
}

// Enriched mock delivery orders list matching the Indian Mandi network
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

export default function RiderDeliveries() {
  const [isOnline, setIsOnline] = useState(true);
  const [deliveries, setDeliveries] =
    useState<DeliveryOrder[]>(INITIAL_DELIVERIES);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryOrder | null>(
    null,
  );
  const [deliveryStep, setDeliveryStep] = useState<
    "pickup" | "dropoff" | "completed"
  >("pickup");
  const [todayEarnings, setTodayEarnings] = useState(660);
  const [todayTrips, setTodayTrips] = useState(2);

  // Decline request handler
  const handleDecline = (id: string) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
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
      // Completed! Add to earnings
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
    <div className="min-h-screen bg-[#faf8f2] dark:bg-zinc-950 text-emerald-950 dark:text-zinc-100 flex flex-col font-sans">
      
      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. SUB-BAR & STATUS CONTROLLER */}
      <div className="bg-white dark:bg-zinc-900 border-b border-amber-200/80 dark:border-zinc-800 shadow-xs sticky top-[73px] z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#0b3b20] text-amber-300 flex items-center justify-center font-bold text-sm">
              🛵
            </span>
            <div>
              <span className="font-black text-sm text-emerald-950 dark:text-white block font-serif">
                Kisaan Agri Logistics Dispatch
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                Sonipat – Delhi Mandi Corridor
              </span>
            </div>
          </div>

          {/* Online/Offline Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer select-none shadow-sm ${
              isOnline
                ? "bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 border border-emerald-700"
                : "bg-gray-600 hover:bg-gray-500 text-white"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnline ? "DUTY: ONLINE" : "OFFLINE"}</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-grow space-y-6">
        
        {/* Driver Wallet Statistics */}
        <div className="grid grid-cols-2 gap-4 bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div>
            <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
              Today's Net Payout (आज की कमाई)
            </span>
            <span className="text-3xl font-black text-emerald-800 dark:text-emerald-400 font-serif">
              ₹{todayEarnings}
            </span>
          </div>
          <div className="border-l border-amber-100 dark:border-zinc-800 pl-4">
            <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
              Completed Farm Trips
            </span>
            <span className="text-3xl font-black text-emerald-950 dark:text-white font-serif">
              {todayTrips} trips
            </span>
          </div>
        </div>

        {/* ACTIVE TRIP DISPLAY (If Accepted) */}
        {activeDelivery && (
          <Card className="border-2 border-amber-400 bg-amber-50/40 dark:bg-zinc-900 shadow-xl rounded-3xl overflow-hidden animate-in zoom-in-95">
            <CardHeader className="bg-[#0b3b20] text-white p-5 border-b border-emerald-800 flex flex-row justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full">
                  Active Dispatch Order
                </span>
                <p className="text-xs text-emerald-200 mt-1 font-semibold">
                  Job Ref: {activeDelivery.id}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-300 font-serif">
                  ₹{activeDelivery.payout}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {deliveryStep !== "completed" ? (
                <div className="space-y-4">
                  {/* Status Timeline Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-emerald-950 dark:text-zinc-200 tracking-wider">
                      Trip Navigation Milestones
                    </h4>

                    <div className="space-y-3">
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
                            Farm Pickup: {activeDelivery.pickupName}
                          </span>
                          <span className="text-gray-500 block">
                            {activeDelivery.pickupLocation}
                          </span>
                          <span className="text-[10px] bg-amber-100 dark:bg-zinc-800 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded font-black mt-1 inline-block border border-amber-300">
                            Load: {activeDelivery.quantityKg} kg {activeDelivery.cropName} ({activeDelivery.hindiCrop})
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
                            Destination: {activeDelivery.dropName}
                          </span>
                          <span className="text-gray-500 block">
                            {activeDelivery.dropLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions to progress */}
                  <Button
                    onClick={handleNextStep}
                    className="w-full bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 py-4 font-black text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>
                      {deliveryStep === "pickup"
                        ? "Arrived at Farm & Loaded Cargo"
                        : "Deliver & Collect Guaranteed Payout"}
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
                      Delivery Completed!
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Payout of <strong>₹{activeDelivery.payout}</strong> has been credited to your direct rider wallet.
                    </p>
                  </div>
                  <Button
                    onClick={handleFinishDelivery}
                    className="w-full bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-bold rounded-xl"
                  >
                    Accept Next Sourced Trip
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* REQUESTS VIEW */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-emerald-950 dark:text-white tracking-tight uppercase font-serif">
              Nearby Sourced Dispatch Requests
            </h3>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full">
              {deliveries.length} loads available
            </span>
          </div>

          {!isOnline ? (
            /* Offline Mode Banner */
            <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-amber-300 dark:border-zinc-800 p-8 rounded-3xl text-center space-y-3">
              <span className="text-3xl block">📴</span>
              <h4 className="font-black text-sm text-emerald-950 dark:text-white">
                You are currently Offline
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Toggle your status to ONLINE above to start receiving live farm-to-mandi cargo pickup requests.
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
                New listings appear as soon as farmers schedule harvest dispatch.
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
            /* Requests list grid */
            <div className="space-y-4">
              {deliveries.map((del) => (
                <div
                  key={del.id}
                  className="bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition"
                >
                  {/* Top Details & Payout */}
                  <div className="flex justify-between items-start gap-3 border-b border-amber-100 dark:border-zinc-800 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-emerald-950 dark:text-white">
                          📦 {del.quantityKg} kg {del.cropName} ({del.hindiCrop})
                        </span>
                        <span className="text-[10px] font-black bg-amber-100 text-emerald-950 px-2 py-0.5 rounded border border-amber-300">
                          {del.vehicleRequired}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">Order ID: {del.id}</p>
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
                      <span className="text-emerald-700 shrink-0 font-black">🟢 Pickup:</span>
                      <div>
                        <span className="font-bold text-emerald-950 dark:text-white block">
                          {del.pickupName}
                        </span>
                        <span className="text-[11px] text-gray-500">{del.pickupLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 shrink-0 font-black">🔴 Dropoff:</span>
                      <div>
                        <span className="font-bold text-emerald-950 dark:text-white block">
                          {del.dropName}
                        </span>
                        <span className="text-[11px] text-gray-500">{del.dropLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata footer strip */}
                  <div className="border-t border-amber-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-emerald-900 dark:text-zinc-300">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> {del.estTimeMins} mins
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-900 dark:text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" /> {del.tripDistanceKm} km total
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
                        Accept Request 🚀
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* 4. UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
