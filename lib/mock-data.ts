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
  {
    id: "c11",
    farmerId: "f5",
    name: "Crisp Farm Snowball Cauliflower",
    variety: "Snowball 16 Pusa White",
    hindiName: "ताज़ा फूलगोभी",
    category: "Vegetables",
    quantityKg: 900,
    pricePerKg: 24,
    mandiPrice: 30,
    quality: "B",
    featured: false,
    postedDate: "TODAY",
    harvestDate: "Morning Harvest",
    description:
      "Pure white compact curd heads protected by green jacket leaves. Crisp and pesticide-free, graded for restaurant and household consumption.",
    image:
      "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[4],
  },
  {
    id: "c12",
    farmerId: "f6",
    name: "High-Protein Heirloom Desi Chana (Chickpeas)",
    variety: "Kathiawar Bold Brown",
    hindiName: "देसी भूरा चना",
    category: "Grains & Pulses",
    quantityKg: 2200,
    pricePerKg: 72,
    mandiPrice: 82,
    quality: "A",
    featured: false,
    postedDate: "AUG 22",
    harvestDate: "Organic Field Harvest",
    description:
      "Native unpolished brown chickpeas packed with 22% natural plant protein. Perfect for flour milling (besan) or wholesale distribution.",
    image:
      "https://images.unsplash.com/photo-1585996659050-593685984620?w=800&auto=format&fit=crop&q=80",
    farmer: mockFarmers[5],
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
            ? "🌡️ High temperature forecast. Prices may drop. Sell now!"
            : "📈 Strong demand expected. Hold for better price.",
        });
      }, 700);
    });
  },

  // 2. Nearby Listings (called from Buyer marketplace)
  getNearbyListings: (lat: number, lng: number, radius: number) => {
    return new Promise<CropListing[]>((resolve) => {
      setTimeout(() => {
        // Filter mockListings and add distance
        const results = mockListings
          .map((crop, idx) => ({
            ...crop,
            // deterministic smooth distance simulation
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

  // 3. Bulk Order Aggregation (the "1000kg" magic)
  aggregateOrder: (cropName: string, quantity: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate splitting 1000kg among 3 farmers
        const splits = [
          {
            farmerName: "Ramesh Farm",
            quantity: Math.round(quantity * 0.4),
            pricePerKg: 25,
            distance: 4.2,
          },
          {
            farmerName: "Suresh Agro Tech",
            quantity: Math.round(quantity * 0.35),
            pricePerKg: 22,
            distance: 8.5,
          },
          {
            farmerName: "Gurpreet Organic Farms",
            quantity: Math.round(quantity * 0.25),
            pricePerKg: 28,
            distance: 12.1,
          },
        ];
        const totalPrice = splits.reduce(
          (sum, s) => sum + s.quantity * s.pricePerKg,
          0,
        );
        resolve({
          orderId: "ORD-" + Date.now(),
          totalQuantity: quantity,
          totalPrice,
          splits,
          status: "AGGREGATED",
        });
      }, 800);
    });
  },

  // 4. Rider Assignment (Swiggy-style)
  assignRider: (orderId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          riderName: "Vikram Singh",
          riderPhone: "+91 98765 43210",
          vehicle: "Electric Mini Truck (Tata Ace)",
          etaMinutes: 18,
          routePolyline: "encoded_polyline_here", // mock
        });
      }, 800);
    });
  },
};
