"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  HelpCircle,
  Undo2,
} from "lucide-react";

interface CropConfig {
  name: string;
  emoji: string;
  minPrice: number;
  maxPrice: number;
  recommendation: number;
  image: string;
}

const CROP_PRESETS: Record<string, CropConfig> = {
  Tomato: {
    name: "Tomato",
    emoji: "🍅",
    minPrice: 22,
    maxPrice: 28,
    recommendation: 25,
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
  },
  Potato: {
    name: "Potato",
    emoji: "🥔",
    minPrice: 14,
    maxPrice: 18,
    recommendation: 16,
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
  },
  Onion: {
    name: "Onion",
    emoji: "🧅",
    minPrice: 18,
    maxPrice: 24,
    recommendation: 22,
    image:
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
  },
  Wheat: {
    name: "Wheat",
    emoji: "🌾",
    minPrice: 30,
    maxPrice: 36,
    recommendation: 34,
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
  },
  Mango: {
    name: "Mango",
    emoji: "🥭",
    minPrice: 160,
    maxPrice: 200,
    recommendation: 180,
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80",
  },
  Spinach: {
    name: "Spinach",
    emoji: "🥬",
    minPrice: 26,
    maxPrice: 32,
    recommendation: 30,
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
  },
  Carrot: {
    name: "Carrot",
    emoji: "🥕",
    minPrice: 24,
    maxPrice: 30,
    recommendation: 28,
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80",
  },
};

export default function NewCropPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");
  const [customCrop, setCustomCrop] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("500");
  const [unit, setUnit] = useState<"kg" | "Quintal" | "Ton">("kg");
  const [pricePerKg, setPricePerKg] = useState<string>("25");
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
      const recommendation = await mockApi.getAIRecommendation(
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
    setTimeout(() => {
      alert(
        "🎉 Crop Listing published successfully! Buyers can now locate your listing within search radius.",
      );
    }, 200);
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
    const images = [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    ];
    // Random select or match preset
    if (selectedCrop !== "Other" && CROP_PRESETS[selectedCrop]) {
      setImageFile(CROP_PRESETS[selectedCrop].image);
    } else {
      setImageFile(images[Math.floor(Math.random() * images.length)]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Navbar Hub Header */}
      <nav className="bg-[#002f34] text-white border-b border-teal-950/40 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-white hover:opacity-85 transition">
              <Undo2 className="w-5 h-5" />
            </Link>
            <span className="font-extrabold text-base tracking-tight">
              🧑‍🌾 Farmer Produce Console
            </span>
          </div>
          <Link
            href="/buyer/marketplace"
            className="text-xs font-bold text-teal-400 hover:underline"
          >
            View Buyer Feed
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8 w-full flex-1">
        <Card className="shadow-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-4">
            <CardTitle className="text-2xl font-black text-[#002f34] dark:text-zinc-100 flex items-center gap-2">
              🌾 List Your Crop Produce
            </CardTitle>
            <p className="text-xs text-gray-500">
              Provide harvest parameters below. Direct Buyers will search by
              radius and connect instantly.
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {listed ? (
              /* Success Board */
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center text-3xl mx-auto shadow-sm">
                  🎉
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#002f34] dark:text-white">
                    Listing Live & Active!
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
                    Your {selectedCrop === "Other" ? customCrop : selectedCrop}{" "}
                    harvest of {quantity} {unit} has been listed at ₹
                    {pricePerKg}/kg. Buyers in your radius are being notified.
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <Button
                    onClick={() => {
                      setListed(false);
                      setAiSuggestion(null);
                    }}
                    variant="outline"
                  >
                    List another produce
                  </Button>
                  <Link href="/buyer/marketplace">
                    <Button className="bg-[#002f34] dark:bg-teal-600">
                      Go to Marketplace View
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAnalyze} className="space-y-6">
                {/* 1. Visual Crop Preset Grid */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-gray-800 dark:text-zinc-200 block">
                    1. Select Crop Produce
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {Object.entries(CROP_PRESETS).map(([key, config]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedCrop(key)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 text-center transition cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                          selectedCrop === key
                            ? "border-teal-600 bg-teal-50/50 dark:border-teal-500 dark:bg-teal-950/20 font-bold"
                            : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        }`}
                      >
                        <span className="text-2xl mb-1">{config.emoji}</span>
                        <span className="text-[10px] tracking-tight">
                          {config.name}
                        </span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSelectedCrop("Other")}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 text-center transition cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                        selectedCrop === "Other"
                          ? "border-teal-600 bg-teal-50/50 dark:border-teal-500 dark:bg-teal-950/20 font-bold"
                          : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                      }`}
                    >
                      <span className="text-2xl mb-1">➕</span>
                      <span className="text-[10px] tracking-tight">Other</span>
                    </button>
                  </div>

                  {selectedCrop === "Other" && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-150">
                      <Input
                        type="text"
                        value={customCrop}
                        onChange={(e) => setCustomCrop(e.target.value)}
                        placeholder="Type crop name (e.g. Garlic, Cauliflower)"
                        className="w-full text-sm font-semibold"
                      />
                      {errors.name && (
                        <span className="text-xs text-red-500 mt-1 block flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Photo Upload Box */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-gray-800 dark:text-zinc-200 block">
                    2. Add Crop Photos
                  </label>
                  <div
                    onClick={triggerMockUpload}
                    className="border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-lg p-5 text-center hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition cursor-pointer relative overflow-hidden h-36 flex flex-col items-center justify-center"
                  >
                    {imageFile ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img
                          src={imageFile}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-xs font-bold gap-1.5 opacity-0 hover:opacity-100 transition-opacity">
                          <Camera className="w-4 h-4" /> Change Photo
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-gray-500">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-gray-600 dark:text-gray-300">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold">
                          Drag & Drop or Tap to Upload Crop Photos
                        </p>
                        <p className="text-[10px] text-gray-400">
                          High resolution photos attract bulk buyers faster
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Quantity & Unit Flexibility */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-gray-800 dark:text-zinc-200 block">
                    3. Quantity & Pricing Details
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Quantity */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase block">
                        Quantity
                      </span>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 500"
                        className="font-bold text-base"
                      />
                      {errors.quantity && (
                        <span className="text-xs text-red-500 mt-1 block flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{" "}
                          {errors.quantity}
                        </span>
                      )}
                    </div>

                    {/* Unit Toggle */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase block">
                        Unit
                      </span>
                      <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-md border border-gray-200 dark:border-zinc-700 h-10 items-center justify-between">
                        {(["kg", "Quintal", "Ton"] as const).map((u) => (
                          <button
                            type="button"
                            key={u}
                            onClick={() => setUnit(u)}
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

                  {/* Price Input with Contextual Guidance */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">
                      Expected Price (₹ / kg)
                    </span>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-gray-500 font-extrabold">
                        ₹
                      </span>
                      <Input
                        type="number"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        placeholder="e.g. 25"
                        className="pl-7 font-bold text-base w-full"
                      />
                    </div>
                    {errors.price && (
                      <span className="text-xs text-red-500 mt-1 block flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.price}
                      </span>
                    )}

                    {/* Contextual Market Guidance */}
                    {selectedCrop !== "Other" && CROP_PRESETS[selectedCrop] && (
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1.5 bg-gray-50 dark:bg-zinc-800/40 p-2.5 rounded border border-gray-100 dark:border-zinc-800/80">
                        <span className="text-gray-500">
                          📈 Mandi Market range:{" "}
                          <span className="font-bold text-gray-800 dark:text-zinc-200">
                            ₹{CROP_PRESETS[selectedCrop].minPrice} – ₹
                            {CROP_PRESETS[selectedCrop].maxPrice} / kg
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={applyAiPrice}
                          className="text-teal-700 dark:text-teal-400 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" /> Auto-fill Market Rate
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Visual Quality Grade Radio Cards */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-gray-800 dark:text-zinc-200 block">
                    4. Select Quality Grade
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        val: "A",
                        title: "Grade A",
                        desc: "Premium / Export Quality (Uniform size, flawless produce)",
                      },
                      {
                        val: "B",
                        title: "Grade B",
                        desc: "Standard / Local Mandi (Fresh, normal size, minor blemishes)",
                      },
                      {
                        val: "C",
                        title: "Grade C",
                        desc: "Processing / Pulp / Juice (Small size, over-ripe or juice grade)",
                      },
                    ].map((g) => (
                      <div
                        key={g.val}
                        onClick={() => setQuality(g.val as any)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                          quality === g.val
                            ? "border-teal-600 bg-teal-50/50 dark:border-teal-500 dark:bg-teal-950/20"
                            : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{g.title}</span>
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              quality === g.val
                                ? "border-teal-600 bg-teal-600"
                                : "border-gray-300"
                            }`}
                          >
                            {quality === g.val && (
                              <Check className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">
                          {g.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Dynamic Revenue Readout */}
                <div className="p-4 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-lg flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                      🧾 Estimated Gross Earnings
                    </span>
                    <span className="text-2xl font-black text-[#002f34] dark:text-teal-200">
                      ₹{estimatedEarnings.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-gray-500">
                    <p>{quantityInKg.toLocaleString("en-IN")} kg total stock</p>
                    <p>Price: ₹{pricePerKg || 0}/kg</p>
                  </div>
                </div>

                {/* Submitting Options */}
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44] dark:hover:bg-teal-500 text-white py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {loading
                        ? "Analyzing market dynamics..."
                        : "Get AI Market Recommendation"}
                    </span>
                  </Button>

                  {/* Immediate Listing bypass */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePublish}
                    className="w-full text-xs"
                  >
                    Skip AI Recommendation & Publish Directly
                  </Button>
                </div>
              </form>
            )}

            {/* AI Recommendation Output Panel */}
            {aiSuggestion && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-500 dark:border-blue-700 rounded space-y-3 animate-in fade-in slide-in-from-top-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-blue-950 dark:text-blue-200 text-sm">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>🤖 AI Price Recommendation</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200 dark:text-blue-300"
                  >
                    Confidence: {aiSuggestion.confidence}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {aiSuggestion.message}
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-blue-100 dark:border-blue-900/60">
                  <div>
                    <span className="text-gray-500 block">
                      AI Recommended Price:
                    </span>
                    <span className="font-extrabold text-sm text-[#002f34] dark:text-teal-400">
                      ₹{aiSuggestion.suggestedPrice} / kg
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">
                      Suggested Strategy:
                    </span>
                    <span
                      className={`font-extrabold text-sm uppercase ${
                        aiSuggestion.action === "SELL_NOW"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {aiSuggestion.action.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    onClick={applyAiPrice}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Apply Recommended Price
                  </Button>
                  <Button
                    onClick={handlePublish}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    Confirm & Publish
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
