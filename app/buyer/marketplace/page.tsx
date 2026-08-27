"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  mockApi,
  mockListings,
  CropListing,
  mockFarmers,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Heart,
  Plus,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Phone,
  Truck,
  QrCode,
  Store,
  Grid,
  ArrowRight,
  Leaf,
  Scale,
} from "lucide-react";

export default function MarketplacePage() {
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(30);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedQuality, setSelectedQuality] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [wishlist, setWishlist] = useState<string[]>(["c1", "c9"]);
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropListing | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocationName, setSelectedLocationName] =
    useState("Delhi NCR Mandi Corridor");
  const [showAppBanner, setShowAppBanner] = useState(true);

  // Order modal state
  const [orderingCrop, setOrderingCrop] = useState<CropListing | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(100);
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

  // Fetch listings with radius
  useEffect(() => {
    setLoading(true);
    mockApi
      .getNearbyListings(28.6139, 77.209, radius)
      .then((data) => {
        setListings(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [radius]);

  // Wishlist toggle
  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Filtered & Sorted listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((crop) => {
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = crop.name.toLowerCase().includes(query);
          const matchesHindi = crop.hindiName?.toLowerCase().includes(query) || false;
          const matchesCategory = crop.category.toLowerCase().includes(query);
          const matchesVariety =
            crop.variety?.toLowerCase().includes(query) || false;
          const matchesFarmer =
            crop.farmer?.name.toLowerCase().includes(query) || false;
          const matchesLocation =
            crop.farmer?.location.toLowerCase().includes(query) || false;
          if (
            !matchesName &&
            !matchesHindi &&
            !matchesCategory &&
            !matchesVariety &&
            !matchesFarmer &&
            !matchesLocation
          ) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "All") {
          if (selectedCategory === "Organic" && crop.category !== "Organic") {
            return false;
          }
          if (
            selectedCategory !== "Organic" &&
            crop.category !== selectedCategory
          ) {
            return false;
          }
        }

        // Quality filter
        if (selectedQuality !== "All" && crop.quality !== selectedQuality) {
          return false;
        }

        // Wishlist only
        if (onlyWishlist && !wishlist.includes(crop.id)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "featured") {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        }
        if (sortBy === "price_asc") return a.pricePerKg - b.pricePerKg;
        if (sortBy === "price_desc") return b.pricePerKg - a.pricePerKg;
        if (sortBy === "distance")
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        if (sortBy === "quantity_desc") return b.quantityKg - a.quantityKg;
        return 0;
      });
  }, [
    listings,
    searchQuery,
    selectedCategory,
    selectedQuality,
    onlyWishlist,
    wishlist,
    sortBy,
  ]);

  // Handle instant buy order
  const handleStartOrder = (crop: CropListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOrderingCrop(crop);
    setOrderQuantity(Math.min(100, crop.quantityKg));
    setOrderSuccess(null);
    setRiderInfo(null);
  };

  const handleConfirmOrder = async () => {
    if (!orderingCrop) return;
    setIsOrdering(true);
    // Simulate order placement
    setTimeout(() => {
      setOrderSuccess({
        orderId: "KRISHI-" + Math.floor(100000 + Math.random() * 900000),
        crop: orderingCrop,
        quantity: orderQuantity,
        totalAmount: orderQuantity * orderingCrop.pricePerKg,
      });
      setIsOrdering(false);
    }, 600);
  };

  const handleAssignRider = async () => {
    if (!orderSuccess) return;
    setIsAssigningRider(true);
    const rider = await mockApi.assignRider(orderSuccess.orderId);
    setRiderInfo(rider);
    setIsAssigningRider(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] dark:bg-zinc-950 text-emerald-950 dark:text-zinc-100 flex flex-col font-sans">
      
      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. SUB-HEADER SEARCH & LOCATION STRIP */}
      <div className="bg-white dark:bg-zinc-900 border-b border-amber-200/80 dark:border-zinc-800 shadow-xs sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-6">
          
          {/* Location Selector Pill */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="flex items-center gap-2 px-3.5 py-2 border-2 border-[#0b3b20] dark:border-zinc-700 rounded-xl bg-amber-50/50 dark:bg-zinc-800 hover:bg-amber-100/50 transition cursor-pointer text-xs font-bold text-emerald-950 dark:text-emerald-300 max-w-[220px] truncate"
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
                      <span>Search Radius</span>
                      <span className="text-amber-600 font-extrabold">
                        {radius} km
                      </span>
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

          {/* Main Search Bar */}
          <div className="flex-1 relative flex items-center">
            <div className="w-full relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search farm produce: "Tomatoes, Nashik Onions, Sharbati Wheat, Palak..."'
                className="w-full pl-4 pr-12 py-2.5 border-2 border-emerald-900/40 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/20 dark:bg-zinc-800 text-sm placeholder-emerald-900/40 dark:placeholder-zinc-500 shadow-inner transition font-medium"
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
                onClick={() => {}}
                className="absolute right-1 top-1 bottom-1 px-4 bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 rounded-lg flex items-center justify-center transition cursor-pointer font-bold shadow-xs"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Header Navigation Icons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => setOnlyWishlist(!onlyWishlist)}
              className={`p-2 rounded-xl relative transition flex items-center justify-center cursor-pointer ${
                onlyWishlist
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "hover:bg-amber-100/50 text-emerald-900 dark:text-gray-300 border border-transparent"
              }`}
              title="Saved Wishlist"
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

            {/* Bulk Order shortcut */}
            <Link
              href="/buyer/bulk-order"
              className="hidden lg:flex items-center gap-1.5 text-xs font-extrabold text-emerald-950 dark:text-emerald-300 bg-amber-100 hover:bg-amber-200 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-amber-300 transition"
            >
              <Store className="w-4 h-4 text-amber-700" />
              <span>Bulk 1,000kg+</span>
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

            {/* Direct Delivery Badge */}
            <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-emerald-900 dark:text-emerald-400 shrink-0">
              <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-300">
                <Truck className="w-3.5 h-3.5 text-emerald-700" /> Doorstep Mandi Dispatch
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN BODY PRODUCE FEED */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        
        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-emerald-950 dark:text-zinc-100 font-serif tracking-tight flex items-center gap-2">
              🌾 Mandi Fresh Produce
              <Badge
                variant="outline"
                className="text-xs font-bold bg-amber-100 text-emerald-950 border-amber-300"
              >
                {filteredListings.length} crops in radius
              </Badge>
            </h1>
            <p className="text-xs text-emerald-800/80 dark:text-gray-400 mt-0.5 font-medium">
              Direct from verified regional farmers within{" "}
              <span className="font-extrabold text-emerald-950 dark:text-white">
                {radius} km
              </span>{" "}
              delivery distance
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Radius Quick Selector */}
            <div className="flex items-center bg-white dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 rounded-xl p-1 text-xs shadow-xs">
              <span className="text-emerald-900 dark:text-zinc-400 font-bold px-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Radius:
              </span>
              {[15, 30, 50, 100].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-2.5 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                    radius === r
                      ? "bg-[#0b3b20] text-amber-300 shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>

            {/* Quality Filter */}
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
            >
              <option value="All">All Grades (सभी ग्रेड)</option>
              <option value="A">Grade A (Export / Premium)</option>
              <option value="B">Grade B (Standard Mandi)</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="distance">Sort: Nearest Farm First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="quantity_desc">Quantity: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 rounded-2xl overflow-hidden animate-pulse flex flex-col h-[340px]"
              >
                <div className="h-44 bg-amber-100 dark:bg-zinc-800" />
                <div className="p-4 space-y-2 flex-1">
                  <div className="h-5 bg-amber-100 dark:bg-zinc-800 rounded w-1/2" />
                  <div className="h-4 bg-amber-100 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-amber-100 dark:bg-zinc-800 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-amber-200 dark:border-zinc-800 p-12 text-center max-w-lg mx-auto shadow-sm my-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl mx-auto">
              🌾
            </div>
            <h3 className="text-lg font-black text-emerald-950 dark:text-white">
              No farm crops matched your criteria
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Try increasing your search radius to 50 km or clearing specific category/quality filters.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRadius(100);
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedQuality("All");
                  setOnlyWishlist(false);
                }}
              >
                Reset all filters
              </Button>
              <Link href="/farmer/crops/new">
                <Button
                  size="sm"
                  className="bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-bold"
                >
                  Post a Crop Listing
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* 5. PRODUCT CARDS GRID (Rich Farmer Aesthetics) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((crop, index) => {
              const isWishlisted = wishlist.includes(crop.id);

              return (
                <div key={crop.id} className="contents">
                  {/* CROP CARD */}
                  <div
                    onClick={() => setSelectedCrop(crop)}
                    className="bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group relative"
                  >
                    {/* Top Image Box */}
                    <div className="relative aspect-[4/3] bg-emerald-950 overflow-hidden">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* FEATURED Yellow Badge */}
                      {crop.featured && (
                        <div className="absolute top-2.5 left-2.5 bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <span>★ TAUGHT BATCH</span>
                        </div>
                      )}

                      {/* Grade Pill */}
                      <div className="absolute bottom-2.5 left-2.5 bg-[#052112]/90 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-amber-400/30">
                        <span>Grade {crop.quality}</span>
                        {crop.category === "Organic" && <span>🌿 Organic</span>}
                      </div>

                      {/* Heart Favorite Button */}
                      <button
                        onClick={(e) => toggleWishlist(crop.id, e)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/95 dark:bg-zinc-900/90 shadow hover:bg-white text-gray-700 dark:text-gray-300 hover:scale-110 active:scale-90 transition cursor-pointer"
                        title={
                          isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        {/* Price & Stock */}
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-xl font-black text-emerald-950 dark:text-white tracking-tight">
                            ₹{crop.pricePerKg.toLocaleString("en-IN")}
                            <span className="text-xs font-normal text-gray-500 ml-1">
                              / kg
                            </span>
                          </h3>
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200">
                            {crop.quantityKg.toLocaleString("en-IN")} kg
                          </span>
                        </div>

                        {/* Title & Hindi Subtitle */}
                        <h4 className="font-extrabold text-sm text-emerald-950 dark:text-zinc-100 line-clamp-1 mt-1">
                          {crop.name}
                        </h4>
                        {crop.hindiName && (
                          <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                            {crop.hindiName}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                          {crop.variety}
                        </p>
                      </div>

                      {/* Footer: Location & Distance */}
                      <div className="pt-2.5 border-t border-amber-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-emerald-900/80 dark:text-gray-400 font-medium">
                        <span className="truncate max-w-[65%] flex items-center gap-1 font-semibold">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          {crop.farmer.location}
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                          {crop.distanceKm} km
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PROMOTIONAL KISAAN DIRECT SELLING CARD */}
                  {index === 3 && (
                    <div className="bg-gradient-to-br from-[#0b3b20] to-[#052112] text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg border-2 border-amber-400 relative overflow-hidden">
                      <div className="space-y-2 relative z-10">
                        <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          🧑‍🌾 Are you a Farmer?
                        </span>
                        <h4 className="text-lg font-black leading-tight text-white font-serif">
                          Sell Your Harvest Directly
                        </h4>
                        <p className="text-xs text-emerald-100/80 leading-relaxed">
                          Get real-time AI Mandi rate guidance, sell without broker commissions, and get fast pickup dispatch.
                        </p>
                      </div>

                      <div className="mt-6 relative z-10">
                        <Link
                          href="/farmer/crops/new"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-xs py-5 rounded-xl cursor-pointer">
                            <span>List Your Crop (फसल जोड़ें)</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. CROP DETAIL MODAL */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-800 dark:border-zinc-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-amber-200/80 dark:border-zinc-800 flex justify-between items-center bg-amber-50/50 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-md">
                  {selectedCrop.category}
                </span>
                <span className="text-xs text-emerald-900 font-bold">
                  Posted {selectedCrop.postedDate}
                </span>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-zinc-700 text-emerald-950 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Image & Tags */}
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-emerald-950 border border-emerald-800">
                    <img
                      src={selectedCrop.image}
                      alt={selectedCrop.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedCrop.featured && (
                      <span className="absolute top-3 left-3 bg-amber-400 text-emerald-950 font-black text-xs px-2.5 py-1 rounded shadow">
                        ★ TAUGHT BATCH
                      </span>
                    )}
                  </div>

                  {/* AI Price Insight Card */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-emerald-950 dark:text-emerald-300">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>DoCA Mandi Rate Assessment</span>
                    </div>
                    <p className="text-emerald-900 dark:text-emerald-200">
                      Direct Farm price of ₹{selectedCrop.pricePerKg}/kg is <strong>₹{selectedCrop.mandiPrice ? selectedCrop.mandiPrice - selectedCrop.pricePerKg : 4}/kg lower</strong> than local retail APMC Mandi benchmarks.
                    </p>
                  </div>
                </div>

                {/* Right: Info & Pricing */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-emerald-950 dark:text-white font-serif">
                      {selectedCrop.name}
                    </h2>
                    {selectedCrop.hindiName && (
                      <p className="text-sm font-bold text-amber-700">
                        {selectedCrop.hindiName}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                      Variety: {selectedCrop.variety}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="p-4 bg-amber-50 dark:bg-zinc-800 rounded-2xl border border-amber-200 dark:border-zinc-700 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase block font-bold">
                        Direct Farm Rate
                      </span>
                      <span className="text-3xl font-black text-emerald-950 dark:text-amber-300 font-serif">
                        ₹{selectedCrop.pricePerKg}
                        <span className="text-xs font-normal text-gray-600"> / kg</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-800 uppercase block font-bold">
                        Available Stock
                      </span>
                      <span className="text-lg font-black text-emerald-900 dark:text-emerald-300">
                        {selectedCrop.quantityKg.toLocaleString("en-IN")} kg
                      </span>
                    </div>
                  </div>

                  {/* Specs Table */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-amber-100 dark:border-zinc-800 py-3">
                    <div>
                      <span className="text-gray-400 block font-medium">Quality Grade</span>
                      <span className="font-extrabold text-emerald-950 dark:text-white">
                        Grade {selectedCrop.quality} (Inspected)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Distance</span>
                      <span className="font-extrabold text-emerald-950 dark:text-white">
                        {selectedCrop.distanceKm} km from you
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Harvest Batch</span>
                      <span className="font-extrabold text-emerald-950 dark:text-white">
                        {selectedCrop.harvestDate || "Morning Harvest"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Farm Origin</span>
                      <span className="font-extrabold text-emerald-950 dark:text-white">
                        {selectedCrop.farmer.location}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-xs font-bold text-emerald-950 dark:text-white block mb-1">
                      Kisaan Notes & Harvest Details:
                    </span>
                    <p className="text-xs text-emerald-900/80 dark:text-zinc-300 leading-relaxed bg-[#faf8f2] dark:bg-zinc-800/60 p-3 rounded-xl border border-amber-200/60">
                      {selectedCrop.description}
                    </p>
                  </div>

                  {/* Farmer Profile Card */}
                  <div className="p-3 bg-emerald-50 dark:bg-zinc-800 rounded-xl border border-emerald-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#0b3b20] text-amber-300 font-black flex items-center justify-center text-sm">
                        {selectedCrop.farmer.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-emerald-950 dark:text-white">
                            {selectedCrop.farmer.name}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                        </div>
                        <span className="text-[11px] text-gray-500">
                          ⭐ {selectedCrop.farmer.rating} · Verified Farmer
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert(
                          `Calling Farmer ${selectedCrop.farmer.name} at ${selectedCrop.farmer.phone}`,
                        )
                      }
                      className="text-xs flex items-center gap-1 border-emerald-800 text-emerald-900 font-bold hover:bg-emerald-100"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Contact</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-amber-200/80 dark:border-zinc-800 bg-[#faf8f2] dark:bg-zinc-900 flex justify-between items-center gap-3">
              <button
                onClick={(e) => toggleWishlist(selectedCrop.id, e)}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlist.includes(selectedCrop.id)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
                <span>{wishlist.includes(selectedCrop.id) ? "Saved" : "Save"}</span>
              </button>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setSelectedCrop(null)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    const crop = selectedCrop;
                    setSelectedCrop(null);
                    handleStartOrder(crop);
                  }}
                  className="bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-black px-6 flex items-center gap-1.5 rounded-xl cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Buy Now / Order Delivery</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ORDER PLACEMENT & RIDER ASSIGNMENT MODAL */}
      {orderingCrop && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-800 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-5">
            <div className="flex justify-between items-center border-b border-amber-200 pb-3">
              <div>
                <h3 className="font-black text-lg text-emerald-950 dark:text-white font-serif">
                  {orderSuccess
                    ? "🎉 Order Confirmed!"
                    : "🛒 Place Farm Direct Order"}
                </h3>
                <p className="text-xs text-gray-500">
                  {orderingCrop.name} from {orderingCrop.farmer.name}
                </p>
              </div>
              <button
                onClick={() => setOrderingCrop(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!orderSuccess ? (
              /* Order Form */
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-zinc-800 rounded-xl flex items-center justify-between text-sm border border-amber-200">
                  <span className="text-gray-600 font-medium">Unit Price:</span>
                  <span className="font-black text-emerald-950 dark:text-white">
                    ₹{orderingCrop.pricePerKg} / kg
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Order Quantity (kg)</span>
                    <span className="text-amber-700 font-black">
                      {orderQuantity} kg
                    </span>
                  </div>
                  <input
                    type="number"
                    min={10}
                    max={orderingCrop.quantityKg}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full p-2.5 border-2 border-emerald-900/30 rounded-xl bg-white dark:bg-zinc-800 text-sm font-bold"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    Max available stock: {orderingCrop.quantityKg} kg
                  </span>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-xs text-emerald-900 font-medium block">
                      Total Payable Amount
                    </span>
                    <span className="text-2xl font-black text-[#0b3b20] dark:text-amber-300 font-serif">
                      ₹{(orderQuantity * orderingCrop.pricePerKg).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md font-bold">
                    Escrow Protected
                  </span>
                </div>

                <Button
                  onClick={handleConfirmOrder}
                  disabled={isOrdering || orderQuantity <= 0}
                  className="w-full bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 py-3.5 font-black text-sm rounded-xl cursor-pointer"
                >
                  {isOrdering ? "Placing Order..." : "Confirm & Place Order"}
                </Button>
              </div>
            ) : (
              /* Order Success & Rider Assignment Flow */
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between font-bold text-green-900 dark:text-green-300">
                    <span>Order Reference</span>
                    <span>{orderSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between text-green-800 dark:text-green-400">
                    <span>Quantity:</span>
                    <span>{orderSuccess.quantity} kg</span>
                  </div>
                  <div className="flex justify-between text-green-800 dark:text-green-400 font-black">
                    <span>Total:</span>
                    <span>₹{orderSuccess.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Rider Assignment Box */}
                {!riderInfo ? (
                  <div className="p-4 bg-amber-50 dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700 rounded-2xl text-center space-y-3">
                    <p className="text-xs text-emerald-950 font-bold">
                      🛵 Need doorstep pickup & delivery from {orderingCrop.farmer.location}?
                    </p>
                    <Button
                      onClick={handleAssignRider}
                      disabled={isAssigningRider}
                      className="bg-[#0b3b20] hover:bg-[#072a16] text-amber-300 font-black text-xs rounded-xl"
                    >
                      {isAssigningRider ? "Finding Nearest Mini-Truck..." : "⚡ Dispatch Agri Logistics Rider"}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-bold text-sm">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <span>Rider Dispatched to Farm!</span>
                    </div>
                    <div className="text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                      <p>Rider: <span className="font-bold">{riderInfo.riderName}</span></p>
                      <p>Vehicle: <span className="font-bold">{riderInfo.vehicle}</span></p>
                      <p>Estimated ETA: <span className="font-bold">{riderInfo.etaMinutes} mins</span></p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href="/rider/deliveries" className="flex-1">
                    <Button variant="outline" className="w-full text-xs font-bold rounded-xl">
                      View in Rider Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setOrderingCrop(null)}
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

      {/* 8. UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
