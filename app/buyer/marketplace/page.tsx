"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
    useState("India (Delhi NCR)");
  const [showAppBanner, setShowAppBanner] = useState(true);

  // Order modal state
  const [orderingCrop, setOrderingCrop] = useState<CropListing | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(100);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [riderInfo, setRiderInfo] = useState<any | null>(null);
  const [isAssigningRider, setIsAssigningRider] = useState(false);

  const categories = [
    "All",
    "Vegetables",
    "Fruits",
    "Grains & Pulses",
    "Spices",
    "Organic",
  ];

  const popularLocations = [
    { name: "Delhi NCR", lat: 28.6139, lng: 77.209 },
    { name: "Noida / Greater Noida", lat: 28.5355, lng: 77.391 },
    { name: "Sonipat, Haryana", lat: 28.9931, lng: 77.0151 },
    { name: "Punjab (Ludhiana)", lat: 30.901, lng: 75.8573 },
    { name: "Maharashtra (Nashik)", lat: 19.9975, lng: 73.7898 },
    { name: "All India", lat: 28.6139, lng: 77.209 },
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
          const matchesCategory = crop.category.toLowerCase().includes(query);
          const matchesVariety =
            crop.variety?.toLowerCase().includes(query) || false;
          const matchesFarmer =
            crop.farmer?.name.toLowerCase().includes(query) || false;
          const matchesLocation =
            crop.farmer?.location.toLowerCase().includes(query) || false;
          if (
            !matchesName &&
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
        orderId: "AGRI-" + Math.floor(100000 + Math.random() * 900000),
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
    <div className="min-h-screen bg-[#f7f8f9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* 1. TOP OLX-STYLE NAVBAR */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
            <div className="w-10 h-10 rounded-full bg-[#002f34] dark:bg-teal-600 flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-sm group-hover:scale-105 transition">
              🌾
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-[#002f34] dark:text-teal-400 tracking-tighter">
                Farm
                <span className="text-teal-600 dark:text-teal-200">Fresh</span>
              </span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest -mt-0.5">
                Farm Marketplace
              </span>
            </div>
          </Link>

          {/* Location Selector Pill */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-[#002f34] dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition cursor-pointer text-sm font-semibold max-w-[200px] truncate"
            >
              <MapPin className="w-4 h-4 text-[#002f34] dark:text-teal-400 shrink-0" />
              <span className="truncate">{selectedLocationName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 ml-auto" />
            </button>

            {/* Location Dropdown Modal */}
            {showLocationModal && (
              <div className="absolute top-12 left-0 w-72 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl rounded-lg p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-sm">
                    Delivery & Sourcing Hub
                  </span>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      <span>Search Radius</span>
                      <span className="text-teal-600 dark:text-teal-400 font-bold">
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
                    <span className="text-[11px] font-bold uppercase text-gray-400 block mb-1.5">
                      Popular Agricultural Hubs
                    </span>
                    <div className="space-y-1">
                      {popularLocations.map((loc) => (
                        <button
                          key={loc.name}
                          onClick={() => {
                            setSelectedLocationName(loc.name);
                            setShowLocationModal(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-teal-50 dark:hover:bg-teal-950/40 ${
                            selectedLocationName === loc.name
                              ? "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span>{loc.name}</span>
                          {selectedLocationName === loc.name && (
                            <Check className="w-3.5 h-3.5 text-teal-600" />
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
                placeholder='Search "Tomatoes, Fresh Onions, Wheat, Ratnagiri Mangoes..."'
                className="w-full pl-4 pr-12 py-2.5 border-2 border-[#002f34] dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-zinc-800 text-sm placeholder-gray-400 dark:placeholder-zinc-500 shadow-inner transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {}}
                className="absolute right-1 top-1 bottom-1 px-4 bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44] dark:hover:bg-teal-500 text-white rounded flex items-center justify-center transition cursor-pointer"
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
              className={`p-2 rounded-full relative transition flex items-center justify-center ${
                onlyWishlist
                  ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
              }`}
              title="Saved Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlist.length > 0 ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Bulk Order shortcut */}
            <Link
              href="/buyer/bulk-order"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 px-2.5 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <Store className="w-4 h-4" />
              <span>Bulk 1,000kg+</span>
            </Link>

            {/* Signature OLX + SELL Button */}
            <Link
              href="/farmer/crops/new"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-extrabold text-gray-900 rounded-full group bg-gradient-to-br from-yellow-400 via-teal-400 to-blue-600 hover:from-yellow-500 hover:to-blue-700 shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <span className="relative px-4 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-zinc-900 rounded-full group-hover:bg-opacity-0 group-hover:text-white flex items-center gap-1.5 text-[#002f34] dark:text-white font-black">
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>SELL</span>
              </span>
            </Link>
          </div>
        </div>

        {/* 2. CATEGORY SUB-HEADER BAR */}
        <div className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-2">
            {/* All Categories Dropdown Trigger */}
            <div className="flex items-center gap-1 shrink-0 font-extrabold text-xs text-[#002f34] dark:text-teal-400 uppercase tracking-wider pr-3 border-r border-gray-200 dark:border-zinc-800 cursor-pointer hover:opacity-80">
              <Grid className="w-3.5 h-3.5" />
              <span>ALL CATEGORIES</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 md:gap-2 flex-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOnlyWishlist(false);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? "bg-[#002f34] text-white dark:bg-teal-600 dark:text-white shadow-xs"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Current Date & Direct Delivery Badge */}
            <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400 shrink-0">
              <span className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/60 px-2 py-0.5 rounded">
                <Truck className="w-3 h-3" /> Live Farm Logistics
              </span>
              <span>27 Aug, 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN BODY SECTION */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#002f34] dark:text-zinc-100 tracking-tight flex items-center gap-2">
              Fresh recommendations
              <Badge
                variant="outline"
                className="text-xs font-normal bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800"
              >
                {filteredListings.length} crops near you
              </Badge>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Direct from verified local farmers within{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {radius} km
              </span>{" "}
              radius
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Radius Quick Selector */}
            <div className="flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-1 text-xs">
              <span className="text-gray-500 font-medium px-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-600" />
                Radius:
              </span>
              {[15, 30, 50, 100].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    radius === r
                      ? "bg-[#002f34] text-white dark:bg-teal-600"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
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
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Grades</option>
              <option value="A">Grade A (Premium)</option>
              <option value="B">Grade B (Standard)</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="distance">Sort: Nearest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="quantity_desc">Quantity: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden animate-pulse flex flex-col h-[320px]"
              >
                <div className="h-44 bg-gray-200 dark:bg-zinc-800" />
                <div className="p-3.5 space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-12 text-center max-w-lg mx-auto shadow-xs my-10">
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-2xl mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
              No crop listings matched your criteria
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Try increasing your search radius to 50 km or clearing specific
              category/quality filters.
            </p>
            <div className="flex justify-center gap-3">
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
                  className="bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44]"
                >
                  Post a Crop Listing
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* 4. PRODUCT CARDS GRID (OLX EXACT STYLE) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredListings.map((crop, index) => {
              const isWishlisted = wishlist.includes(crop.id);

              return (
                <div key={crop.id} className="contents">
                  {/* OLX CARD */}
                  <div
                    onClick={() => setSelectedCrop(crop)}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col justify-between group relative"
                  >
                    {/* Top Image Box */}
                    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* FEATURED Yellow Badge (Bottom Left of photo like OLX) */}
                      {crop.featured && (
                        <div className="absolute bottom-2 left-2 bg-[#ffce32] text-black font-black text-[10px] px-2 py-0.5 rounded-xs uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <span>FEATURED</span>
                        </div>
                      )}

                      {/* Grade Pill (Top Left) */}
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span>Grade {crop.quality}</span>
                        {crop.category === "Organic" && <span>🌿</span>}
                      </div>

                      {/* Heart Favorite Button (Top Right) */}
                      <button
                        onClick={(e) => toggleWishlist(crop.id, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow hover:bg-white text-gray-700 dark:text-gray-300 hover:scale-110 active:scale-90 transition cursor-pointer"
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

                    {/* Card Content (OLX Details Layout) */}
                    <div className="p-3.5 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Price */}
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            ₹ {crop.pricePerKg.toLocaleString("en-IN")}
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                              / kg
                            </span>
                          </h3>
                          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded">
                            {crop.quantityKg.toLocaleString("en-IN")} kg
                          </span>
                        </div>

                        {/* Variety / Subtitle */}
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1 truncate">
                          {crop.variety || `${crop.category} · Fresh Harvest`}
                        </p>

                        {/* Title */}
                        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1 mt-0.5">
                          {crop.name}
                        </p>
                      </div>

                      {/* Footer: Location & Date (OLX exact layout) */}
                      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        <span
                          className="uppercase truncate max-w-[65%]"
                          title={crop.farmer.location}
                        >
                          {crop.farmer.location}
                        </span>
                        <span className="uppercase shrink-0 text-right">
                          {crop.postedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PROMOTIONAL "Want to see your stuff here?" CARD (Inserted after 4th item or mid-grid like OLX) */}
                  {index === 3 && (
                    <div className="bg-gradient-to-br from-[#3a77ff] to-[#1e50c4] text-white rounded-md p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
                      <div className="space-y-2 relative z-10">
                        <h4 className="text-lg font-extrabold leading-tight">
                          Want to see your harvest here?
                        </h4>
                        <p className="text-xs text-blue-100 leading-relaxed">
                          Make extra cash by selling directly to retailers and
                          bulk buyers in your district. Go on, it's quick and
                          easy.
                        </p>
                      </div>

                      <div className="mt-6 relative z-10">
                        <Link
                          href="/farmer/crops/new"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="w-full py-2.5 px-4 bg-transparent border-2 border-white text-white font-bold rounded hover:bg-white hover:text-blue-700 transition duration-150 text-sm flex items-center justify-center gap-1 cursor-pointer">
                            <span>Start selling</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>

                      {/* Decorative background circle */}
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xs pointer-events-none" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. FLOATING APP DOWNLOAD BANNER (Matches OLX QR Widget in Screenshot) */}
      {showAppBanner && (
        <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl p-3.5 max-w-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center p-1.5 shrink-0">
            <QrCode className="w-full h-full text-[#002f34] dark:text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
              Download The FarmFresh App
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Instant mandi alerts & direct buyer chat
            </p>
          </div>
          <button
            onClick={() => setShowAppBanner(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 -mt-5 -mr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6. CROP DETAIL MODAL (Opens on Card Click) */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded">
                  {selectedCrop.category}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Posted {selectedCrop.postedDate}
                </span>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Image & Tags */}
                <div className="space-y-3">
                  <div className="aspect-4/3 rounded-lg overflow-hidden relative bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                    <img
                      src={selectedCrop.image}
                      alt={selectedCrop.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedCrop.featured && (
                      <span className="absolute top-3 left-3 bg-[#ffce32] text-black font-black text-xs px-2.5 py-1 rounded shadow">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* AI Price Insight Card */}
                  <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>AI Market Assessment</span>
                    </div>
                    <p className="text-blue-800 dark:text-blue-200">
                      Price is competitive: ₹{selectedCrop.pricePerKg}/kg is
                      within optimal wholesale mandi benchmark for Grade{" "}
                      {selectedCrop.quality}.
                    </p>
                  </div>
                </div>

                {/* Right: Info & Pricing */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                      {selectedCrop.name}
                    </h2>
                    <p className="text-sm font-semibold text-teal-700 dark:text-teal-400 mt-0.5">
                      Variety: {selectedCrop.variety}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="p-4 bg-teal-50/70 dark:bg-teal-950/40 rounded-lg border border-teal-100 dark:border-teal-900 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-gray-500 uppercase block font-semibold">
                        Wholesale Rate
                      </span>
                      <span className="text-3xl font-extrabold text-[#002f34] dark:text-teal-300">
                        ₹{selectedCrop.pricePerKg}
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          {" "}
                          / kg
                        </span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 uppercase block font-semibold">
                        Available Stock
                      </span>
                      <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {selectedCrop.quantityKg.toLocaleString("en-IN")} kg
                      </span>
                    </div>
                  </div>

                  {/* Specs Table */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-gray-100 dark:border-zinc-800 py-3">
                    <div>
                      <span className="text-gray-400 block font-medium">
                        Quality Grade
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        Grade {selectedCrop.quality} (Inspected)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">
                        Distance
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {selectedCrop.distanceKm} km from you
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">
                        Farm Origin
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {selectedCrop.farmer.location}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">
                        Harvest Status
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        Fresh Farm Ready
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Farmer Notes & Description:
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-zinc-800/60 p-3 rounded border border-gray-100 dark:border-zinc-800">
                      {selectedCrop.description}
                    </p>
                  </div>

                  {/* Farmer Profile Card */}
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800/80 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-sm">
                        {selectedCrop.farmer.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {selectedCrop.farmer.name}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                        </div>
                        <span className="text-[11px] text-gray-500">
                          ⭐ {selectedCrop.farmer.rating} · Verified Producer
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
                      className="text-xs flex items-center gap-1 border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Contact</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-between items-center gap-3">
              <button
                onClick={(e) => toggleWishlist(selectedCrop.id, e)}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlist.includes(selectedCrop.id)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
                <span>
                  {wishlist.includes(selectedCrop.id) ? "Saved" : "Save"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setSelectedCrop(null)}>
                  Back to listings
                </Button>
                <Button
                  onClick={() => {
                    const crop = selectedCrop;
                    setSelectedCrop(null);
                    handleStartOrder(crop);
                  }}
                  className="bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44] text-white px-6 font-bold flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
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
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!orderSuccess ? (
              /* Order Form */
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Unit Price:
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ₹{orderingCrop.pricePerKg} / kg
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Order Quantity (kg)</span>
                    <span className="text-teal-600 font-bold">
                      {orderQuantity} kg
                    </span>
                  </div>
                  <input
                    type="number"
                    min={10}
                    max={orderingCrop.quantityKg}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm font-semibold"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    Max available: {orderingCrop.quantityKg} kg
                  </span>
                </div>

                <div className="p-4 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-xs text-teal-800 dark:text-teal-300 font-medium block">
                      Total Payable Amount
                    </span>
                    <span className="text-2xl font-black text-[#002f34] dark:text-teal-200">
                      ₹
                      {(orderQuantity * orderingCrop.pricePerKg).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-teal-700 bg-teal-100 dark:bg-teal-900/80 px-2 py-1 rounded font-bold">
                    Escrow Protected
                  </span>
                </div>

                <Button
                  onClick={handleConfirmOrder}
                  disabled={isOrdering || orderQuantity <= 0}
                  className="w-full bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44] text-white py-3 font-bold text-base"
                >
                  {isOrdering ? "Placing Order..." : "Confirm & Place Order"}
                </Button>
              </div>
            ) : (
              /* Order Success & Rider Assignment Flow */
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between font-bold text-green-900 dark:text-green-300">
                    <span>Order Reference</span>
                    <span>{orderSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between text-green-800 dark:text-green-400">
                    <span>Quantity:</span>
                    <span>{orderSuccess.quantity} kg</span>
                  </div>
                  <div className="flex justify-between text-green-800 dark:text-green-400 font-bold">
                    <span>Total:</span>
                    <span>
                      ₹{orderSuccess.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Rider Assignment Box */}
                {!riderInfo ? (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-center space-y-3">
                    <p className="text-xs text-blue-900 dark:text-blue-200 font-medium">
                      🛵 Need fast pickup & delivery from{" "}
                      {orderingCrop.farmer.location}?
                    </p>
                    <Button
                      onClick={handleAssignRider}
                      disabled={isAssigningRider}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      {isAssigningRider
                        ? "Finding Optimal Rider..."
                        : "⚡ Assign Nearby Rider"}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold text-sm">
                      <Truck className="w-4 h-4 text-teal-600" />
                      <span>Rider Dispatched!</span>
                    </div>
                    <div className="text-xs text-teal-800 dark:text-teal-300 space-y-1">
                      <p>
                        Rider:{" "}
                        <span className="font-bold">{riderInfo.riderName}</span>
                      </p>
                      <p>
                        Vehicle:{" "}
                        <span className="font-bold">{riderInfo.vehicle}</span>
                      </p>
                      <p>
                        Estimated ETA:{" "}
                        <span className="font-bold">
                          {riderInfo.etaMinutes} mins
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href="/rider/deliveries" className="flex-1">
                    <Button variant="outline" className="w-full text-xs">
                      View in Rider Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setOrderingCrop(null)}
                    className="flex-1 bg-[#002f34] dark:bg-teal-600 text-white text-xs"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. OLX-STYLE FOOTER */}
      <footer className="mt-16 bg-[#ebeeef] dark:bg-zinc-900 border-t border-gray-300 dark:border-zinc-800 text-gray-700 dark:text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-extrabold text-[#002f34] dark:text-white uppercase mb-3 tracking-wider text-[11px]">
              POPULAR LOCATIONS
            </h5>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline">
                  Sonipat Mandi
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Nashik Onion Hub
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Azadpur Mandi Delhi
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Ludhiana Grain Market
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-extrabold text-[#002f34] dark:text-white uppercase mb-3 tracking-wider text-[11px]">
              TRENDING HARVESTS
            </h5>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline">
                  Hybrid Shimla Tomatoes
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Sharbati Wheat 306
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  1121 Basmati Rice
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Organic Desi Chickpeas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-extrabold text-[#002f34] dark:text-white uppercase mb-3 tracking-wider text-[11px]">
              ABOUT AGRICOLX
            </h5>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline">
                  Direct Farm Trading
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Bulk Aggregation Engine
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  AI Mandi Price Forecast
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Delivery Rider Network
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-extrabold text-[#002f34] dark:text-white uppercase mb-3 tracking-wider text-[11px]">
              FarmFresh APP
            </h5>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
              Buy and sell crops on the go with zero middleman commissions.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-[#002f34] text-white rounded font-bold text-[11px]">
                Google Play
              </span>
              <span className="px-3 py-1.5 bg-[#002f34] text-white rounded font-bold text-[11px]">
                App Store
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#002f34] text-white py-4 px-4 text-center text-[11px]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              🌾 FarmFresh — Decentralized Agricultural Direct Marketplace
            </span>
            <span>All mock data & hackathon demo mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
