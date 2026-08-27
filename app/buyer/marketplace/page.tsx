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
  Star,
  Layers,
  Percent,
  Package,
  Leaf,
  SlidersHorizontal,
} from "lucide-react";

interface FlattenedListing {
  cropId: string;
  cropName: string;
  hindiName: string;
  category: "Vegetables" | "Fruits" | "Grains & Pulses" | "Spices" | "Organic";
  cropImage: string;
  mandiBenchmarkPrice: number;
  cropDescription: string;
  seller: SellerListing;
  allSellersInCrop: SellerListing[];
}

export default function MarketplacePage() {
  const [commodities, setCommodities] = useState<MultiSellerCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(30);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [wishlist, setWishlist] = useState<string[]>([
    "farm_tom_01",
    "farm_on_01",
    "farm_mg_01",
  ]);
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocationName, setSelectedLocationName] =
    useState("Delhi NCR Mandi Corridor");
  const [showAppBanner, setShowAppBanner] = useState(true);

  // Selected Listing for Detail Modal / Seller Comparison
  const [selectedListing, setSelectedListing] = useState<FlattenedListing | null>(null);
  const [activeSellerInModal, setActiveSellerInModal] = useState<SellerListing | null>(null);

  // Purchase Modal State (Dual-Mode: Retail & Bulk)
  const [orderingItem, setOrderingItem] = useState<{
    listing: FlattenedListing;
    seller: SellerListing;
  } | null>(null);
  const [purchaseMode, setPurchaseMode] = useState<"retail" | "bulk">("retail");
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(25);
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
      prev.includes(sellerId)
        ? prev.filter((id) => id !== sellerId)
        : [...prev, sellerId],
    );
  };

  // Flattened listings for OLX Card View
  const allFlattenedListings: FlattenedListing[] = useMemo(() => {
    const list: FlattenedListing[] = [];
    commodities.forEach((crop) => {
      crop.sellers.forEach((seller) => {
        list.push({
          cropId: crop.cropId,
          cropName: crop.cropName,
          hindiName: crop.hindiName,
          category: crop.category,
          cropImage: crop.image,
          mandiBenchmarkPrice: crop.mandiBenchmarkPrice,
          cropDescription: crop.description,
          seller,
          allSellersInCrop: crop.sellers,
        });
      });
    });
    return list;
  }, [commodities]);

  // Filtered & Sorted listings
  const filteredListings = useMemo(() => {
    return allFlattenedListings
      .filter((item) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesCrop =
            item.cropName.toLowerCase().includes(q) ||
            item.hindiName.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q);
          const matchesFarmer =
            item.seller.farmerName.toLowerCase().includes(q) ||
            item.seller.location.toLowerCase().includes(q) ||
            item.seller.variety.toLowerCase().includes(q);
          if (!matchesCrop && !matchesFarmer) return false;
        }

        // Category filter
        if (selectedCategory !== "All") {
          if (selectedCategory === "Organic" && item.category !== "Organic") {
            return false;
          }
          if (
            selectedCategory !== "Organic" &&
            item.category !== selectedCategory
          ) {
            return false;
          }
        }

        // Quality Grade filter
        if (selectedGrade !== "All" && item.seller.grade !== selectedGrade) {
          return false;
        }

        // Minimum Rating filter
        if (minRating > 0 && item.seller.rating < minRating) {
          return false;
        }

        // Wishlist filter
        if (onlyWishlist && !wishlist.includes(item.seller.sellerId)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "featured") {
          if (a.seller.rating >= 4.8 && b.seller.rating < 4.8) return -1;
          if (a.seller.rating < 4.8 && b.seller.rating >= 4.8) return 1;
          return a.seller.distanceKm - b.seller.distanceKm;
        }
        if (sortBy === "price_asc") return a.seller.pricePerKg - b.seller.pricePerKg;
        if (sortBy === "price_desc") return b.seller.pricePerKg - a.seller.pricePerKg;
        if (sortBy === "rating_desc") return b.seller.rating - a.seller.rating;
        if (sortBy === "distance") return a.seller.distanceKm - b.seller.distanceKm;
        if (sortBy === "stock_desc")
          return b.seller.availableStockKg - a.seller.availableStockKg;
        return 0;
      });
  }, [
    allFlattenedListings,
    searchQuery,
    selectedCategory,
    selectedGrade,
    minRating,
    onlyWishlist,
    wishlist,
    sortBy,
  ]);

  // Open detail modal
  const handleOpenDetailModal = (listing: FlattenedListing) => {
    setSelectedListing(listing);
    setActiveSellerInModal(listing.seller);
  };

  // Open direct buy modal (Retail)
  const handleOpenRetailBuy = (
    listing: FlattenedListing,
    seller: SellerListing,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();
    setOrderingItem({ listing, seller });
    setPurchaseMode("retail");
    setPurchaseQuantity(25);
    setOrderSuccess(null);
    setRiderInfo(null);
  };

  // Open direct buy modal (Bulk)
  const handleOpenBulkBuy = (
    listing: FlattenedListing,
    seller: SellerListing,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();
    setOrderingItem({ listing, seller });
    setPurchaseMode("bulk");
    setPurchaseQuantity(1000); // 1 Ton in kg
    setOrderSuccess(null);
    setRiderInfo(null);
  };

  // Calculations for purchase modal
  const activeSellerForPurchase = orderingItem?.seller;
  const rawPrice = activeSellerForPurchase
    ? purchaseQuantity * activeSellerForPurchase.pricePerKg
    : 0;
  const isBulkDiscount =
    purchaseMode === "bulk" &&
    purchaseQuantity >= 500 &&
    (activeSellerForPurchase?.bulkDiscountPercent || 0) > 0;
  const discountAmount = isBulkDiscount
    ? Math.round(
        rawPrice *
          ((activeSellerForPurchase?.bulkDiscountPercent || 0) / 100),
      )
    : 0;
  const finalPayable = rawPrice - discountAmount;

  // Confirm order execution
  const handleConfirmOrder = async () => {
    if (!orderingItem || !activeSellerForPurchase) return;
    setIsOrdering(true);
    setTimeout(() => {
      setOrderSuccess({
        orderId: "AGRI-" + Math.floor(100000 + Math.random() * 900000),
        seller: activeSellerForPurchase,
        listing: orderingItem.listing,
        quantityKg: purchaseQuantity,
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
    <div className="min-h-screen bg-[#f7f8f9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col font-sans">
      
      {/* 1. TOP LIVE MANDI TICKER & UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. SIGNATURE OLX SEARCH & LOCATION HEADER */}
      <header className="sticky top-[73px] z-30 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 md:gap-6">
          
          {/* OLX Location Selector Dropdown */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-[#002f34] dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition cursor-pointer text-sm font-semibold max-w-[210px] truncate"
            >
              <MapPin className="w-4 h-4 text-[#002f34] dark:text-teal-400 shrink-0" />
              <span className="truncate">{selectedLocationName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 ml-auto" />
            </button>

            {/* Location Dropdown Modal */}
            {showLocationModal && (
              <div className="absolute top-12 left-0 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl rounded-lg p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-sm text-[#002f34] dark:text-white">
                    Delivery & Sourcing Hub
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
                          className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-teal-50 dark:hover:bg-teal-950/40 cursor-pointer ${
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
                placeholder='Search "Tomatoes, Rameshwar Patel, Onions, MP Wheat, Devgad Mangoes..."'
                className="w-full pl-4 pr-12 py-2.5 border-2 border-[#002f34] dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-zinc-800 text-sm placeholder-gray-400 dark:placeholder-zinc-500 shadow-inner transition font-medium"
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
              className={`p-2 rounded-full relative transition flex items-center justify-center cursor-pointer ${
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

        {/* 3. CATEGORY SUB-HEADER BAR */}
        <div className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-2">
            
            {/* All Categories Dropdown Trigger */}
            <div
              onClick={() => {
                setSelectedCategory("All");
                setOnlyWishlist(false);
              }}
              className="flex items-center gap-1 shrink-0 font-extrabold text-xs text-[#002f34] dark:text-teal-400 uppercase tracking-wider pr-3 border-r border-gray-200 dark:border-zinc-800 cursor-pointer hover:opacity-80"
            >
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

            {/* Quality Grade Info Ribbon */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 shrink-0">
              <span className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/60 px-2 py-0.5 rounded">
                <Truck className="w-3 h-3" /> Live Farm Logistics
              </span>
              <span>Sonipat & Azadpur APMC Synced</span>
            </div>
          </div>
        </div>

      </header>

      {/* 4. MAIN BODY FEED: OLX PRODUCE CARDS GRID */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        
        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#002f34] dark:text-zinc-100 tracking-tight flex items-center gap-2">
              Fresh recommendations
              <Badge
                variant="outline"
                className="text-xs font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800"
              >
                {filteredListings.length} farmer listings near you
              </Badge>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Direct from verified multi-seller farms within{" "}
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
                  className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                    radius === r
                      ? "bg-[#002f34] text-white dark:bg-teal-600"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>

            {/* Quality Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">All Grades (सभी ग्रेड)</option>
              <option value="Grade A">Grade A (Rating 4.5+ Export)</option>
              <option value="Grade B">Grade B (Rating 3.5 - 4.4 Mandi)</option>
              <option value="Grade C">Grade C (Processing &lt;3.5)</option>
            </select>

            {/* Minimum Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>⭐ 4.5+ Stars (Grade A)</option>
              <option value={4.0}>⭐ 4.0+ Stars</option>
              <option value={3.5}>⭐ 3.5+ Stars</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="rating_desc">Sort: Highest Rated Farmers</option>
              <option value="distance">Sort: Nearest Farm First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_desc">Quantity: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden animate-pulse flex flex-col h-[360px]"
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
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-12 text-center max-w-lg mx-auto shadow-xs my-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-2xl mx-auto">
              🔍
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              No crop listings matched your criteria
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try increasing your search radius to 50 km or clearing specific category/quality filters.
            </p>
            <div className="flex justify-center gap-3">
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
          /* 5. PRODUCT CARDS GRID (EXACT OLX AESTHETIC + ENRICHED MULTI-SELLER DATA) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredListings.map((item, index) => {
              const isWishlisted = wishlist.includes(item.seller.sellerId);
              const isGradeA = item.seller.grade === "Grade A";
              const isGradeB = item.seller.grade === "Grade B";
              const isGradeC = item.seller.grade === "Grade C";
              const otherSellersCount = item.allSellersInCrop.length - 1;

              return (
                <div key={`${item.cropId}-${item.seller.sellerId}`} className="contents">
                  {/* OLX CARD */}
                  <div
                    onClick={() => handleOpenDetailModal(item)}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col justify-between group relative"
                  >
                    {/* Top Image Box */}
                    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={item.cropImage}
                        alt={item.cropName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* FEATURED Yellow Badge (Bottom Left of photo like OLX) */}
                      {item.seller.rating >= 4.8 && (
                        <div className="absolute bottom-2 left-2 bg-[#ffce32] text-black font-black text-[10px] px-2 py-0.5 rounded-xs uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <span>FEATURED</span>
                        </div>
                      )}

                      {/* Multi-Seller count pill (Bottom Right of photo) */}
                      {otherSellersCount > 0 && (
                        <div className="absolute bottom-2 right-2 bg-[#002f34]/90 backdrop-blur-xs text-teal-300 font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 border border-teal-700/50">
                          <Layers className="w-3 h-3 text-teal-400" />
                          <span>+{otherSellersCount} More Farmers</span>
                        </div>
                      )}

                      {/* Grade Pill Linked Directly to Rating (Top Left) */}
                      <div
                        className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-xs ${
                          isGradeA
                            ? "bg-[#002f34]/90 text-amber-300 border border-amber-400/40"
                            : isGradeB
                            ? "bg-teal-900/90 text-teal-200 border border-teal-400/40"
                            : "bg-gray-800/90 text-gray-200 border border-gray-500/40"
                        }`}
                      >
                        <span>{item.seller.grade}</span>
                        <span>(⭐ {item.seller.rating})</span>
                      </div>

                      {/* Heart Favorite Button (Top Right) */}
                      <button
                        onClick={(e) => toggleWishlist(item.seller.sellerId, e)}
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

                    {/* Card Content (OLX Details Layout + Enriched Farmer Profile) */}
                    <div className="p-3.5 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        {/* Price & Stock */}
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            ₹ {item.seller.pricePerKg.toLocaleString("en-IN")}
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                              / kg
                            </span>
                          </h3>
                          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded">
                            {item.seller.availableStockKg.toLocaleString("en-IN")} kg
                          </span>
                        </div>

                        {/* Title & Hindi name */}
                        <div className="mt-1">
                          <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                            {item.cropName} ({item.hindiName})
                          </p>
                          <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 truncate">
                            {item.seller.variety}
                          </p>
                        </div>

                        {/* Enriched Farmer Profile Row */}
                        <div className="mt-2.5 p-2 bg-gray-50 dark:bg-zinc-800/60 rounded border border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={item.seller.avatarUrl}
                              alt={item.seller.farmerName}
                              className="w-7 h-7 rounded-full object-cover border border-teal-500 shrink-0"
                            />
                            <div className="truncate">
                              <span className="text-xs font-bold text-gray-900 dark:text-white truncate block">
                                {item.seller.farmerName}
                              </span>
                              <span className="text-[10px] text-gray-500 truncate block">
                                {item.seller.totalSales}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-amber-600 shrink-0 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {item.seller.rating}
                          </span>
                        </div>
                      </div>

                      {/* Dual-Mode Action Buttons */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => handleOpenRetailBuy(item, item.seller, e)}
                            className="flex-1 py-1.5 bg-[#002f34] hover:bg-[#003d44] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs rounded transition cursor-pointer"
                          >
                            🛒 Buy (kg)
                          </button>
                          <button
                            onClick={(e) => handleOpenBulkBuy(item, item.seller, e)}
                            className="flex-1 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded transition cursor-pointer border border-amber-500/30"
                          >
                            📦 Bulk (Tons)
                          </button>
                        </div>
                      </div>

                      {/* Footer: Location & Distance (OLX exact layout) */}
                      <div className="pt-2 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        <span
                          className="uppercase truncate max-w-[65%]"
                          title={item.seller.location}
                        >
                          {item.seller.location}
                        </span>
                        <span className="font-bold text-teal-700 dark:text-teal-400 shrink-0">
                          {item.seller.distanceKm} km away
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PROMOTIONAL "Want to see your harvest here?" CARD (OLX Exact Placement) */}
                  {index === 3 && (
                    <div className="bg-gradient-to-br from-[#002f34] to-[#0b3b20] text-white rounded-md p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
                      <div className="space-y-2 relative z-10">
                        <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          🌾 FOR INDIAN FARMERS
                        </span>
                        <h4 className="text-lg font-extrabold leading-tight">
                          Want to sell your harvest here?
                        </h4>
                        <p className="text-xs text-teal-100/90 leading-relaxed">
                          Sell directly to consumers & bulk buyers in your district. Zero middleman cuts. Fast pickup dispatch.
                        </p>
                      </div>

                      <div className="mt-6 relative z-10">
                        <Link
                          href="/farmer/crops/new"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black rounded transition text-sm flex items-center justify-center gap-1 cursor-pointer shadow">
                            <span>Start selling / फसल जोड़ें</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>

                      {/* Decorative circle */}
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xs pointer-events-none" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. FLOATING APP DOWNLOAD BANNER (Matches OLX QR Widget) */}
      {showAppBanner && (
        <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl p-3.5 max-w-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center p-1.5 shrink-0">
            <QrCode className="w-full h-full text-[#002f34] dark:text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
              Download FarmFresh Krishi App
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Live Mandi price alerts & direct farmer contact
            </p>
          </div>
          <button
            onClick={() => setShowAppBanner(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 -mt-5 -mr-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6. OLX DETAIL MODAL + MULTI-SELLER COMPARISON VIEW */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/70 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase bg-[#002f34] text-white px-2.5 py-0.5 rounded">
                  {selectedListing.category}
                </span>
                <span className="text-xs text-gray-600 font-bold">
                  {selectedListing.cropName} ({selectedListing.hindiName})
                </span>
                <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                  {selectedListing.allSellersInCrop.length} Verified Farmers Selling
                </span>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Top Overview: Image + Produce Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Image */}
                <div className="md:col-span-5 space-y-3">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden relative bg-gray-100 dark:bg-zinc-800 border border-gray-200">
                    <img
                      src={selectedListing.cropImage}
                      alt={selectedListing.cropName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Mandi Benchmark: ₹{selectedListing.mandiBenchmarkPrice}/kg
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {selectedListing.cropDescription}
                  </p>
                </div>

                {/* Selected Seller Snapshot & Direct Purchase Card */}
                <div className="md:col-span-7 space-y-4">
                  {activeSellerInModal && (
                    <div className="p-4 bg-teal-50/40 dark:bg-zinc-800/80 rounded-xl border border-teal-200 dark:border-teal-900/50 space-y-3">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={activeSellerInModal.avatarUrl}
                            alt={activeSellerInModal.farmerName}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-teal-600 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                                {activeSellerInModal.farmerName}
                              </h4>
                              <ShieldCheck className="w-4 h-4 text-teal-600 fill-teal-100" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              ⭐ {activeSellerInModal.rating} · {activeSellerInModal.grade} • {activeSellerInModal.totalSales}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-[#002f34] dark:text-teal-300 font-serif">
                            ₹{activeSellerInModal.pricePerKg}
                          </span>
                          <span className="text-xs text-gray-500 block">/ kg</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs border-y border-teal-100 dark:border-zinc-700 py-2">
                        <div>
                          <span className="text-gray-500 block">Variety</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {activeSellerInModal.variety}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Available Stock</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {activeSellerInModal.availableStockKg.toLocaleString("en-IN")} kg
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={() => {
                            const listing = selectedListing;
                            const seller = activeSellerInModal;
                            setSelectedListing(null);
                            handleOpenRetailBuy(listing, seller);
                          }}
                          className="flex-1 bg-[#002f34] hover:bg-[#003d44] text-white font-bold text-xs"
                        >
                          🛒 Retail Buy (kg)
                        </Button>
                        <Button
                          onClick={() => {
                            const listing = selectedListing;
                            const seller = activeSellerInModal;
                            setSelectedListing(null);
                            handleOpenBulkBuy(listing, seller);
                          }}
                          className="flex-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs"
                        >
                          📦 Buy in Bulk (Tons)
                        </Button>
                      </div>

                    </div>
                  )}
                </div>

              </div>

              {/* Multi-Seller Comparison Table (Compare All Farmers for this Produce) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-[#002f34] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>Compare All {selectedListing.allSellersInCrop.length} Verified Farmers for {selectedListing.cropName}</span>
                </h4>

                <div className="space-y-2">
                  {selectedListing.allSellersInCrop.map((seller) => {
                    const isSelected = activeSellerInModal?.sellerId === seller.sellerId;
                    return (
                      <div
                        key={seller.sellerId}
                        onClick={() => setActiveSellerInModal(seller)}
                        className={`p-3 rounded-lg border flex items-center justify-between gap-4 transition cursor-pointer ${
                          isSelected
                            ? "bg-teal-50/70 border-teal-500 dark:bg-zinc-800 shadow-xs"
                            : "bg-white dark:bg-zinc-900 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={seller.avatarUrl}
                            alt={seller.farmerName}
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-gray-900 dark:text-white">
                                {seller.farmerName}
                              </span>
                              <span className="text-[10px] font-bold bg-gray-100 text-gray-800 px-1.5 py-0.2 rounded">
                                {seller.grade}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-500">
                              {seller.location} • ⭐ {seller.rating}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div>
                            <span className="text-base font-black text-[#002f34] dark:text-teal-300">
                              ₹{seller.pricePerKg} / kg
                            </span>
                            <span className="text-[10px] text-gray-500 block">
                              Stock: {seller.availableStockKg.toLocaleString()} kg
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              const listing = selectedListing;
                              setSelectedListing(null);
                              handleOpenRetailBuy(listing, seller);
                            }}
                            className={`text-xs font-bold ${
                              isSelected ? "bg-[#002f34] text-white" : ""
                            }`}
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedListing(null)}
              >
                Close View
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    alert(
                      `Calling Farmer ${activeSellerInModal?.farmerName} at ${activeSellerInModal?.phone}`,
                    )
                  }
                  className="text-xs flex items-center gap-1 border-teal-700 text-teal-800"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Farmer</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. INTEGRATED DUAL-MODE PURCHASE MODAL */}
      {orderingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-5">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  {orderSuccess
                    ? "🎉 Direct Farm Order Placed!"
                    : purchaseMode === "bulk"
                    ? "📦 Bulk Wholesale Procurement"
                    : "🛒 Direct Retail Purchase"}
                </h3>
                <p className="text-xs text-gray-500">
                  {orderingItem.listing.cropName} from{" "}
                  <strong>{orderingItem.seller.farmerName}</strong>
                </p>
              </div>
              <button
                onClick={() => setOrderingItem(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!orderSuccess ? (
              <div className="space-y-4">
                
                {/* Purchase Mode Switcher */}
                <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMode("retail");
                      setPurchaseQuantity(25);
                    }}
                    className={`flex-1 py-1 text-xs font-bold rounded transition cursor-pointer ${
                      purchaseMode === "retail"
                        ? "bg-[#002f34] text-white shadow-xs"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    🛒 Retail Buy (kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMode("bulk");
                      setPurchaseQuantity(1000);
                    }}
                    className={`flex-1 py-1 text-xs font-bold rounded transition cursor-pointer ${
                      purchaseMode === "bulk"
                        ? "bg-amber-400 text-emerald-950 shadow-xs"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    📦 Bulk Sourcing (Tons / Discounts)
                  </button>
                </div>

                {/* Seller Quick Info */}
                <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={orderingItem.seller.avatarUrl}
                      alt={orderingItem.seller.farmerName}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">
                        {orderingItem.seller.farmerName}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {orderingItem.seller.grade} • ⭐ {orderingItem.seller.rating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-teal-800">
                      ₹{orderingItem.seller.pricePerKg} / kg
                    </span>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Quantity ({purchaseMode === "bulk" ? "in kg / Ton" : "kg"})</span>
                    <span className="text-teal-700 font-bold">
                      {purchaseQuantity.toLocaleString("en-IN")} kg
                      {purchaseMode === "bulk" && purchaseQuantity >= 1000 && ` (${(purchaseQuantity / 1000).toFixed(1)} Tons)`}
                    </span>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={orderingItem.seller.availableStockKg}
                    value={purchaseQuantity}
                    onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                    className="font-bold text-base"
                  />

                  {/* Bulk Quick-Preset Chips */}
                  {purchaseMode === "bulk" && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity(500)}
                        className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded cursor-pointer"
                      >
                        500 kg (5% Off)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity(1000)}
                        className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded cursor-pointer"
                      >
                        1 Ton (1,000 kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity(2500)}
                        className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded cursor-pointer"
                      >
                        2.5 Tons
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="p-3 bg-gray-50 rounded-lg border space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Amount:</span>
                    <span>₹{rawPrice.toLocaleString("en-IN")}</span>
                  </div>
                  {isBulkDiscount && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Bulk Discount ({orderingItem.seller.bulkDiscountPercent}%):</span>
                      <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-1.5 font-extrabold text-sm text-[#002f34]">
                    <span>Total Direct Payable:</span>
                    <span>₹{finalPayable.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <Button
                  onClick={handleConfirmOrder}
                  disabled={isOrdering || purchaseQuantity <= 0}
                  className="w-full bg-[#002f34] hover:bg-[#003d44] text-white py-3 font-bold text-sm"
                >
                  {isOrdering ? "Placing Order..." : "Confirm & Place Direct Order"}
                </Button>

              </div>
            ) : (
              /* Success & Logistics Screen */
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg text-xs space-y-2 border border-green-200">
                  <div className="flex justify-between font-bold text-green-900">
                    <span>Order Reference:</span>
                    <span className="font-mono">{orderSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between text-green-800">
                    <span>Quantity:</span>
                    <span>{orderSuccess.quantityKg.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between text-green-800 font-bold">
                    <span>Total:</span>
                    <span>₹{orderSuccess.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Logistics Rider Dispatch */}
                {!riderInfo ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center space-y-2.5">
                    <p className="text-xs text-blue-900 font-bold">
                      🛵 Need mini-truck or auto pickup from {orderSuccess.seller.location}?
                    </p>
                    <Button
                      onClick={handleAssignRider}
                      disabled={isAssigningRider}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      {isAssigningRider ? "Finding Nearest Vehicle..." : "⚡ Dispatch Agri Logistics Rider"}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                      <Truck className="w-4 h-4 text-teal-600" />
                      <span>Agri-Logistics Partner Dispatched!</span>
                    </div>
                    <div className="text-xs text-teal-800 space-y-1">
                      <p>Driver: <span className="font-bold">{riderInfo.riderName}</span></p>
                      <p>Vehicle: <span className="font-bold">{riderInfo.vehicle}</span></p>
                      <p>Estimated Arrival: <span className="font-bold">{riderInfo.etaMinutes} mins</span></p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href="/rider/deliveries" className="flex-1">
                    <Button variant="outline" className="w-full text-xs">
                      View Logistics
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setOrderingItem(null)}
                    className="flex-1 bg-[#002f34] text-white text-xs font-bold"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
}
