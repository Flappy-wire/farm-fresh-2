"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockApi } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Store,
  MapPin,
  Truck,
  Sparkles,
  Check,
  TrendingDown,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Undo2,
  PackageCheck,
  HelpCircle,
} from "lucide-react";

export default function BulkOrderPage() {
  const [cropType, setCropType] = useState<string>("Tomato");
  const [grade, setGrade] = useState<"A" | "B">("A");
  const [quantityInput, setQuantityInput] = useState<string>("1");
  const [unit, setUnit] = useState<"kg" | "Quintal" | "Ton">("Ton");
  const [pincode, setPincode] = useState<string>("110001 (Delhi Central)");
  const [maxRadius, setMaxRadius] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  // Rider assignment sub-state
  const [isAssigningRider, setIsAssigningRider] = useState(false);
  const [riderInfo, setRiderInfo] = useState<any | null>(null);

  // Convert current input to kg
  const quantityInKg = (() => {
    const qNum = Number(quantityInput) || 0;
    if (unit === "Quintal") return qNum * 100;
    if (unit === "Ton") return qNum * 1000;
    return qNum;
  })();

  // Trigger quick presets
  const applyPreset = (qty: number, u: "kg" | "Quintal" | "Ton") => {
    setQuantityInput(String(qty));
    setUnit(u);
    setOrder(null);
    setRiderInfo(null);
  };

  const handleBulkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    setRiderInfo(null);

    // Call aggregation mock API
    const result: any = await mockApi.aggregateOrder(cropType, quantityInKg);

    // Simulate extra transport calculation
    const freight = Math.round(result.splits.length * 750 + maxRadius * 30);
    const aggFee = Math.round(result.totalPrice * 0.02);

    setOrder({
      ...result,
      freight,
      aggFee,
      pincode,
      grade,
      maxRadius,
    });
    setLoading(false);
  };

  // Dispatch logistics assignment
  const handleAssignRider = async () => {
    if (!order) return;
    setIsAssigningRider(true);
    const rider = await mockApi.assignRider(order.orderId);
    setRiderInfo(rider);
    setIsAssigningRider(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Navbar Strip */}
      <nav className="bg-[#002f34] text-white border-b border-teal-950/40 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-white hover:opacity-85 transition">
              <Undo2 className="w-5 h-5" />
            </Link>
            <span className="font-extrabold text-base tracking-tight">
              🚜 Bulk Procurement Console
            </span>
          </div>
          <Link
            href="/buyer/marketplace"
            className="text-xs font-bold text-teal-400 hover:underline"
          >
            Switch to Retail OLX View
          </Link>
        </div>
      </nav>

      {/* Main Layout Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: RFQ Form Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#002f34] dark:text-zinc-100 tracking-tight flex items-center gap-2">
                🚜 Bulk Aggregation
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                Source heavy volume produce. Our AI engine dynamically splits
                quantities across verified nearby farmers to minimize freight
                distance.
              </p>
            </div>

            <Card className="shadow bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
              <CardContent className="p-6">
                <form onSubmit={handleBulkOrder} className="space-y-5">
                  {/* 1. Crop Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase block">
                        1. Crop Produce
                      </span>
                      <select
                        value={cropType}
                        onChange={(e) => {
                          setCropType(e.target.value);
                          setOrder(null);
                        }}
                        className="w-full p-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="Tomato">🍅 Tomato</option>
                        <option value="Onion">🧅 Onion</option>
                        <option value="Potato">🥔 Potato</option>
                        <option value="Wheat">🌾 Wheat</option>
                        <option value="Mango">🥭 Mango</option>
                        <option value="Spinach">🥬 Spinach</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase block">
                        Quality Grade
                      </span>
                      <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-md border border-gray-200 dark:border-zinc-700 h-10 items-center justify-between">
                        {(["A", "B"] as const).map((g) => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => {
                              setGrade(g);
                              setOrder(null);
                            }}
                            className={`flex-1 text-center py-1 rounded text-xs font-bold transition cursor-pointer ${
                              grade === g
                                ? "bg-white dark:bg-zinc-900 shadow text-[#002f34] dark:text-teal-400"
                                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                            }`}
                          >
                            Grade {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 2. Quantity & Units */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-500 uppercase block">
                          Required Volume
                        </span>
                        <Input
                          type="number"
                          value={quantityInput}
                          onChange={(e) => {
                            setQuantityInput(e.target.value);
                            setOrder(null);
                          }}
                          placeholder="e.g. 1"
                          className="font-bold text-base"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-500 uppercase block">
                          Unit
                        </span>
                        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-md border border-gray-200 dark:border-zinc-700 h-10 items-center justify-between">
                          {(["kg", "Quintal", "Ton"] as const).map((u) => (
                            <button
                              type="button"
                              key={u}
                              onClick={() => {
                                setUnit(u);
                                setOrder(null);
                              }}
                              className={`flex-1 text-center py-1 rounded text-xs font-bold transition cursor-pointer ${
                                unit === u
                                  ? "bg-white dark:bg-zinc-900 shadow text-[#002f34] dark:text-teal-400"
                                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                              }`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Volume Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <button
                        type="button"
                        onClick={() => applyPreset(500, "kg")}
                        className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded cursor-pointer"
                      >
                        500 kg
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(1, "Ton")}
                        className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded cursor-pointer"
                      >
                        1 Ton (1,000 kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(5, "Ton")}
                        className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded cursor-pointer"
                      >
                        5 Tons (5,000 kg)
                      </button>
                    </div>
                  </div>

                  {/* 3. Delivery Pincode */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">
                      3. Delivery Destination Pincode
                    </span>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          setOrder(null);
                        }}
                        className="pl-9 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* 4. Proximity Radius Selector */}
                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-500 uppercase">
                        Max Sourcing Radius
                      </span>
                      <span className="text-teal-600">{maxRadius} km</span>
                    </div>
                    <Slider
                      min={10}
                      max={100}
                      step={5}
                      value={[maxRadius]}
                      onValueChange={(val: any) => {
                        setMaxRadius(Array.isArray(val) ? val[0] : Number(val));
                        setOrder(null);
                      }}
                    />
                  </div>

                  {/* Submit RFQ */}
                  <Button
                    type="submit"
                    disabled={loading || quantityInKg <= 0}
                    className="w-full bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44] dark:hover:bg-teal-500 text-white font-bold py-3.5 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {loading
                        ? "Aggregating Farm Stock..."
                        : "🚀 Find Best Sourcing Options"}
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AI Aggregation Preview & Results Canvas */}
          <div className="lg:col-span-7">
            {order ? (
              /* Visual Sourcing Outcome Cards */
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <Card className="border-l-4 border-l-teal-500 bg-white dark:bg-zinc-900 shadow">
                  <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-3 flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold">
                          Order Sourced Successfully
                        </CardTitle>
                        <Badge className="bg-teal-100 text-teal-800 border-teal-300 font-bold uppercase text-[9px] tracking-wide">
                          AGGREGATED
                        </Badge>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Sourcing ID: {order.orderId}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">
                        Delivery Pincode
                      </span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                        {order.pincode}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Aggregation metrics banner */}
                    <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-lg text-center">
                      <div>
                        <span className="text-xs text-gray-500 block uppercase font-bold">
                          Demand Fulfilled
                        </span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                          {order.totalQuantity.toLocaleString("en-IN")} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block uppercase font-bold">
                          Farms Combined
                        </span>
                        <span className="text-lg font-black text-teal-700 dark:text-teal-400">
                          {order.splits.length} Local Farms
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block uppercase font-bold">
                          Sourcing Range
                        </span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                          ≤ {order.maxRadius} km
                        </span>
                      </div>
                    </div>

                    {/* Sourcing splits list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-teal-600" />
                        <span>Aggregated Crop Splits Breakdown</span>
                      </h4>

                      <div className="space-y-2">
                        {order.splits.map((split: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-3 rounded-lg flex items-center justify-between hover:shadow-xs transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center font-bold text-xs text-teal-800 dark:text-teal-300 shrink-0">
                                {idx + 1}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                                  {split.farmerName}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {split.distance} km pickup distance
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-gray-900 dark:text-white block">
                                {split.quantity.toLocaleString()} kg
                              </span>
                              <span className="text-[10px] text-gray-500">
                                @ ₹{split.pricePerKg}/kg
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing summary table */}
                    <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-2 text-xs">
                      <h4 className="font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                        Wholesale Cost Sourcing Summary
                      </h4>
                      <div className="space-y-1.5 text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Base Crop Procurement Cost:</span>
                          <span className="font-semibold text-gray-800 dark:text-zinc-200">
                            ₹{order.totalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Multi-farm Sourcing Freight Estimate:</span>
                          <span className="font-semibold text-gray-800 dark:text-zinc-200">
                            ₹{order.freight.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sourcing Aggregation Fee (2%):</span>
                          <span className="font-semibold text-gray-800 dark:text-zinc-200">
                            ₹{order.aggFee.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-dashed pt-2 font-black text-sm text-[#002f34] dark:text-teal-300">
                          <span>Total Expected Cost:</span>
                          <span>
                            ₹
                            {(
                              order.totalPrice +
                              order.freight +
                              order.aggFee
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Logistics dispatch section */}
                    <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-3">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Logistics Sourcing & Rider Dispatch</span>
                      </h4>

                      {!riderInfo ? (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                          <div>
                            <span className="font-bold text-xs text-blue-900 dark:text-blue-200 block">
                              Need transport dispatch for this aggregated cargo?
                            </span>
                            <span className="text-[10px] text-gray-500">
                              AI will select nearby mini-truck capacity matching
                              the deadline.
                            </span>
                          </div>
                          <Button
                            onClick={handleAssignRider}
                            disabled={isAssigningRider}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0"
                          >
                            {isAssigningRider
                              ? "Finding Capacity..."
                              : "⚡ Assign Mini-Truck"}
                          </Button>
                        </div>
                      ) : (
                        <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-lg space-y-2 animate-in slide-in-from-top-2 duration-150">
                          <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold text-xs uppercase">
                            <Check className="w-4 h-4 text-green-600 shrink-0" />
                            <span>Logistics Partner Dispatched</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-teal-800 dark:text-teal-300">
                            <p>
                              Assigned Rider:{" "}
                              <span className="font-bold text-gray-800 dark:text-zinc-200">
                                {riderInfo.riderName}
                              </span>
                            </p>
                            <p>
                              Phone Number:{" "}
                              <span className="font-bold text-gray-800 dark:text-zinc-200">
                                {riderInfo.riderPhone}
                              </span>
                            </p>
                            <p>
                              Vehicle Assigned:{" "}
                              <span className="font-bold text-gray-800 dark:text-zinc-200">
                                {riderInfo.vehicle}
                              </span>
                            </p>
                            <p>
                              Estimated ETA:{" "}
                              <span className="font-bold text-gray-800 dark:text-zinc-200">
                                {riderInfo.etaMinutes} mins
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Empty State instructions map preview placeholder */
              <div className="h-full border-2 border-dashed border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-3xl">
                  🚜
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-base font-bold text-gray-800 dark:text-zinc-200">
                    Sourcing Engine Sinks
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Set your crop parameters on the left and click **Find Best
                    Sourcing Options**. Our matching algorithm will pull
                    real-time inventory from local farmers within your radius.
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-55 text-xs text-gray-500">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Aggregated orders bypass middleman fees.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
