"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { mockApi } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Check,
  Camera,
  Upload,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sprout,
  ShieldCheck,
  Scale,
  Leaf,
  Coins,
} from "lucide-react";

interface CropConfig {
  name: string;
  hindi: string;
  emoji: string;
  minPrice: number;
  maxPrice: number;
  recommendation: number;
  image: string;
}

const CROP_PRESETS: Record<string, CropConfig> = {
  Tomato: {
    name: "Tomato",
    hindi: "टमाटर",
    emoji: "🍅",
    minPrice: 22,
    maxPrice: 28,
    recommendation: 24,
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
  },
  Potato: {
    name: "Potato",
    hindi: "आलू",
    emoji: "🥔",
    minPrice: 14,
    maxPrice: 20,
    recommendation: 16,
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
  },
  Onion: {
    name: "Onion",
    hindi: "प्याज",
    emoji: "🧅",
    minPrice: 18,
    maxPrice: 26,
    recommendation: 22,
    image:
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
  },
  Wheat: {
    name: "Wheat",
    hindi: "गेहूं",
    emoji: "🌾",
    minPrice: 30,
    maxPrice: 38,
    recommendation: 34,
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
  },
  Mango: {
    name: "Mango",
    hindi: "आम",
    emoji: "🥭",
    minPrice: 160,
    maxPrice: 220,
    recommendation: 190,
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
  },
  Spinach: {
    name: "Spinach",
    hindi: "पालक",
    emoji: "🥬",
    minPrice: 24,
    maxPrice: 35,
    recommendation: 28,
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80",
  },
  Carrot: {
    name: "Carrot",
    hindi: "गाजर",
    emoji: "🥕",
    minPrice: 22,
    maxPrice: 32,
    recommendation: 26,
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80",
  },
};

export default function NewCropPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");
  const [customCrop, setCustomCrop] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("500");
  const [unit, setUnit] = useState<"kg" | "Quintal" | "Ton">("kg");
  const [pricePerKg, setPricePerKg] = useState<string>("24");
  const [quality, setQuality] = useState<"A" | "B" | "C">("A");
  const [imageFile, setImageFile] = useState<string | null>(
    CROP_PRESETS.Tomato.image,
  );
  const [loading, setLoading] = useState(false);
  const [listed, setListed] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-update presets when crop changes
  useEffect(() => {
    if (selectedCrop !== "Other" && CROP_PRESETS[selectedCrop]) {
      setPricePerKg(String(CROP_PRESETS[selectedCrop].recommendation));
      setImageFile(CROP_PRESETS[selectedCrop].image);
    } else {
      setImageFile(null);
    }
    setAiSuggestion(null);
    setListed(false);
  }, [selectedCrop]);

  // Conversion calculations helper
  const quantityInKg = (() => {
    const qNum = Number(quantity) || 0;
    if (unit === "Quintal") return qNum * 100;
    if (unit === "Ton") return qNum * 1000;
    return qNum;
  })();

  const estimatedEarnings = quantityInKg * (Number(pricePerKg) || 0);

  // Validate form
  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (selectedCrop === "Other" && !customCrop.trim()) {
      tempErrors.name = "Please specify the crop name";
    }
    if (!quantity || Number(quantity) <= 0) {
      tempErrors.quantity = "Please enter a valid quantity";
    }
    if (!pricePerKg || Number(pricePerKg) <= 0) {
      tempErrors.price = "Please enter a valid price";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Analyze crop pricing first
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const cropName = selectedCrop === "Other" ? customCrop : selectedCrop;

    try {
      const recommendation: any = await mockApi.getAIRecommendation(
        cropName,
        Number(pricePerKg),
      );
      setAiSuggestion(recommendation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mock listing completion
  const handlePublish = () => {
    setListed(true);
  };

  // Auto fill pricing recommendation
  const applyAiPrice = () => {
    if (aiSuggestion) {
      setPricePerKg(String(aiSuggestion.suggestedPrice));
    } else if (selectedCrop !== "Other" && CROP_PRESETS[selectedCrop]) {
      setPricePerKg(String(CROP_PRESETS[selectedCrop].recommendation));
    }
  };

  // Mock visual upload trigger
  const triggerMockUpload = () => {
    if (selectedCrop !== "Other" && CROP_PRESETS[selectedCrop]) {
      setImageFile(CROP_PRESETS[selectedCrop].image);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] dark:bg-zinc-950 text-emerald-950 dark:text-zinc-100 flex flex-col font-sans">
      
      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        <Card className="shadow-xl border-2 border-amber-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
          
          <CardHeader className="bg-[#0b3b20] text-white p-6 border-b border-emerald-800">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                किसान पोर्टल • Kisaan Listing Hub
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
              🌾 List Your Harvest (फसल सूची बनाएं)
            </CardTitle>
            <p className="text-xs text-emerald-200/90 leading-relaxed font-medium">
              List your available crop inventory. Direct buyers within your radius will contact you with zero middleman commissions.
            </p>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {listed ? (
              /* Success Board */
              <div className="text-center py-10 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-md border-2 border-emerald-400">
                  🎉
                </div>
                <div>
                  <h3 className="text-2xl font-black text-emerald-950 dark:text-white font-serif">
                    फसल सफलतापूर्वक सूचीबद्ध हुई! (Listing Active)
                  </h3>
                  <p className="text-sm text-emerald-900/80 dark:text-gray-400 max-w-md mx-auto mt-2 leading-relaxed font-medium">
                    Your <strong>{selectedCrop === "Other" ? customCrop : selectedCrop}</strong> batch of <strong>{quantity} {unit}</strong> is now visible to verified buyers at <strong>₹{pricePerKg}/kg</strong>.
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <Button
                    onClick={() => {
                      setListed(false);
                      setAiSuggestion(null);
                    }}
                    variant="outline"
                    className="font-bold border-emerald-800 text-emerald-900 rounded-xl"
                  >
                    + List Another Crop (अन्य फसल जोड़ें)
                  </Button>
                  <Link href="/buyer/marketplace">
                    <Button className="bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-black rounded-xl">
                      View Marketplace Feed 🚀
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAnalyze} className="space-y-6">
                
                {/* 1. Visual Crop Preset Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-emerald-950 dark:text-zinc-200 uppercase tracking-wider">
                      1. Choose Produce (फसल चुनें)
                    </label>
                    <span className="text-[11px] text-amber-700 font-bold">One-tap quick select</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                    {Object.entries(CROP_PRESETS).map(([key, config]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedCrop(key)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 text-center transition cursor-pointer ${
                          selectedCrop === key
                            ? "border-amber-500 bg-amber-50 dark:bg-zinc-800 font-black shadow-sm scale-105"
                            : "border-amber-200/80 dark:border-zinc-800 bg-[#faf8f2] dark:bg-zinc-900 hover:bg-amber-50/60"
                        }`}
                      >
                        <span className="text-2xl mb-1">{config.emoji}</span>
                        <span className="text-[11px] font-bold text-emerald-950 dark:text-white tracking-tight leading-none">
                          {config.name}
                        </span>
                        <span className="text-[9px] text-amber-800 font-medium mt-0.5">
                          {config.hindi}
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedCrop === "Other" && (
                    <div className="pt-2">
                      <Input
                        type="text"
                        placeholder="Enter custom crop name (e.g. Ginger / Turmeric)"
                        value={customCrop}
                        onChange={(e) => setCustomCrop(e.target.value)}
                        className="rounded-xl border-2 border-amber-300 font-bold"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1 font-semibold">{errors.name}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Visual Photo Drop Box */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-emerald-950 dark:text-zinc-200 uppercase tracking-wider block">
                    2. Produce Harvest Photo (तस्वीर)
                  </label>
                  
                  <div
                    onClick={triggerMockUpload}
                    className="border-2 border-dashed border-amber-300 dark:border-zinc-700 bg-[#faf8f2] dark:bg-zinc-800/40 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition group"
                  >
                    {imageFile ? (
                      <div className="relative aspect-[16/9] w-full max-w-sm rounded-xl overflow-hidden shadow border border-amber-200">
                        <img
                          src={imageFile}
                          alt="Crop Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <span className="text-xs text-white font-bold bg-black/60 px-3 py-1.5 rounded-full">
                            Click to change photo
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 space-y-1">
                        <Camera className="w-8 h-8 text-amber-600 mx-auto" />
                        <span className="text-xs font-bold text-emerald-950 dark:text-white block">
                          Upload Live Farm Harvest Photo
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Clear photos get 3x more buyer inquiries
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Quantity & Unit Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-emerald-950 dark:text-zinc-200 uppercase tracking-wider block">
                    3. Available Stock Quantity (मात्रा)
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-7">
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 500"
                        className="font-black text-base rounded-xl border-2 border-amber-200"
                      />
                      {errors.quantity && (
                        <p className="text-xs text-red-500 mt-1 font-semibold">{errors.quantity}</p>
                      )}
                    </div>

                    <div className="sm:col-span-5">
                      <div className="flex bg-amber-50 dark:bg-zinc-800 p-1 rounded-xl border border-amber-200 dark:border-zinc-700 h-10 items-center justify-between">
                        {(["kg", "Quintal", "Ton"] as const).map((u) => (
                          <button
                            type="button"
                            key={u}
                            onClick={() => setUnit(u)}
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
                </div>

                {/* 4. Quality Grade Badges */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-emerald-950 dark:text-zinc-200 uppercase tracking-wider block">
                    4. Quality Standard (गुणवत्ता ग्रेड)
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { g: "A", title: "Grade A", sub: "Export / Premium", desc: "Uniform size, zero blemishes" },
                      { g: "B", title: "Grade B", sub: "Standard Mandi", desc: "Fresh, healthy, normal size" },
                      { g: "C", title: "Grade C", sub: "Processing / Pulp", desc: "For juice, pulp, chips" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.g}
                        onClick={() => setQuality(item.g as any)}
                        className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                          quality === item.g
                            ? "border-amber-500 bg-amber-50 dark:bg-zinc-800 shadow-xs"
                            : "border-amber-200/80 dark:border-zinc-800 bg-[#faf8f2] hover:bg-amber-50/50"
                        }`}
                      >
                        <span className="text-xs font-black text-emerald-950 dark:text-white block">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold block">
                          {item.sub}
                        </span>
                        <span className="text-[9px] text-gray-500 line-clamp-1 mt-0.5">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Expected Price & Live Mandi Guideline */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-emerald-950 dark:text-zinc-200 uppercase tracking-wider">
                      5. Your Selling Price (प्रति किलो भाव)
                    </label>
                    <button
                      type="button"
                      onClick={applyAiPrice}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-fill Mandi Benchmark
                    </button>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-base text-gray-500">₹</span>
                    <Input
                      type="number"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(e.target.value)}
                      placeholder="e.g. 24"
                      className="pl-8 font-black text-lg rounded-xl border-2 border-amber-200"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{errors.price}</p>
                  )}

                  {selectedCrop !== "Other" && CROP_PRESETS[selectedCrop] && (
                    <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-200">
                      💡 Sonipat & Azadpur Mandi Average: <strong>₹{CROP_PRESETS[selectedCrop].minPrice} – ₹{CROP_PRESETS[selectedCrop].maxPrice} / kg</strong>
                    </p>
                  )}
                </div>

                {/* 6. Estimated Gross Payout Card */}
                <div className="bg-amber-50 dark:bg-zinc-800/80 border-2 border-amber-300 dark:border-zinc-700 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-lg">
                      ₹
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">
                        Estimated Gross Revenue (अनुमानित कुल कमाई)
                      </span>
                      <span className="text-2xl font-black text-[#0b3b20] dark:text-amber-300 font-serif">
                        ₹{estimatedEarnings.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    100% Direct Payout
                  </span>
                </div>

                {/* 7. AI Recommendation Panel (If analyzed) */}
                {aiSuggestion && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 rounded-2xl space-y-2 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="font-black text-xs text-emerald-950 dark:text-white uppercase">
                          AI Mandi Price Advisory
                        </span>
                      </div>
                      <Badge className="bg-emerald-800 text-amber-300 font-black text-[10px]">
                        ADVISORY: {aiSuggestion.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                      {aiSuggestion.message}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-xs font-bold">
                      <span>Suggested Rate: ₹{aiSuggestion.suggestedPrice}/kg</span>
                      <button
                        type="button"
                        onClick={applyAiPrice}
                        className="text-amber-700 underline font-black cursor-pointer"
                      >
                        Apply this price
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit & Quick Publish Actions */}
                <div className="space-y-2 pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-black py-4 rounded-xl shadow-md text-sm cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    <span>{loading ? "Checking Mandi AI Rates..." : "⚡ Run AI Mandi Price Check"}</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handlePublish}
                    variant="outline"
                    className="w-full font-bold border-amber-300 text-emerald-950 dark:text-white rounded-xl py-3 text-xs"
                  >
                    Skip AI Advisory & Publish Directly (तुरंत प्रकाशित करें)
                  </Button>
                </div>

              </form>
            )}
          </CardContent>
        </Card>
      </main>

      {/* 8. UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
