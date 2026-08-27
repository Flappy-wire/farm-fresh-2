// lib/mock-data.ts

// Mock Farmers (with authentic Indian farming hubs)
export const mockFarmers = [
  {
    id: "f1",
    name: "Rameshwar Patel (रामेश्वर पटेल)",
    location: "Sonipat Vegetable Belt",
    state: "Haryana",
    lat: 28.9931,
    lng: 77.0151,
    phone: "+91 98123 45678",
    rating: 4.9,
    verified: true,
    experience: "24 Yrs Farming",
    landSize: "12 Acres",
  },
  {
    id: "f2",
    name: "Suresh Patil & Sons (सुरेश पाटिल)",
    location: "Lasalgaon Mandi Hub, Nashik",
    state: "Maharashtra",
    lat: 20.1478,
    lng: 74.2257,
    phone: "+91 98234 56789",
    rating: 4.9,
    verified: true,
    experience: "18 Yrs Farming",
    landSize: "25 Acres",
  },
  {
    id: "f3",
    name: "Sardar Gurpreet Singh (गुरप्रीत सिंह)",
    location: "Samana Grain Corridor, Patiala",
    state: "Punjab",
    lat: 30.1557,
    lng: 76.1917,
    phone: "+91 98345 67890",
    rating: 4.8,
    verified: true,
    experience: "30 Yrs Farming",
    landSize: "40 Acres",
  },
  {
    id: "f4",
    name: "Kisan Vikas FPO (किसान विकास एफपीओ)",
    location: "Sehore Agro Hub",
    state: "Madhya Pradesh",
    lat: 23.2031,
    lng: 77.0844,
    phone: "+91 98456 78901",
    rating: 4.7,
    verified: true,
    experience: "Cooperative (85 Farmers)",
    landSize: "320 Acres Combined",
  },
  {
    id: "f5",
    name: "Choudhary Balbir Farms (चौधरी बलबीर)",
    location: "Karnal Farm Cluster",
    state: "Haryana",
    lat: 29.6857,
    lng: 76.9907,
    phone: "+91 98567 89012",
    rating: 4.9,
    verified: true,
    experience: "15 Yrs Farming",
    landSize: "18 Acres",
  },
  {
    id: "f6",
    name: "Jaivik Krishi Kendra (जैविक कृषि केंद्र)",
    location: "Alwar Organic Cluster",
    state: "Rajasthan",
    lat: 27.553,
    lng: 76.6346,
    phone: "+91 98678 90123",
    rating: 4.8,
    verified: true,
    experience: "NPOP Certified Organic",
    landSize: "22 Acres",
  },
];

export interface CropListing {
  id: string;
  farmerId: string;
  name: string;
  variety?: string;
  hindiName?: string;
  category: "Vegetables" | "Fruits" | "Grains & Pulses" | "Spices" | "Organic";
  quantityKg: number;
  pricePerKg: number;
  mandiPrice?: number;
  quality: "A" | "B" | "C";
  image: string;
  featured?: boolean;
  postedDate: string;
  description: string;
  harvestDate?: string;
  farmer: (typeof mockFarmers)[0];
  distanceKm?: number;
}

// Mock Crops (Listings) with authentic Indian farm produce imagery
export const mockListings: CropListing[] = [
  {
    id: "c1",
    farmerId: "f1",
    name: "Fresh Hybrid Red Tomatoes",
    variety: "Shimla Himsona F1",
    hindiName: "ताज़ा लाल टमाटर",
    category: "Vegetables",
    quantityKg: 450,
    pricePerKg: 24,
    mandiPrice: 28,
    quality: "A",
    featured: true,
    postedDate: "TODAY 6:00 AM",
    harvestDate: "Morning Harvest (6 AM)",
    description:
      "Hand-picked vine-ripened red tomatoes. Uniform firm texture with thick walls, low water loss, and great shelf life. Direct from Sonipat farm field.",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[0],
  },
  {
    id: "c2",
    farmerId: "f2",
    name: "Nasik High-Pungency Red Onions",
    variety: "Lasalgaon Garwa Special",
    hindiName: "नासिक लाल प्याज",
    category: "Vegetables",
    quantityKg: 1500,
    pricePerKg: 22,
    mandiPrice: 26,
    quality: "A",
    featured: true,
    postedDate: "YESTERDAY",
    harvestDate: "Sun-Cured Batch",
    description:
      "Well-cured, double-skinned Maharashtra red onions. High pungency, optimal dry matter, packed in 50 kg aerated breathable jute bags.",
    image:
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[1],
  },
  {
    id: "c3",
    farmerId: "f3",
    name: "Pure MP Sharbati Golden Wheat",
    variety: "Sehore Sharbati 306",
    hindiName: "गोल्डन शरबती गेहूं",
    category: "Grains & Pulses",
    quantityKg: 3500,
    pricePerKg: 34,
    mandiPrice: 39,
    quality: "A",
    featured: true,
    postedDate: "2 DAYS AGO",
    harvestDate: "Rabi Season Harvest",
    description:
      "Heavy golden grain Sharbati wheat, rainfed and organic soil grown. High gluten and sweet chapati taste. Machine-destoned and sorted.",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[2],
  },
  {
    id: "c4",
    farmerId: "f4",
    name: "Extra Long Grain 1121 Basmati Rice",
    variety: "1121 Steam Aged Extra Long",
    hindiName: "1121 बासमती चावल",
    category: "Grains & Pulses",
    quantityKg: 2000,
    pricePerKg: 78,
    mandiPrice: 88,
    quality: "A",
    featured: false,
    postedDate: "3 DAYS AGO",
    harvestDate: "2 Yrs Aged",
    description:
      "Aromatic 8.4mm raw grain length Basmati rice from the Terai foothills. Fluffy, non-sticky cooking with unmatched traditional aroma.",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[3],
  },
  {
    id: "c5",
    farmerId: "f5",
    name: "Fresh Farm Chipsona & Jyoti Potatoes",
    variety: "Kufri Chipsona Grade-1",
    hindiName: "आलू (चिप्सोना)",
    category: "Vegetables",
    quantityKg: 4000,
    pricePerKg: 16,
    mandiPrice: 20,
    quality: "A",
    featured: false,
    postedDate: "TODAY",
    harvestDate: "Fresh Dig Harvest",
    description:
      "Low-sugar, high-starch firm potatoes. Ideal for restaurants, frying chips, bulk catering, and long room temperature storage.",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[4],
  },
  {
    id: "c6",
    farmerId: "f6",
    name: "Desi Organic Farm Spinach (Palak)",
    variety: "All Green Broad Leaf",
    hindiName: "ताज़ा जैविक पालक",
    category: "Organic",
    quantityKg: 350,
    pricePerKg: 28,
    mandiPrice: 35,
    quality: "A",
    featured: true,
    postedDate: "TODAY 5:30 AM",
    harvestDate: "Pre-Dawn Cut",
    description:
      "100% chemical-free organic green spinach, grown with vermicompost and cow-dung manure. Washed in fresh borewell water.",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[5],
  },
  {
    id: "c7",
    farmerId: "f1",
    name: "Hot Dark Green G4 Spicy Chilies",
    variety: "Guntur / G4 Hot Express",
    hindiName: "तीखी हरी मिर्च",
    category: "Spices",
    quantityKg: 500,
    pricePerKg: 52,
    mandiPrice: 62,
    quality: "A",
    featured: false,
    postedDate: "YESTERDAY",
    harvestDate: "Daily Handpick",
    description:
      "Crisp, spicy green chillies with fresh green calyx stems intact. Cleaned and packed in 10 kg ventilated master crates.",
    image:
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[0],
  },
  {
    id: "c8",
    farmerId: "f2",
    name: "Sweet Winter Scarlet Red Carrots",
    variety: "Pusa Rudhira Desi Red",
    hindiName: "देसी लाल गाजर",
    category: "Vegetables",
    quantityKg: 1200,
    pricePerKg: 26,
    mandiPrice: 32,
    quality: "A",
    featured: false,
    postedDate: "YESTERDAY",
    harvestDate: "Washed & Sorted",
    description:
      "Crisp, naturally sweet red carrots with rich lycopene and carotene. Washed through hydro-coolers to lock in crisp freshness.",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[1],
  },
  {
    id: "c9",
    farmerId: "f3",
    name: "GI-Tagged Ratnagiri Alphonso Mangoes",
    variety: "Devgad Hapus A-Grade",
    hindiName: "रत्नागिरी हापूस आम",
    category: "Fruits",
    quantityKg: 800,
    pricePerKg: 190,
    mandiPrice: 240,
    quality: "A",
    featured: true,
    postedDate: "AUG 26",
    harvestDate: "Naturally Tree-Ripened",
    description:
      "Carbide-free, naturally straw-ripened authentic coastal Alphonso mangoes. Rich saffron pulp with intoxicating aroma.",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[2],
  },
  {
    id: "c10",
    farmerId: "f4",
    name: "Cold-Pressed Pusa Yellow Mustard Seeds",
    variety: "Pusa Mustard-30 High Oil",
    hindiName: "पीली सरसों (राई)",
    category: "Spices",
    quantityKg: 1100,
    pricePerKg: 68,
    mandiPrice: 78,
    quality: "A",
    featured: false,
    postedDate: "AUG 24",
    harvestDate: "Sun-Dried Batch",
    description:
      "High oil extraction yield (42%+), zero chemical polish. Excellent for virgin mustard oil expelling and culinary tempering.",
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[3],
  },
];

// Multi-Seller Commodity Data Model
export interface SellerListing {
  sellerId: string;
  farmerName: string;
  avatarUrl: string;
  rating: number; // 1.0 - 5.0
  grade: "Grade A" | "Grade B" | "Grade C";
  pricePerKg: number;
  availableStockKg: number;
  location: string;
  totalSales: string;
  distanceKm: number;
  variety: string;
  phone: string;
  harvestBadge?: string;
  bulkDiscountPercent?: number; // e.g. 5% or 10%
}

export interface MultiSellerCrop {
  cropId: string;
  cropName: string;
  hindiName: string;
  category: "Vegetables" | "Fruits" | "Grains & Pulses" | "Spices" | "Organic";
  image: string;
  mandiBenchmarkPrice: number;
  description: string;
  sellers: SellerListing[];
}

export function getGradeFromRating(
  rating: number,
): "Grade A" | "Grade B" | "Grade C" {
  if (rating >= 4.5) return "Grade A";
  if (rating >= 3.5) return "Grade B";
  return "Grade C";
}

// Multi-Seller Grouped Commodities Dataset
export const mockCommodities: MultiSellerCrop[] = [
  {
    cropId: "crop_tomato",
    cropName: "Tomato",
    hindiName: "लाल टमाटर",
    category: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
    mandiBenchmarkPrice: 28,
    description:
      "Daily morning harvested tomatoes. Ranging from export-grade firm salad tomatoes to processing-grade bulk sauce batches.",
    sellers: [
      {
        sellerId: "farm_tom_01",
        farmerName: "Rameshwar Patel (रामेश्वर पटेल)",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        rating: 4.9,
        grade: "Grade A",
        pricePerKg: 24,
        availableStockKg: 1500,
        location: "Sonipat Vegetable Belt (4 km away)",
        totalSales: "160+ orders fulfilled",
        distanceKm: 4,
        variety: "Shimla Himsona F1",
        phone: "+91 98123 45678",
        harvestBadge: "Morning 6 AM Harvest",
        bulkDiscountPercent: 8,
      },
      {
        sellerId: "farm_tom_02",
        farmerName: "Choudhary Balbir Farms",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rating: 4.1,
        grade: "Grade B",
        pricePerKg: 21,
        availableStockKg: 2800,
        location: "Karnal Farm Cluster (14 km away)",
        totalSales: "88+ orders fulfilled",
        distanceKm: 14,
        variety: "Desi Ratan Hybrid",
        phone: "+91 98567 89012",
        harvestBadge: "Standard Mandi Batch",
        bulkDiscountPercent: 5,
      },
      {
        sellerId: "farm_tom_03",
        farmerName: "Kisan Processing & Puree Unit",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        rating: 3.3,
        grade: "Grade C",
        pricePerKg: 16,
        availableStockKg: 4500,
        location: "Samudrapur Industrial Belt (22 km away)",
        totalSales: "210+ bulk dispatches",
        distanceKm: 22,
        variety: "Pulp & Puree Grade",
        phone: "+91 98456 78901",
        harvestBadge: "Canteen & Puree Grade",
        bulkDiscountPercent: 12,
      },
    ],
  },
  {
    cropId: "crop_onion",
    cropName: "Onion",
    hindiName: "लाल प्याज",
    category: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
    mandiBenchmarkPrice: 26,
    description:
      "Pungent, double-skinned red onions with extended shelf-life from Lasalgaon and Haryana agricultural belts.",
    sellers: [
      {
        sellerId: "farm_on_01",
        farmerName: "Suresh Patil & Sons (सुरेश पाटिल)",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        rating: 4.9,
        grade: "Grade A",
        pricePerKg: 22,
        availableStockKg: 3500,
        location: "Lasalgaon Mandi Hub (8 km away)",
        totalSales: "320+ orders fulfilled",
        distanceKm: 8,
        variety: "Garwa Special Red",
        phone: "+91 98234 56789",
        harvestBadge: "Sun-Cured Batch",
        bulkDiscountPercent: 10,
      },
      {
        sellerId: "farm_on_02",
        farmerName: "Kisan Vikas Agro FPO",
        avatarUrl:
          "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        rating: 3.9,
        grade: "Grade B",
        pricePerKg: 19,
        availableStockKg: 6000,
        location: "Sehore Agro Terminal (16 km away)",
        totalSales: "145+ orders fulfilled",
        distanceKm: 16,
        variety: "Medium Red Bulb",
        phone: "+91 98456 78901",
        harvestBadge: "Wholesale Mandi Ready",
        bulkDiscountPercent: 6,
      },
      {
        sellerId: "farm_on_03",
        farmerName: "Haryana Dehydrates & Flakes",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        rating: 3.1,
        grade: "Grade C",
        pricePerKg: 14,
        availableStockKg: 8000,
        location: "Rohtak Industrial Bypass (28 km away)",
        totalSales: "410+ tons sold",
        distanceKm: 28,
        variety: "Processing / Small Bulb",
        phone: "+91 98567 89012",
        harvestBadge: "Food Factory Grade",
        bulkDiscountPercent: 15,
      },
    ],
  },
  {
    cropId: "crop_potato",
    cropName: "Potato",
    hindiName: "आलू (चिप्सोना व ज्योति)",
    category: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
    mandiBenchmarkPrice: 20,
    description:
      "Firm, low-sugar potatoes suitable for household cooking, chips processing, and restaurant fries.",
    sellers: [
      {
        sellerId: "farm_pot_01",
        farmerName: "Choudhary Balbir Farms",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rating: 4.8,
        grade: "Grade A",
        pricePerKg: 16,
        availableStockKg: 5000,
        location: "Karnal Farm Cluster (10 km away)",
        totalSales: "190+ orders fulfilled",
        distanceKm: 10,
        variety: "Kufri Chipsona 1",
        phone: "+91 98567 89012",
        harvestBadge: "Fresh Dig Harvest",
        bulkDiscountPercent: 8,
      },
      {
        sellerId: "farm_pot_02",
        farmerName: "Rameshwar Patel Farms",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        rating: 4.2,
        grade: "Grade B",
        pricePerKg: 14,
        availableStockKg: 3500,
        location: "Sonipat Vegetable Belt (6 km away)",
        totalSales: "110+ orders fulfilled",
        distanceKm: 6,
        variety: "Kufri Jyoti Standard",
        phone: "+91 98123 45678",
        harvestBadge: "Daily Kitchen Grade",
        bulkDiscountPercent: 5,
      },
      {
        sellerId: "farm_pot_03",
        farmerName: "Agro Starch & Flakes Depot",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        rating: 3.2,
        grade: "Grade C",
        pricePerKg: 11,
        availableStockKg: 9500,
        location: "Panipat Agro Cluster (32 km away)",
        totalSales: "380+ orders fulfilled",
        distanceKm: 32,
        variety: "Starch & Mash Grade",
        phone: "+91 98345 67890",
        harvestBadge: "Bulk Starch Grade",
        bulkDiscountPercent: 12,
      },
    ],
  },
  {
    cropId: "crop_wheat",
    cropName: "Wheat",
    hindiName: "गोल्डन शरबती गेहूं",
    category: "Grains & Pulses",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
    mandiBenchmarkPrice: 39,
    description:
      "Golden grain heavy wheat directly from MP and Punjab fertile grain corridors. High protein, soft chapati quality.",
    sellers: [
      {
        sellerId: "farm_wh_01",
        farmerName: "Sardar Gurpreet Singh",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        rating: 4.9,
        grade: "Grade A",
        pricePerKg: 34,
        availableStockKg: 4200,
        location: "Samana Grain Corridor (7 km away)",
        totalSales: "270+ orders fulfilled",
        distanceKm: 7,
        variety: "MP Sharbati 306",
        phone: "+91 98345 67890",
        harvestBadge: "Double Cleaned & Destoned",
        bulkDiscountPercent: 5,
      },
      {
        sellerId: "farm_wh_02",
        farmerName: "Kisan Vikas FPO",
        avatarUrl:
          "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        rating: 4.3,
        grade: "Grade B",
        pricePerKg: 31,
        availableStockKg: 8500,
        location: "Sehore Agro Hub (18 km away)",
        totalSales: "180+ orders fulfilled",
        distanceKm: 18,
        variety: "Lokwan High Gluten",
        phone: "+91 98456 78901",
        harvestBadge: "Milling Grade 1",
        bulkDiscountPercent: 8,
      },
      {
        sellerId: "farm_wh_03",
        farmerName: "DoCA Cooperative Reserve",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        rating: 3.4,
        grade: "Grade C",
        pricePerKg: 27,
        availableStockKg: 12000,
        location: "Patiala Grain Silo (25 km away)",
        totalSales: "500+ tons sold",
        distanceKm: 25,
        variety: "Cattle Feed & General Flour",
        phone: "+91 98678 90123",
        harvestBadge: "Commercial Feed Grade",
        bulkDiscountPercent: 10,
      },
    ],
  },
  {
    cropId: "crop_rice",
    cropName: "Basmati Rice",
    hindiName: "1121 बासमती चावल",
    category: "Grains & Pulses",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
    mandiBenchmarkPrice: 88,
    description:
      "Aged 1121 steam Basmati rice with 8.4mm extra long grain length. Non-sticky, fragrant cooking.",
    sellers: [
      {
        sellerId: "farm_rc_01",
        farmerName: "Kisan Vikas FPO",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        rating: 4.8,
        grade: "Grade A",
        pricePerKg: 78,
        availableStockKg: 3000,
        location: "Terai Foothills Hub (12 km away)",
        totalSales: "210+ orders fulfilled",
        distanceKm: 12,
        variety: "1121 Steam 2 Yrs Aged",
        phone: "+91 98456 78901",
        harvestBadge: "Royal Feast Grade",
        bulkDiscountPercent: 7,
      },
      {
        sellerId: "farm_rc_02",
        farmerName: "Sardar Gurpreet Singh",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        rating: 4.0,
        grade: "Grade B",
        pricePerKg: 68,
        availableStockKg: 4500,
        location: "Samana Grain Corridor (9 km away)",
        totalSales: "130+ orders fulfilled",
        distanceKm: 9,
        variety: "Pusa Basmati 1509",
        phone: "+91 98345 67890",
        harvestBadge: "Daily Kitchen Basmati",
        bulkDiscountPercent: 5,
      },
    ],
  },
  {
    cropId: "crop_spinach",
    cropName: "Organic Spinach (Palak)",
    hindiName: "ताज़ा जैविक पालक",
    category: "Organic",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80",
    mandiBenchmarkPrice: 35,
    description:
      "Chemical-free dark green tender spinach leaves, harvested at 5:00 AM for maximum crispness and zero moisture wilt.",
    sellers: [
      {
        sellerId: "farm_sp_01",
        farmerName: "Jaivik Krishi Kendra (जैविक केंद्र)",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        rating: 4.9,
        grade: "Grade A",
        pricePerKg: 28,
        availableStockKg: 450,
        location: "Alwar Organic Cluster (5 km away)",
        totalSales: "190+ orders fulfilled",
        distanceKm: 5,
        variety: "All Green Broad Leaf",
        phone: "+91 98678 90123",
        harvestBadge: "100% NPOP Certified",
        bulkDiscountPercent: 6,
      },
      {
        sellerId: "farm_sp_02",
        farmerName: "Rameshwar Patel Farms",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rating: 4.2,
        grade: "Grade B",
        pricePerKg: 23,
        availableStockKg: 800,
        location: "Sonipat Vegetable Belt (6 km away)",
        totalSales: "95+ orders fulfilled",
        distanceKm: 6,
        variety: "Desi Palak Standard",
        phone: "+91 98123 45678",
        harvestBadge: "Morning Farm Ready",
        bulkDiscountPercent: 5,
      },
    ],
  },
  {
    cropId: "crop_mango",
    cropName: "Ratnagiri Alphonso Mango",
    hindiName: "हापूस आम",
    category: "Fruits",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
    mandiBenchmarkPrice: 240,
    description:
      "Carbide-free naturally straw-ripened GI-tagged Devgad & Ratnagiri Alphonso mangoes. Golden pulp and royal sweetness.",
    sellers: [
      {
        sellerId: "farm_mg_01",
        farmerName: "Sardar Gurpreet Singh",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        rating: 4.9,
        grade: "Grade A",
        pricePerKg: 190,
        availableStockKg: 800,
        location: "Devgad Orchard Cluster (15 km away)",
        totalSales: "180+ orders fulfilled",
        distanceKm: 15,
        variety: "Devgad Hapus Grade 1",
        phone: "+91 98345 67890",
        harvestBadge: "Naturally Straw Ripened",
        bulkDiscountPercent: 10,
      },
      {
        sellerId: "farm_mg_02",
        farmerName: "Konkan Kisan Sahakari",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        rating: 4.1,
        grade: "Grade B",
        pricePerKg: 160,
        availableStockKg: 1500,
        location: "Ratnagiri Mandi Hub (20 km away)",
        totalSales: "120+ orders fulfilled",
        distanceKm: 20,
        variety: "Medium Sized Hapus",
        phone: "+91 98234 56789",
        harvestBadge: "Export Grade B",
        bulkDiscountPercent: 6,
      },
      {
        sellerId: "farm_mg_03",
        farmerName: "Agro Pulp & Juice Terminal",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        rating: 3.2,
        grade: "Grade C",
        pricePerKg: 110,
        availableStockKg: 3000,
        location: "MIDC Processing Corridor (30 km away)",
        totalSales: "260+ bulk crates sold",
        distanceKm: 30,
        variety: "Mango Pulp & Shake Grade",
        phone: "+91 98456 78901",
        harvestBadge: "Juice & Aamras Grade",
        bulkDiscountPercent: 15,
      },
    ],
  },
  {
    cropId: "crop_chilies",
    cropName: "Spicy Green Chilies",
    hindiName: "तीखी हरी मिर्च",
    category: "Spices",
    image:
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80",
    mandiBenchmarkPrice: 62,
    description:
      "High-pungency dark green fresh chillies with green calyx stems intact. Packed in ventilated 10kg master crates.",
    sellers: [
      {
        sellerId: "farm_ch_01",
        farmerName: "Rameshwar Patel Farms",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        rating: 4.8,
        grade: "Grade A",
        pricePerKg: 52,
        availableStockKg: 600,
        location: "Sonipat Vegetable Belt (4 km away)",
        totalSales: "135+ orders fulfilled",
        distanceKm: 4,
        variety: "G4 Hot Express",
        phone: "+91 98123 45678",
        harvestBadge: "Crisp Green Calyx",
        bulkDiscountPercent: 5,
      },
      {
        sellerId: "farm_ch_02",
        farmerName: "Choudhary Balbir Farms",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rating: 4.0,
        grade: "Grade B",
        pricePerKg: 46,
        availableStockKg: 1100,
        location: "Karnal Farm Cluster (12 km away)",
        totalSales: "90+ orders fulfilled",
        distanceKm: 12,
        variety: "Local Pusa Jwala",
        phone: "+91 98567 89012",
        harvestBadge: "Standard Hot Batch",
        bulkDiscountPercent: 8,
      },
    ],
  },
];

// Mock API responses
export const mockApi = {
  // 1. AI Recommendation (called from Farmer form)
  getAIRecommendation: (cropName: string, price: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isHotWeather = true; // mock logic
        const action = isHotWeather ? "SELL_NOW" : "HOLD";
        const suggestedPrice = isHotWeather ? price * 0.95 : price * 1.1;
        resolve({
          action,
          suggestedPrice: Math.round(suggestedPrice * 100) / 100,
          confidence: 85,
          message: isHotWeather
            ? "🌡️ High temperature forecast in mandi belt. Demand steady. Sell now!"
            : "📈 Strong demand expected in Azadpur mandi. Hold for better price.",
        });
      }, 700);
    });
  },

  // 2. Multi-Seller Commodities (called from Buyer marketplace)
  getNearbyCommodities: (lat: number, lng: number, radius: number) => {
    return new Promise<MultiSellerCrop[]>((resolve) => {
      setTimeout(() => {
        const results = mockCommodities
          .map((commodity) => {
            // Filter sellers based on distance
            const filteredSellers = commodity.sellers.filter(
              (seller) => seller.distanceKm <= radius,
            );
            return {
              ...commodity,
              sellers: filteredSellers,
            };
          })
          .filter((commodity) => commodity.sellers.length > 0);
        resolve(results);
      }, 350);
    });
  },

  // 3. Nearby Listings (backward compatibility)
  getNearbyListings: (lat: number, lng: number, radius: number) => {
    return new Promise<CropListing[]>((resolve) => {
      setTimeout(() => {
        const results = mockListings
          .map((crop, idx) => ({
            ...crop,
            distanceKm: Math.max(
              2,
              Math.min(radius, ((idx * 7 + 3) % (radius || 20)) + 1),
            ),
          }))
          .filter((crop) => crop.distanceKm <= radius)
          .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
        resolve(results);
      }, 400);
    });
  },

  // 4. Bulk Order Aggregation (the "1000kg" magic)
  aggregateOrder: (cropName: string, quantity: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const splits = [
          {
            farmerName: "Rameshwar Patel Farms",
            quantity: Math.round(quantity * 0.4),
            pricePerKg: 24,
            distance: 4.2,
          },
          {
            farmerName: "Choudhary Balbir Farms",
            quantity: Math.round(quantity * 0.35),
            pricePerKg: 21,
            distance: 8.5,
          },
          {
            farmerName: "Sardar Gurpreet Singh",
            quantity: Math.round(quantity * 0.25),
            pricePerKg: 26,
            distance: 12.1,
          },
        ];
        const totalPrice = splits.reduce(
          (sum, s) => sum + s.quantity * s.pricePerKg,
          0,
        );
        resolve({
          orderId: "AGRI-" + Date.now(),
          totalQuantity: quantity,
          totalPrice,
          splits,
          status: "AGGREGATED",
        });
      }, 800);
    });
  },

  // 5. Rider Assignment (Swiggy-style)
  assignRider: (orderId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          riderName: "Vikram Singh (विक्रम सिंह)",
          riderPhone: "+91 98765 43210",
          vehicle: "Electric Mini Truck (Tata Ace)",
          etaMinutes: 18,
          routePolyline: "encoded_polyline_here",
        });
      }, 800);
    });
  },
};
