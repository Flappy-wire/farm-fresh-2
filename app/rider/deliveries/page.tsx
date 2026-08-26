"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockApi } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  XCircle,
  Power,
  TrendingUp,
  RotateCcw,
  Check,
  Undo2,
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  cropName: string;
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

// Enriched mock delivery orders list matching the requested wireframe
const INITIAL_DELIVERIES: DeliveryOrder[] = [
  {
    id: "del-1",
    cropName: "Tomatoes",
    quantityKg: 350,
    pickupName: "Choudhary Farms",
    pickupLocation: "Sonipat Rural (2 km away)",
    dropName: "Whole Foods Mart, Azadpur",
    dropLocation: "Delhi Wholesale Market (12 km trip)",
    payout: 480,
    pickupDistanceKm: 2,
    tripDistanceKm: 14,
    estTimeMins: 40,
    vehicleRequired: "Mini-Truck / Auto",
    isHeavy: true,
  },
  {
    id: "del-2",
    cropName: "Onions",
    quantityKg: 50,
    pickupName: "Ramesh Farm",
    pickupLocation: "Nakhula Fields (4 km away)",
    dropName: "Hotel Annapurna Kitchen",
    dropLocation: "Jagiroad Market (5 km trip)",
    payout: 120,
    pickupDistanceKm: 4,
    tripDistanceKm: 9,
    estTimeMins: 20,
    vehicleRequired: "2-Wheeler / Bike",
    isHeavy: false,
  },
  {
    id: "del-3",
    cropName: "Wheat Grain Sacks",
    quantityKg: 1200,
    pickupName: "Gurpreet Organic Farms",
    pickupLocation: "Samudrapur Hub (6 km away)",
    dropName: "Kisan Milling Cooperative",
    dropLocation: "MIDC Sourcing Terminal (18 km trip)",
    payout: 950,
    pickupDistanceKm: 6,
    tripDistanceKm: 24,
    estTimeMins: 65,
    vehicleRequired: "Heavy Cargo Truck",
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
  const [todayEarnings, setTodayEarnings] = useState(640);
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
    <div className="min-h-screen bg-[#f7f8f9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* 1. TOP NAV STRIP */}
      <nav className="bg-[#002f34] text-white border-b border-teal-950/40 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-white hover:opacity-85 transition">
              <Undo2 className="w-5 h-5" />
            </Link>
            <span className="font-extrabold text-base tracking-tight">
              🛵 Rider Logistics Portal
            </span>
          </div>

          {/* Toggle Online / Offline */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer select-none ${
              isOnline
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-gray-600 hover:bg-gray-500 text-white"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnline ? "ONLINE" : "OFFLINE"}</span>
          </button>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <main className="max-w-2xl mx-auto px-4 py-6 w-full flex-grow space-y-6">
        {/* Driver stats banner */}
        <div className="grid grid-cols-2 gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-lg shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Today's Earnings
            </span>
            <span className="text-2xl font-black text-green-600 dark:text-green-400">
              ₹{todayEarnings}
            </span>
          </div>
          <div className="border-l border-gray-100 dark:border-zinc-800 pl-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Completed Trips
            </span>
            <span className="text-2xl font-black text-[#002f34] dark:text-white">
              {todayTrips} jobs
            </span>
          </div>
        </div>

        {/* ACTIVE TRIP DISPLAY (If Accepted) */}
        {activeDelivery && (
          <Card className="border-2 border-teal-500 bg-teal-50/20 dark:bg-teal-950/20 shadow-md">
            <CardHeader className="border-b border-teal-100 dark:border-teal-900 pb-3 flex flex-row justify-between items-center bg-teal-50/50 dark:bg-teal-950/40">
              <div>
                <span className="text-[10px] font-bold uppercase bg-teal-600 text-white px-2 py-0.5 rounded">
                  Active Dispatch Order
                </span>
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  Job ID: {activeDelivery.id}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-[#002f34] dark:text-teal-300">
                  ₹{activeDelivery.payout}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {deliveryStep !== "completed" ? (
                <div className="space-y-4">
                  {/* Status Timeline Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300 tracking-wider">
                      Delivery Route Checklist
                    </h4>

                    <div className="space-y-3">
                      {/* Step 1: Pickup */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              deliveryStep === "pickup"
                                ? "bg-teal-600 text-white ring-4 ring-teal-100"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {deliveryStep === "pickup" ? (
                              "1"
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="w-0.5 h-12 bg-gray-200 dark:bg-zinc-800" />
                        </div>
                        <div className="text-xs flex-grow pb-2">
                          <span className="font-extrabold text-gray-900 dark:text-white block">
                            Pickup: {activeDelivery.pickupName}
                          </span>
                          <span className="text-gray-500 block">
                            {activeDelivery.pickupLocation}
                          </span>
                          <span className="text-[10px] bg-teal-50 dark:bg-teal-950/60 text-teal-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                            Collect: {activeDelivery.quantityKg} kg{" "}
                            {activeDelivery.cropName}
                          </span>
                        </div>
                      </div>

                      {/* Step 2: Dropoff */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              deliveryStep === "dropoff"
                                ? "bg-teal-600 text-white ring-4 ring-teal-100"
                                : "bg-gray-200 dark:bg-zinc-800"
                            }`}
                          >
                            2
                          </div>
                        </div>
                        <div className="text-xs flex-grow">
                          <span className="font-extrabold text-gray-900 dark:text-white block">
                            Dropoff: {activeDelivery.dropName}
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
                    className="w-full bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44] text-white py-3.5 font-bold text-sm flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>
                      {deliveryStep === "pickup"
                        ? "Arrived at Pickup & Loaded"
                        : "Deliver & Collect Cash Payout"}
                    </span>
                  </Button>
                </div>
              ) : (
                /* Success Finished screen */
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center text-xl mx-auto">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-[#002f34] dark:text-white">
                      Delivery Completed!
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Payout of ₹{activeDelivery.payout} has been credited to
                      your rider wallet.
                    </p>
                  </div>
                  <Button
                    onClick={handleFinishDelivery}
                    className="w-full bg-[#002f34] dark:bg-teal-600"
                  >
                    Find Next Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* REQUESTS VIEW */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-[#002f34] dark:text-white tracking-tight uppercase">
              Nearby Sourced Requests
            </h3>
            <span className="text-xs font-semibold text-gray-500">
              {deliveries.length} loads available
            </span>
          </div>

          {!isOnline ? (
            /* Offline Mode Banner */
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-lg text-center space-y-3">
              <span className="text-3xl block">📴</span>
              <h4 className="font-bold text-sm">You are currently Offline</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Toggle online at the top to receive live agricultural cargo pick
                up requests.
              </p>
            </div>
          ) : deliveries.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-lg text-center space-y-3">
              <span className="text-3xl block">🔎</span>
              <h4 className="font-bold text-sm">Looking for nearby loads...</h4>
              <p className="text-xs text-gray-500">
                Fresh listings show up automatically like Swiggy. Check back in
                a few seconds.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeliveries(INITIAL_DELIVERIES)}
                className="flex items-center gap-1 mx-auto text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Requests
              </Button>
            </div>
          ) : (
            /* Requests list grid */
            <div className="space-y-3">
              {deliveries.map((del) => (
                <div
                  key={del.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                >
                  {/* Top Details & Payout */}
                  <div className="flex justify-between items-start gap-3 border-b border-gray-100 dark:border-zinc-800/80 pb-3">
                    <div className="space-y-1">
                      {/* Load info */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                          📦 {del.quantityKg} kg {del.cropName}
                        </span>
                        <span className="text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded">
                          {del.vehicleRequired}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Order ID: {del.id}
                      </p>
                    </div>

                    {/* Payout */}
                    <div className="text-right shrink-0 bg-green-50 dark:bg-green-950/60 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/60">
                      <span className="text-[9px] uppercase tracking-wider text-green-700 dark:text-green-400 block font-bold">
                        RIDER PAYOUT
                      </span>
                      <span className="text-lg font-black text-green-800 dark:text-green-300">
                        ₹{del.payout}
                      </span>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="py-3 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 shrink-0 mt-0.5 font-bold">
                        🟢 Pickup:
                      </span>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {del.pickupName}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {del.pickupLocation}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 shrink-0 mt-0.5 font-bold">
                        🔴 Dropoff:
                      </span>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {del.dropName}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {del.dropLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata footer strip */}
                  <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-3 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />{" "}
                        {del.estTimeMins} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />{" "}
                        {del.tripDistanceKm} km total
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecline(del.id)}
                        className="px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400 font-bold transition cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(del)}
                        className="px-4 py-1.5 bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44] text-white rounded font-bold transition cursor-pointer"
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
    </div>
  );
}
