"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  mockApi,
  mockCommodities,
  MultiSellerCrop,
  SellerListing,
  getGradeFromRating,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Phone,
  Truck,
  Store,
  Grid,
  ArrowRight,
  Leaf,
  Scale,
  Star,
  Layers,
  Percent,
  CheckCircle,
  Coins,
  SlidersHorizontal,
  Package,
} from "lucide-react";

export default function MarketplacePage() {
  const [commodities, setCommodities] = useState<MultiSellerCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(30);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [wishlist, setWishlist] = useState<string[]>(["farm_tom_01", "farm_mg_01"]);
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [expandedCrops, setExpandedCrops] = useState<Record<string, boolean>>({
    crop_tomato: true,
    crop_onion: true,
  });

  // Location selector modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocationName, setSelectedLocationName] =
    useState("Delhi NCR Mandi Corridor");

  // Purchase Modal State (Dual-Mode: Retail & Bulk)
  const [selectedSeller, setSelectedSeller] = useState<{
    seller: SellerListing;
    commodity: MultiSellerCrop;
  } | null>(null);
  const [purchaseMode, setPurchaseMode] = useState<"retail" | "bulk">("retail");
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(50);
  const [bulkUnit, setBulkUnit] = useState<"kg" | "Quintal" | "Ton">("Ton");
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [riderInfo, setRiderInfo] = useState<any | null>(null);
  const [isAssigningRider, setIsAssigningRider] = useState(false);

  const categories = [
    { name: "All", hindi: "सभी फसलें" },
    { name: "Vegetables", hindi: "सब्जियां" },
    { name: "Fruits", hindi: "फल" },
    { name: "Grains & Pulses", hindi: "अनाज व दालें" },
    { name: "Spices", hindi: "मसाले" },
    { name: "Organic", hindi: "जैविक" },
  ];

  const popularLocations = [
    { name: "Delhi NCR Mandi Corridor", lat: 28.6139, lng: 77.209 },
    { name: "Sonipat Vegetable Belt (Haryana)", lat: 28.9931, lng: 77.0151 },
    { name: "Lasalgaon Onion Hub (Nashik)", lat: 20.1478, lng: 74.2257 },
    { name: "Samana Grain Hub (Punjab)", lat: 30.1557, lng: 76.1917 },
    { name: "Alwar Organic Cluster (Rajasthan)", lat: 27.553, lng: 76.6346 },
    { name: "All India Sourcing", lat: 28.6139, lng: 77.209 },
  ];

  // Fetch commodities with radius
  useEffect(() => {
    setLoading(true);
    mockApi
      .getNearbyCommodities(28.6139, 77.209, radius)
      .then((data) => {
        setCommodities(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [radius]);

  // Wishlist toggle
  const toggleWishlist = (sellerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(sellerId) ? prev.filter((id) => id !== sellerId) : [...prev, sellerId],
    );
  };

  // Toggle expanded commodity
  const toggleExpand = (cropId: string) => {
    setExpandedCrops((prev) => ({
      ...prev,
      [cropId]: !prev[cropId],
    }));
  };

  // Filter and sort commodities & sellers
  const filteredCommodities = useMemo(() => {
    return commodities
      .map((crop) => {
        // Filter sellers inside this crop
        const matchingSellers = crop.sellers.filter((seller) => {
          // Search query check
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesCrop =
              crop.cropName.toLowerCase().includes(q) ||
              crop.hindiName.toLowerCase().includes(q) ||
              crop.category.toLowerCase().includes(q);
            const matchesFarmer =
              seller.farmerName.toLowerCase().includes(q) ||
              seller.location.toLowerCase().includes(q) ||
              seller.variety.toLowerCase().includes(q);
            if (!matchesCrop && !matchesFarmer) return false;
          }

          // Category filter
          if (selectedCategory !== "All") {
            if (selectedCategory === "Organic" && crop.category !== "Organic") return false;
            if (selectedCategory !== "Organic" && crop.category !== selectedCategory) return false;
          }

          // Quality Grade filter
          if (selectedGrade !== "All" && seller.grade !== selectedGrade) {
            return false;
          }

          // Minimum Rating filter
          if (minRating > 0 && seller.rating < minRating) {
            return false;
          }

          // Wishlist filter
          if (onlyWishlist && !wishlist.includes(seller.sellerId)) {
            return false;
          }

          return true;
        });

        return {
          ...crop,
          sellers: matchingSellers,
        };
      })
      .filter((crop) => crop.sellers.length > 0)
      .sort((a, b) => {
        if (sortBy === "sellers_desc") return b.sellers.length - a.sellers.length;
        if (sortBy === "price_asc") {
          const minA = Math.min(...a.sellers.map((s) => s.pricePerKg));
          const minB = Math.min(...b.sellers.map((s) => s.pricePerKg));
          return minA - minB;
        }
        if (sortBy === "price_desc") {
          const maxA = Math.max(...a.sellers.map((s) => s.pricePerKg));
          const maxB = Math.max(...b.sellers.map((s) => s.pricePerKg));
          return maxB - maxA;
        }
        if (sortBy === "rating_desc") {
          const maxRatingA = Math.max(...a.sellers.map((s) => s.rating));
          const maxRatingB = Math.max(...b.sellers.map((s) => s.rating));
          return maxRatingB - maxRatingA;
        }
        return 0;
      });
  }, [
    commodities,
    searchQuery,
    selectedCategory,
    selectedGrade,
    minRating,
    onlyWishlist,
    wishlist,
    sortBy,
  ]);

  // Open buy modal (Retail Mode)
  const handleOpenRetailBuy = (seller: SellerListing, commodity: MultiSellerCrop, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedSeller({ seller, commodity });
    setPurchaseMode("retail");
    setPurchaseQuantity(25);
    setOrderSuccess(null);
    setRiderInfo(null);
  };

  // Open buy modal (Bulk Mode)
  const handleOpenBulkBuy = (seller: SellerListing, commodity: MultiSellerCrop, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedSeller({ seller, commodity });
    setPurchaseMode("bulk");
    setBulkUnit("Ton");
    setPurchaseQuantity(1000); // 1 Ton in kg
    setOrderSuccess(null);
    setRiderInfo(null);
  };

  // Calculate pricing in modal
  const effectiveQuantityKg = purchaseQuantity;
  const rawPrice = selectedSeller ? effectiveQuantityKg * selectedSeller.seller.pricePerKg : 0;
  const isBulkDiscountApplied =
    purchaseMode === "bulk" &&
    effectiveQuantityKg >= 500 &&
    (selectedSeller?.seller.bulkDiscountPercent || 0) > 0;
  const discountAmount = isBulkDiscountApplied
    ? Math.round(rawPrice * ((selectedSeller?.seller.bulkDiscountPercent || 0) / 100))
    : 0;
  const finalPayable = rawPrice - discountAmount;

  // Confirm order execution
  const handleConfirmOrder = async () => {
    if (!selectedSeller) return;
    setIsOrdering(true);
    setTimeout(() => {
      setOrderSuccess({
        orderId: "AGRI-" + Math.floor(100000 + Math.random() * 900000),
        seller: selectedSeller.seller,
        commodity: selectedSeller.commodity,
        quantityKg: effectiveQuantityKg,
        mode: purchaseMode,
        rawPrice,
        discountAmount,
        totalAmount: finalPayable,
      });
      setIsOrdering(false);
    }, 650);
  };

  // Assign logistics rider
  const handleAssignRider = async () => {
    if (!orderSuccess) return;
    setIsAssigningRider(true);
    const rider: any = await mockApi.assignRider(orderSuccess.orderId);
    setRiderInfo(rider);
    setIsAssigningRider(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] dark:bg-zinc-950 text-emerald-950 dark:text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      
      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. SUB-HEADER SEARCH & CONTROLS STRIP */}
      <div className="bg-white dark:bg-zinc-900 border-b border-amber-200/80 dark:border-zinc-800 shadow-xs sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-6">
          
          {/* Location Selector Pill */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="flex items-center gap-2 px-3.5 py-2 border-2 border-[#0b3b20] dark:border-zinc-700 rounded-xl bg-amber-50/50 dark:bg-zinc-800 hover:bg-amber-100/50 transition cursor-pointer text-xs font-bold text-emerald-950 dark:text-emerald-300 max-w-[230px] truncate"
            >
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{selectedLocationName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-800 shrink-0 ml-auto" />
            </button>

            {/* Location Dropdown Modal */}
            {showLocationModal && (
              <div className="absolute top-12 left-0 w-80 bg-white dark:bg-zinc-900 border-2 border-emerald-800 dark:border-zinc-700 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-extrabold text-xs uppercase text-emerald-950 dark:text-white">
                    Select Mandi Cluster
                  </span>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-emerald-900 dark:text-gray-300 mb-1">
                      <span>Pickup Radius</span>
                      <span className="text-amber-600 font-extrabold">{radius} km</span>
                    </div>
                    <Slider
                      min={5}
                      max={100}
                      step={5}
                      value={[radius]}
                      onValueChange={(val: any) =>
                        setRadius(Array.isArray(val) ? val[0] : Number(val))
                      }
                    />
                  </div>

                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-2">
                    <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 block mb-1.5">
                      Regional Agriculture Hubs
                    </span>
                    <div className="space-y-1">
                      {popularLocations.map((loc) => (
                        <button
                          key={loc.name}
                          onClick={() => {
                            setSelectedLocationName(loc.name);
                            setShowLocationModal(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                            selectedLocationName === loc.name
                              ? "bg-amber-100 dark:bg-zinc-800 text-emerald-950 dark:text-amber-300 font-black border border-amber-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-zinc-800/60"
                          }`}
                        >
                          <span>{loc.name}</span>
                          {selectedLocationName === loc.name && (
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Search Input */}
          <div className="flex-1 relative flex items-center">
            <div className="w-full relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search crop or farmer: "Tomato, Rameshwar Patel, MP Wheat, Lasalgaon..."'
                className="w-full pl-4 pr-12 py-2.5 border-2 border-emerald-900/40 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/20 dark:bg-zinc-800 text-sm placeholder-emerald-900/40 dark:placeholder-zinc-500 shadow-inner font-medium transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                className="absolute right-1 top-1 bottom-1 px-4 bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 rounded-lg flex items-center justify-center transition cursor-pointer font-bold shadow-xs"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Wishlist and Action Shortcuts */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setOnlyWishlist(!onlyWishlist)}
              className={`p-2 rounded-xl relative transition flex items-center justify-center cursor-pointer ${
                onlyWishlist
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "hover:bg-amber-100/50 text-emerald-900 dark:text-gray-300 border border-transparent"
              }`}
              title="Saved Sellers"
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlist.length > 0 ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>

            <Link
              href="/buyer/bulk-order"
              className="hidden lg:flex items-center gap-1.5 text-xs font-extrabold text-emerald-950 dark:text-emerald-300 bg-amber-100 hover:bg-amber-200 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-amber-300 transition"
            >
              <Package className="w-4 h-4 text-amber-700" />
              <span>Bulk 1,000kg+ Sourcing</span>
            </Link>
          </div>

        </div>

        {/* 3. CATEGORY SUB-HEADER BAR */}
        <div className="bg-[#f5f2e9] dark:bg-zinc-900/80 border-t border-amber-200/60 dark:border-zinc-800 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-2">
            
            {/* Category Chips */}
            <div className="flex items-center gap-1.5 md:gap-2 flex-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setOnlyWishlist(false);
                    }}
                    className={`px-3.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#0b3b20] text-amber-300 shadow-xs"
                        : "text-emerald-900 dark:text-gray-300 hover:bg-amber-200/50 dark:hover:bg-zinc-800 bg-white/70 dark:bg-zinc-800/50 border border-amber-200/50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75 font-normal">({cat.hindi})</span>
                  </button>
                );
              })}
            </div>

            {/* Quality Grade Info Ribbon */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-emerald-900 dark:text-emerald-400 shrink-0">
              <span className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300">
                ⭐ Grade A: 4.5+ Rating
              </span>
              <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-300">
                ⭐ Grade B: 3.5 – 4.4
              </span>
              <span className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-300">
                ⚙️ Grade C: Processing (&lt;3.5)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. MAIN MULTI-SELLER COMMODITY FEED */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        
        {/* Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border-2 border-amber-200/80 dark:border-zinc-800 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300 mb-1">
              <Layers className="w-3 h-3 text-amber-700" />
              <span>Multi-Seller Commodity Grouping</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-emerald-950 dark:text-white font-serif tracking-tight">
              Direct Produce Marketplace
            </h1>
            <p className="text-xs text-emerald-800/80 dark:text-gray-400 mt-0.5 font-medium">
              Browse crops and compare multiple verified Indian farmers offering that produce within{" "}
              <span className="font-black text-emerald-950 dark:text-white">{radius} km</span>.
            </p>
          </div>

          {/* Filter Bar Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Grade Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase hidden sm:inline">Grade:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-[#faf8f2] dark:bg-zinc-800 border-2 border-amber-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-950 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="All">All Grades (सभी ग्रेड)</option>
                <option value="Grade A">Grade A (High Rating 4.5+)</option>
                <option value="Grade B">Grade B (Medium Rating 3.5-4.4)</option>
                <option value="Grade C">Grade C (Processing &lt;3.5)</option>
              </select>
            </div>

            {/* Seller Rating Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase hidden sm:inline">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-[#faf8f2] dark:bg-zinc-800 border-2 border-amber-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-950 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>⭐ 4.5+ Stars (High Grade)</option>
                <option value={4.0}>⭐ 4.0+ Stars</option>
                <option value={3.5}>⭐ 3.5+ Stars</option>
              </select>
            </div>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#faf8f2] dark:bg-zinc-800 border-2 border-amber-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-950 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="sellers_desc">Sort: Most Farmers Selling</option>
              <option value="rating_desc">Sort: Highest Rated Farmers</option>
              <option value="price_asc">Price: Lowest Rate First</option>
              <option value="price_desc">Price: Highest Rate First</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-zinc-900 border-2 border-amber-200 dark:border-zinc-800 rounded-3xl p-6 animate-pulse space-y-4"
              >
                <div className="h-6 bg-amber-100 dark:bg-zinc-800 rounded w-1/4" />
                <div className="h-24 bg-amber-50 dark:bg-zinc-800/60 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredCommodities.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 p-12 text-center max-w-lg mx-auto shadow-sm my-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl mx-auto">
              🌾
            </div>
            <h3 className="text-lg font-black text-emerald-950 dark:text-white font-serif">
              No sellers matched your filter criteria
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Try changing your quality grade filter, minimum seller rating, or increasing your search radius.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRadius(100);
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedGrade("All");
                  setMinRating(0);
                  setOnlyWishlist(false);
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        ) : (
          /* 5. MULTI-SELLER COMMODITY GROUPS */
          <div className="space-y-8">
            {filteredCommodities.map((crop) => {
              const isExpanded = expandedCrops[crop.cropId] ?? true;
              const minPrice = Math.min(...crop.sellers.map((s) => s.pricePerKg));
              const maxPrice = Math.max(...crop.sellers.map((s) => s.pricePerKg));
              const totalVolume = crop.sellers.reduce((sum, s) => sum + s.availableStockKg, 0);

              return (
                <div
                  key={crop.cropId}
                  className="bg-white dark:bg-zinc-900 border-2 border-amber-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-md transition hover:border-amber-400"
                >
                  {/* Commodity Header Banner */}
                  <div className="bg-gradient-to-r from-[#0b3b20] via-[#0e4828] to-[#072a16] text-white p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Thumbnail & Commodity Title */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md">
                          <img
                            src={crop.image}
                            alt={crop.cropName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                              {crop.category}
                            </span>
                            <span className="text-xs text-amber-300 font-bold">
                              Mandi Benchmark: ₹{crop.mandiBenchmarkPrice}/kg
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2 mt-1">
                            <h2 className="text-2xl font-black text-white font-serif tracking-tight">
                              {crop.cropName}
                            </h2>
                            <span className="text-sm font-semibold text-emerald-200">
                              ({crop.hindiName})
                            </span>
                          </div>

                          <p className="text-xs text-emerald-100/80 line-clamp-1 max-w-xl mt-0.5">
                            {crop.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Commodity Sourcing Aggregate Badges & Expand Toggle */}
                      <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap justify-between lg:justify-end">
                        
                        <div className="bg-[#052112]/90 border border-emerald-700/80 px-4 py-2 rounded-xl text-center">
                          <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                            Farmer Rate Range
                          </span>
                          <span className="text-base font-black text-amber-300 font-serif">
                            ₹{minPrice} – ₹{maxPrice} <span className="text-[10px] text-emerald-200">/ kg</span>
                          </span>
                        </div>

                        <div className="bg-[#052112]/90 border border-emerald-700/80 px-4 py-2 rounded-xl text-center">
                          <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                            Pooled District Stock
                          </span>
                          <span className="text-base font-black text-white font-serif">
                            {totalVolume.toLocaleString("en-IN")} kg
                          </span>
                        </div>

                        <button
                          onClick={() => toggleExpand(crop.cropId)}
                          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                        >
                          <span>{crop.sellers.length} Farmers Selling</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                      </div>

                    </div>
                  </div>

                  {/* Sellers List Accordion (Active when expanded) */}
                  {isExpanded && (
                    <div className="p-6 space-y-4 bg-[#faf8f2] dark:bg-zinc-950">
                      
                      <div className="flex items-center justify-between text-xs font-black text-emerald-950 dark:text-zinc-200 uppercase tracking-wider px-1">
                        <span>Verified Farmers Offering {crop.cropName} ({crop.sellers.length} available)</span>
                        <span className="text-gray-500 font-medium">Sorted by rating & proximity</span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {crop.sellers.map((seller) => {
                          const isWishlisted = wishlist.includes(seller.sellerId);
                          const isGradeA = seller.grade === "Grade A";
                          const isGradeB = seller.grade === "Grade B";
                          const isGradeC = seller.grade === "Grade C";

                          return (
                            <div
                              key={seller.sellerId}
                              className="bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                              
                              {/* Farmer Profile & Quality Grade */}
                              <div className="flex items-start gap-4 flex-1">
                                
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                  <img
                                    src={seller.avatarUrl}
                                    alt={seller.farmerName}
                                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                                  />
                                  <div className="absolute -bottom-1 -right-1 bg-emerald-700 text-white rounded-full p-0.5 shadow">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                  </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-1 flex-1">
                                  
                                  {/* Top Name & Grade Row */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-base font-black text-emerald-950 dark:text-white">
                                      {seller.farmerName}
                                    </h3>

                                    {/* Grade Badge Linked Directly to Rating */}
                                    <span
                                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-xs flex items-center gap-1 ${
                                        isGradeA
                                          ? "bg-amber-100 text-amber-950 border-amber-300"
                                          : isGradeB
                                          ? "bg-emerald-100 text-emerald-950 border-emerald-300"
                                          : "bg-gray-100 text-gray-800 border-gray-300"
                                      }`}
                                    >
                                      <span>{seller.grade}</span>
                                      {isGradeA && <span>★ (Export Quality)</span>}
                                      {isGradeB && <span>• (Standard Mandi)</span>}
                                      {isGradeC && <span>⚙️ (Processing)</span>}
                                    </span>

                                    {/* Wishlist toggle */}
                                    <button
                                      onClick={(e) => toggleWishlist(seller.sellerId, e)}
                                      className="p-1 text-gray-400 hover:text-red-500 cursor-pointer ml-auto"
                                      title="Save Farmer"
                                    >
                                      <Heart
                                        className={`w-4 h-4 ${
                                          isWishlisted ? "fill-red-500 text-red-500" : ""
                                        }`}
                                      />
                                    </button>
                                  </div>

                                  {/* Location, Distance & Sales */}
                                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 flex-wrap font-medium">
                                    <span className="flex items-center gap-1 text-emerald-900 dark:text-emerald-300 font-bold">
                                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                      {seller.location}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-amber-800 dark:text-amber-400 font-bold">
                                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                      {seller.rating} / 5.0
                                    </span>
                                    <span>•</span>
                                    <span className="text-gray-500">{seller.totalSales}</span>
                                  </div>

                                  {/* Variety & Harvest metadata */}
                                  <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500 flex-wrap">
                                    <span className="bg-amber-50 dark:bg-zinc-800 text-emerald-950 dark:text-zinc-300 px-2 py-0.5 rounded border border-amber-200/60 font-semibold">
                                      Variety: {seller.variety}
                                    </span>
                                    {seller.harvestBadge && (
                                      <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                                        🌱 {seller.harvestBadge}
                                      </span>
                                    )}
                                    {seller.bulkDiscountPercent && (
                                      <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-black">
                                        ⚡ {seller.bulkDiscountPercent}% Bulk Discount (&gt;500kg)
                                      </span>
                                    )}
                                  </div>

                                </div>

                              </div>

                              {/* Price, Stock & Dual-Mode Action Buttons */}
                              <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-amber-100 dark:border-zinc-800">
                                
                                <div className="text-right w-full sm:w-auto">
                                  <div className="flex items-baseline justify-end gap-1">
                                    <span className="text-2xl font-black text-[#0b3b20] dark:text-amber-300 font-serif">
                                      ₹{seller.pricePerKg}
                                    </span>
                                    <span className="text-xs text-gray-500 font-semibold">/ kg</span>
                                  </div>
                                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block">
                                    Available: {seller.availableStockKg.toLocaleString("en-IN")} kg
                                  </span>
                                </div>

                                {/* Dual-Mode Buttons: Retail (kg) vs Bulk Purchase */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <Button
                                    size="sm"
                                    onClick={(e) => handleOpenRetailBuy(seller, crop, e)}
                                    className="flex-1 sm:flex-none bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-bold text-xs rounded-xl px-4 py-2 cursor-pointer shadow-xs"
                                  >
                                    <span>🛒 Buy (kg)</span>
                                  </Button>

                                  <Button
                                    size="sm"
                                    onClick={(e) => handleOpenBulkBuy(seller, crop, e)}
                                    className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black text-xs rounded-xl px-4 py-2 cursor-pointer shadow-xs border border-amber-300"
                                  >
                                    <span>📦 Buy in Bulk</span>
                                  </Button>
                                </div>

                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 6. INTEGRATED DUAL-MODE PURCHASE MODAL (Retail & Bulk) */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-800 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-5">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-amber-200 pb-3">
              <div>
                <h3 className="font-black text-lg text-emerald-950 dark:text-white font-serif">
                  {orderSuccess
                    ? "🎉 Direct Farm Order Placed!"
                    : purchaseMode === "bulk"
                    ? "📦 Bulk Wholesale Procurement"
                    : "🛒 Direct Retail Purchase"}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedSeller.commodity.cropName} ({selectedSeller.commodity.hindiName}) from{" "}
                  <strong>{selectedSeller.seller.farmerName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedSeller(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!orderSuccess ? (
              <div className="space-y-4">
                
                {/* Mode Switcher Pills */}
                <div className="flex p-1 bg-amber-50 dark:bg-zinc-800 rounded-xl border border-amber-200">
                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMode("retail");
                      setPurchaseQuantity(25);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      purchaseMode === "retail"
                        ? "bg-[#0b3b20] text-amber-300 shadow"
                        : "text-gray-600 hover:text-emerald-900"
                    }`}
                  >
                    🛒 Retail Purchase (kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMode("bulk");
                      setPurchaseQuantity(1000);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      purchaseMode === "bulk"
                        ? "bg-[#0b3b20] text-amber-300 shadow"
                        : "text-gray-600 hover:text-emerald-900"
                    }`}
                  >
                    📦 Bulk Sourcing (Tons / Tier Discount)
                  </button>
                </div>

                {/* Seller Quick Snapshot */}
                <div className="p-3 bg-emerald-50/70 dark:bg-zinc-800 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedSeller.seller.avatarUrl}
                      alt={selectedSeller.seller.farmerName}
                      className="w-10 h-10 rounded-xl object-cover border border-amber-400"
                    />
                    <div>
                      <span className="font-bold text-emerald-950 dark:text-white block">
                        {selectedSeller.seller.farmerName}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {selectedSeller.seller.grade} • ⭐ {selectedSeller.seller.rating} Rating
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-950 dark:text-white">
                      ₹{selectedSeller.seller.pricePerKg}/kg
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      Max: {selectedSeller.seller.availableStockKg} kg
                    </span>
                  </div>
                </div>

                {/* Quantity Input & Presets */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Desired Quantity ({purchaseMode === "bulk" ? "in kg / Ton" : "kg"})</span>
                    <span className="text-amber-800 font-black">
                      {effectiveQuantityKg.toLocaleString("en-IN")} kg
                      {purchaseMode === "bulk" && effectiveQuantityKg >= 1000 && ` (${(effectiveQuantityKg / 1000).toFixed(1)} Tons)`}
                    </span>
                  </div>

                  <Input
                    type="number"
                    min={1}
                    max={selectedSeller.seller.availableStockKg}
                    value={purchaseQuantity}
                    onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                    className="font-black text-base rounded-xl border-2 border-emerald-900/30"
                  />

                  {/* Bulk Quick-Preset Chips */}
                  {purchaseMode === "bulk" && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity(500)}
                        className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-emerald-950 px-2.5 py-1 rounded-lg cursor-pointer border border-amber-300"
                      >
                        500 kg (5% Off)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity(1000)}
                        className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-emerald-950 px-2.5 py-1 rounded-lg cursor-pointer border border-amber-300"
                      >
                        1 Ton (1,000 kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity(2500)}
                        className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-emerald-950 px-2.5 py-1 rounded-lg cursor-pointer border border-amber-300"
                      >
                        2.5 Tons
                      </button>
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity(selectedSeller.seller.availableStockKg)}
                        className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-emerald-950 px-2.5 py-1 rounded-lg cursor-pointer border border-amber-300"
                      >
                        Entire Stock ({selectedSeller.seller.availableStockKg} kg)
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown Card */}
                <div className="p-4 bg-amber-50 dark:bg-zinc-800 rounded-2xl border border-amber-200 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Crop Rate ({effectiveQuantityKg} kg × ₹{selectedSeller.seller.pricePerKg}):</span>
                    <span className="font-bold text-gray-800">₹{rawPrice.toLocaleString("en-IN")}</span>
                  </div>

                  {isBulkDiscountApplied && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" />
                        Bulk Quantity Discount ({selectedSeller.seller.bulkDiscountPercent}%):
                      </span>
                      <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-dashed border-amber-300 pt-2 font-black text-base text-[#0b3b20] dark:text-amber-300">
                    <span>Total Direct Payable:</span>
                    <span>₹{finalPayable.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <Button
                  onClick={handleConfirmOrder}
                  disabled={isOrdering || effectiveQuantityKg <= 0}
                  className="w-full bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 py-3.5 font-black text-sm rounded-xl cursor-pointer shadow-md"
                >
                  {isOrdering ? "Confirming Direct Sourcing..." : "Confirm & Place Direct Farm Order"}
                </Button>

              </div>
            ) : (
              /* Success Board & Rider Assignment */
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between font-bold text-green-900 dark:text-green-300">
                    <span>Order Reference:</span>
                    <span className="font-mono">{orderSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between text-green-800 dark:text-green-400">
                    <span>Produce & Quantity:</span>
                    <span>
                      {orderSuccess.quantityKg.toLocaleString()} kg {orderSuccess.commodity.cropName}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-800 dark:text-green-400 font-black">
                    <span>Final Amount:</span>
                    <span>₹{orderSuccess.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Rider Assignment Box */}
                {!riderInfo ? (
                  <div className="p-4 bg-amber-50 dark:bg-zinc-800 border border-amber-200 rounded-2xl text-center space-y-3">
                    <p className="text-xs text-emerald-950 font-bold">
                      🛵 Need mini-truck or auto pickup from {orderSuccess.seller.location}?
                    </p>
                    <Button
                      onClick={handleAssignRider}
                      disabled={isAssigningRider}
                      className="bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-black text-xs rounded-xl"
                    >
                      {isAssigningRider ? "Matching Nearest Vehicle..." : "⚡ Dispatch Agri Logistics Rider"}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-bold text-sm">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <span>Agri-Logistics Partner Dispatched!</span>
                    </div>
                    <div className="text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                      <p>Driver: <span className="font-bold">{riderInfo.riderName}</span></p>
                      <p>Vehicle: <span className="font-bold">{riderInfo.vehicle}</span></p>
                      <p>Estimated Farm Arrival: <span className="font-bold">{riderInfo.etaMinutes} mins</span></p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href="/rider/deliveries" className="flex-1">
                    <Button variant="outline" className="w-full text-xs font-bold rounded-xl">
                      View Logistics Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setSelectedSeller(null)}
                    className="flex-1 bg-[#0b3b20] text-amber-300 text-xs font-bold rounded-xl"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 7. UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
