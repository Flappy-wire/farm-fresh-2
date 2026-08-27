"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  Boxes,
  ShieldCheck,
  Leaf,
  Scale,
} from "lucide-react";

export default function BulkOrderPage() {
  const [cropType, setCropType] = useState<string>("Tomato");
  const [grade, setGrade] = useState<"A" | "B">("A");
  const [quantityInput, setQuantityInput] = useState<string>("1");
  const [unit, setUnit] = useState<"kg" | "Quintal" | "Ton">("Ton");
  const [pincode, setPincode] = useState<string>("110001 (Delhi Azadpur Mandi)");
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
    const rider: any = await mockApi.assignRider(order.orderId);
    setRiderInfo(rider);
    setIsAssigningRider(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] dark:bg-zinc-950 text-emerald-950 dark:text-zinc-100 flex flex-col font-sans">
      
      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. MAIN LAYOUT CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: RFQ Form Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                <Boxes className="w-3.5 h-3.5 text-amber-700" />
                <span>B2B Multi-Farm Sourcing • थोक खरीद समूहन</span>
              </div>
              <h1 className="text-3xl font-black text-emerald-950 dark:text-zinc-100 font-serif tracking-tight">
                Bulk Aggregation Engine
              </h1>
              <p className="text-xs text-emerald-800/80 dark:text-gray-400 leading-relaxed font-medium">
                Need heavy commercial volume? Enter your requirements below. Our algorithmic engine automatically pools inventory across verified nearby smallholders.
              </p>
            </div>

            <Card className="shadow-md bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-amber-50/50 dark:bg-zinc-800/50 border-b border-amber-100 dark:border-zinc-800 pb-3">
                <CardTitle className="text-sm font-black text-emerald-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>1. Configure Sourcing RFQ</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleBulkOrder} className="space-y-5">
                  
                  {/* 1. Crop Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-emerald-900 dark:text-gray-400 uppercase block">
                        Crop Produce (फसल)
                      </span>
                      <select
                        value={cropType}
                        onChange={(e) => {
                          setCropType(e.target.value);
                          setOrder(null);
                        }}
                        className="w-full p-2.5 border-2 border-emerald-900/30 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="Tomato">🍅 Tomato (टमाटर)</option>
                        <option value="Onion">🧅 Onion (प्याज)</option>
                        <option value="Potato">🥔 Potato (आलू)</option>
                        <option value="Wheat">🌾 Wheat (गेहूं)</option>
                        <option value="Mango">🥭 Mango (आम)</option>
                        <option value="Spinach">🥬 Spinach (पालक)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-emerald-900 dark:text-gray-400 uppercase block">
                        Quality Grade
                      </span>
                      <div className="flex bg-amber-50 dark:bg-zinc-800 p-1 rounded-xl border border-amber-200 dark:border-zinc-700 h-10 items-center justify-between">
                        {(["A", "B"] as const).map((g) => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => {
                              setGrade(g);
                              setOrder(null);
                            }}
                            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                              grade === g
                                ? "bg-[#0b3b20] text-amber-300 shadow-xs"
                                : "text-gray-600 dark:text-gray-400 hover:text-emerald-900"
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
                        <span className="text-[11px] font-bold text-emerald-900 dark:text-gray-400 uppercase block">
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
                          className="font-black text-base rounded-xl border-2 border-emerald-900/30"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-emerald-900 dark:text-gray-400 uppercase block">
                          Unit Scale
                        </span>
                        <div className="flex bg-amber-50 dark:bg-zinc-800 p-1 rounded-xl border border-amber-200 dark:border-zinc-700 h-10 items-center justify-between">
                          {(["kg", "Quintal", "Ton"] as const).map((u) => (
                            <button
                              type="button"
                              key={u}
                              onClick={() => {
                                setUnit(u);
                                setOrder(null);
                              }}
                              className={`flex-1 text-center py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                                unit === u
                                  ? "bg-[#0b3b20] text-amber-300 shadow-xs"
                                  : "text-gray-600 dark:text-gray-400 hover:text-emerald-900"
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
                        className="text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-emerald-950 px-2.5 py-1 rounded-lg cursor-pointer border border-amber-300"
                      >
                        500 kg
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(1, "Ton")}
                        className="text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-emerald-950 px-2.5 py-1 rounded-lg cursor-pointer border border-amber-300"
                      >
                        1 Ton (1,000 kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(5, "Ton")}
                        className="text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-emerald-950 px-2.5 py-1 rounded-lg cursor-pointer border border-amber-300"
                      >
                        5 Tons (5,000 kg)
                      </button>
                    </div>
                  </div>

                  {/* 3. Delivery Pincode */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-900 dark:text-gray-400 uppercase block">
                      3. Destination Hub / Pincode
                    </span>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-amber-600" />
                      <Input
                        type="text"
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          setOrder(null);
                        }}
                        className="pl-9 text-xs font-bold rounded-xl border-2 border-emerald-900/30"
                      />
                    </div>
                  </div>

                  {/* 4. Proximity Radius Selector */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-emerald-900 dark:text-gray-400 uppercase">Max Sourcing Radius</span>
                      <span className="text-amber-700 dark:text-amber-400 font-black">{maxRadius} km</span>
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
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black py-4 rounded-xl shadow-lg border border-amber-300/40 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{loading ? "Aggregating Smallholder Stocks..." : "🚀 Find Best Farm Sourcing Options"}</span>
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
                <Card className="border-2 border-amber-400 bg-white dark:bg-zinc-900 shadow-xl rounded-3xl overflow-hidden">
                  
                  <CardHeader className="bg-[#0b3b20] text-white p-5 border-b border-emerald-800 flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-black font-serif text-white">
                          Fulfillment Sourced Successfully
                        </CardTitle>
                        <Badge className="bg-amber-400 text-emerald-950 font-black uppercase text-[10px]">
                          100% MATCHED
                        </Badge>
                      </div>
                      <p className="text-xs text-emerald-200/80 mt-0.5">Sourcing Ref: {order.orderId}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-300 uppercase font-bold block">Delivery Pincode</span>
                      <span className="text-xs font-bold text-amber-300">{order.pincode}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Aggregation metrics banner */}
                    <div className="grid grid-cols-3 gap-2 bg-amber-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-amber-200 text-center">
                      <div>
                        <span className="text-[10px] text-amber-800 uppercase font-bold block">Total Demand</span>
                        <span className="text-lg font-black text-emerald-950 dark:text-white font-serif">
                          {order.totalQuantity.toLocaleString("en-IN")} kg
                        </span>
                      </div>
                      <div className="border-x border-amber-200">
                        <span className="text-[10px] text-amber-800 uppercase font-bold block">Farms Combined</span>
                        <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-serif">
                          {order.splits.length} Local Farms
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-800 uppercase font-bold block">Sourcing Range</span>
                        <span className="text-lg font-black text-emerald-950 dark:text-white font-serif">
                          ≤ {order.maxRadius} km
                        </span>
                      </div>
                    </div>

                    {/* Sourcing splits list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-emerald-950 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-600" />
                        <span>Aggregated Crop Splits Breakdown</span>
                      </h4>

                      <div className="space-y-2">
                        {order.splits.map((split: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-[#faf8f2] dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 p-3.5 rounded-xl flex items-center justify-between hover:border-amber-400 transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#0b3b20] flex items-center justify-center font-black text-xs text-amber-300 shrink-0">
                                {idx + 1}
                              </div>
                              <div>
                                <span className="text-xs font-black text-emerald-950 dark:text-white block">
                                  {split.farmerName}
                                </span>
                                <span className="text-[11px] text-gray-500 font-medium">
                                  {split.distance} km pickup distance
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-950 dark:text-white block">
                                {split.quantity.toLocaleString()} kg
                              </span>
                              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                                @ ₹{split.pricePerKg}/kg
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing summary table */}
                    <div className="border-t border-amber-200 dark:border-zinc-800 pt-4 space-y-2 text-xs">
                      <h4 className="font-extrabold text-emerald-950 dark:text-zinc-200 uppercase tracking-wider">
                        Wholesale Cost Sourcing Summary
                      </h4>
                      <div className="space-y-1.5 text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Base Crop Procurement Cost:</span>
                          <span className="font-bold text-emerald-950 dark:text-zinc-200">
                            ₹{order.totalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Multi-Farm Agri Freight Estimate:</span>
                          <span className="font-bold text-emerald-950 dark:text-zinc-200">
                            ₹{order.freight.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sourcing Aggregation Fee (2%):</span>
                          <span className="font-bold text-emerald-950 dark:text-zinc-200">
                            ₹{order.aggFee.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-amber-300 pt-2 font-black text-base text-[#0b3b20] dark:text-amber-300">
                          <span>Total Sourced Cost:</span>
                          <span>
                            ₹{(order.totalPrice + order.freight + order.aggFee).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Logistics dispatch section */}
                    <div className="border-t border-amber-200 dark:border-zinc-800 pt-4 space-y-3">
                      <h4 className="text-xs font-extrabold text-emerald-950 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <span>Logistics Sourcing & Mini-Truck Dispatch</span>
                      </h4>

                      {!riderInfo ? (
                        <div className="p-4 bg-amber-50 dark:bg-zinc-800/80 border-2 border-amber-200 dark:border-zinc-700 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                          <div>
                            <span className="font-black text-xs text-emerald-950 dark:text-white block">
                              Need multi-pickup mini-truck dispatch?
                            </span>
                            <span className="text-[11px] text-gray-500">
                              Our AI will coordinate combined route pickups across all {order.splits.length} farms.
                            </span>
                          </div>
                          <Button
                            onClick={handleAssignRider}
                            disabled={isAssigningRider}
                            className="bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 text-xs font-black shrink-0 rounded-xl px-4 py-2"
                          >
                            {isAssigningRider ? "Finding Capacity..." : "⚡ Dispatch Agri Mini-Truck"}
                          </Button>
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 rounded-2xl space-y-2 animate-in slide-in-from-top-2 duration-150">
                          <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-bold text-xs uppercase">
                            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>Logistics Mini-Truck Dispatched</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-emerald-900 dark:text-emerald-300">
                            <p>Assigned Driver: <span className="font-bold">{riderInfo.riderName}</span></p>
                            <p>Phone Number: <span className="font-bold">{riderInfo.riderPhone}</span></p>
                            <p>Vehicle: <span className="font-bold">{riderInfo.vehicle}</span></p>
                            <p>ETA to First Farm: <span className="font-bold">{riderInfo.etaMinutes} mins</span></p>
                          </div>
                        </div>
                      )}
                    </div>

                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Empty State visual placeholder */
              <div className="h-full border-2 border-dashed border-amber-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[440px]">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
                  🚜
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-lg font-black text-emerald-950 dark:text-zinc-200 font-serif">
                    Automated Farm Aggregation
                  </h3>
                  <p className="text-xs text-emerald-900/80 dark:text-zinc-400 leading-relaxed">
                    Set your desired volume on the left. The engine queries live inventory from smallholders in your selected radius and calculates optimal route consolidation.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-zinc-800 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Eliminates 15-25% traditional commission agent cuts</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* 3. UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
