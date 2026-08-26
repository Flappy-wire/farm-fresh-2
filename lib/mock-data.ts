// lib/mock-data.ts

// Mock Farmers (with lat/lng near Delhi & Haryana region)
export const mockFarmers = [
  {
    id: "f1",
    name: "Ramesh Farm",
    location: "NAKHULA GRANT, JAGIROAD",
    state: "Assam",
    lat: 28.6139,
    lng: 77.209,
    phone: "+91 98123 45678",
    rating: 4.8,
    verified: true,
  },
  {
    id: "f2",
    name: "Suresh Agro Tech",
    location: "SECTOR 25, NOIDA",
    state: "Uttar Pradesh",
    lat: 28.7041,
    lng: 77.1025,
    phone: "+91 98234 56789",
    rating: 4.9,
    verified: true,
  },
  {
    id: "f3",
    name: "Gurpreet Organic Farms",
    location: "SAMUDRAPUR, MAHARASHTRA",
    state: "Maharashtra",
    lat: 28.659,
    lng: 77.132,
    phone: "+91 98345 67890",
    rating: 4.7,
    verified: true,
  },
  {
    id: "f4",
    name: "Kisan Vikas Sangh",
    location: "SAMUDRAPUR MIDC, MAHARASHTRA",
    state: "Maharashtra",
    lat: 28.58,
    lng: 77.25,
    phone: "+91 98456 78901",
    rating: 4.6,
    verified: true,
  },
  {
    id: "f5",
    name: "Choudhary Farms",
    location: "SONIPAT RURAL, HARYANA",
    state: "Haryana",
    lat: 28.75,
    lng: 77.15,
    phone: "+91 98567 89012",
    rating: 4.9,
    verified: true,
  },
  {
    id: "f6",
    name: "Green Valley Organics",
    location: "ALWAR ROAD, RAJASTHAN",
    state: "Rajasthan",
    lat: 28.52,
    lng: 77.05,
    phone: "+91 98678 90123",
    rating: 4.8,
    verified: true,
  },
];

export interface CropListing {
  id: string;
  farmerId: string;
  name: string;
  variety?: string;
  category: "Vegetables" | "Fruits" | "Grains & Pulses" | "Spices" | "Organic";
  quantityKg: number;
  pricePerKg: number;
  quality: "A" | "B" | "C";
  image: string;
  featured?: boolean;
  postedDate: string;
  description: string;
  farmer: (typeof mockFarmers)[0];
  distanceKm?: number;
}

// Mock Crops (Listings) with OLX-like details & images
export const mockListings: CropListing[] = [
  {
    id: "c1",
    farmerId: "f1",
    name: "Fresh Hybrid Red Tomatoes",
    variety: "Shimla Hybrid F1",
    category: "Vegetables",
    quantityKg: 400,
    pricePerKg: 25,
    quality: "A",
    featured: true,
    postedDate: "JUL 26",
    description:
      "Export grade ripe juicy tomatoes, hand-picked daily morning. Ideal for mandi wholesalers and restaurants.",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[0],
  },
  {
    id: "c2",
    farmerId: "f2",
    name: "Nasik Red Onions (Medium-Large)",
    variety: "Nasik High Pungency",
    category: "Vegetables",
    quantityKg: 1200,
    pricePerKg: 22,
    quality: "A",
    featured: true,
    postedDate: "AUG 12",
    description:
      "Sun-dried and well-cured red onions. Extended shelf life of 60+ days. Available in 50kg jute sacks.",
    image:
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[1],
  },
  {
    id: "c3",
    farmerId: "f3",
    name: "Pure Sharbati Golden Wheat",
    variety: "MP Sharbati 306",
    category: "Grains & Pulses",
    quantityKg: 2500,
    pricePerKg: 34,
    quality: "A",
    featured: false,
    postedDate: "YESTERDAY",
    description:
      "Premium MP Sharbati wheat, heavy golden grains with high protein content, double cleaned and destoned.",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[2],
  },
  {
    id: "c4",
    farmerId: "f4",
    name: "1121 Traditional Basmati Rice",
    variety: "1121 Steam Extra Long",
    category: "Grains & Pulses",
    quantityKg: 1500,
    pricePerKg: 78,
    quality: "A",
    featured: false,
    postedDate: "YESTERDAY",
    description:
      "Aromatic 8.35mm grain length Basmati rice. Aged 1.5 years for rich aroma and non-sticky fluffy cooking.",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[3],
  },
  {
    id: "c5",
    farmerId: "f5",
    name: "Chipsona Fresh Farm Potatoes",
    variety: "Kufri Chipsona 1",
    category: "Vegetables",
    quantityKg: 3000,
    pricePerKg: 16,
    quality: "A",
    featured: false,
    postedDate: "2 DAYS AGO",
    description:
      "Low sugar, high dry-matter potatoes perfect for commercial french fries, chips, and restaurant frying.",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[4],
  },
  {
    id: "c6",
    farmerId: "f6",
    name: "Certified Organic Farm Spinach",
    variety: "Desi Palak Organic",
    category: "Organic",
    quantityKg: 300,
    pricePerKg: 30,
    quality: "A",
    featured: false,
    postedDate: "AUG 17",
    description:
      "100% pesticide-free, hydroponic & soil organic spinach leaves harvested 3 hours prior to dispatch.",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[5],
  },
  {
    id: "c7",
    farmerId: "f1",
    name: "Spicy Dark Green G4 Chilies",
    variety: "G4 Hot Express",
    category: "Spices",
    quantityKg: 450,
    pricePerKg: 52,
    quality: "A",
    featured: false,
    postedDate: "AUG 13",
    description:
      "Freshly picked pungent dark green chillies with crisp stems. Graded and packed in ventilated crates.",
    image:
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[0],
  },
  {
    id: "c8",
    farmerId: "f2",
    name: "Crisp Red Winter Carrots",
    variety: "Nantes Scarlet Red",
    category: "Vegetables",
    quantityKg: 800,
    pricePerKg: 28,
    quality: "B",
    featured: false,
    postedDate: "AUG 22",
    description:
      "Sweet juicy farm-washed red carrots. Uniform size, excellent for juicing and retail packaging.",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[1],
  },
  {
    id: "c9",
    farmerId: "f3",
    name: "Ratnagiri Alphonso Mangoes",
    variety: "Hapus Grade 1",
    category: "Fruits",
    quantityKg: 600,
    pricePerKg: 180,
    quality: "A",
    featured: true,
    postedDate: "AUG 24",
    description:
      "Naturally ripened GI-tagged Ratnagiri Alphonso mangoes in straw packing. Sweet, fiberless golden pulp.",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[2],
  },
  {
    id: "c10",
    farmerId: "f4",
    name: "Organic Yellow Mustard Seeds",
    variety: "Brassica Pusa Mustard",
    category: "Spices",
    quantityKg: 900,
    pricePerKg: 65,
    quality: "A",
    featured: false,
    postedDate: "AUG 20",
    description:
      "High oil content (42%+) mustard seeds, sun-dried on cement thrash floor, zero moisture residue.",
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[3],
  },
  {
    id: "c11",
    farmerId: "f5",
    name: "Fresh Snowball Cauliflower",
    variety: "Snowball 16 White",
    category: "Vegetables",
    quantityKg: 750,
    pricePerKg: 24,
    quality: "B",
    featured: false,
    postedDate: "YESTERDAY",
    description:
      "Solid white heads with fresh green wrapping leaves. Direct farm harvest with zero pesticide spray 10 days before cut.",
    image:
      "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80",
    farmer: mockFarmers[4],
  },
  {
    id: "c12",
    farmerId: "f6",
    name: "Organic Desi Chickpeas (Chana)",
    variety: "Desi Bold Brown",
    category: "Grains & Pulses",
    quantityKg: 1800,
    pricePerKg: 72,
    quality: "A",
    featured: false,
    postedDate: "AUG 18",
    description:
      "Native heirloom brown chickpeas. High protein (22%), ideal for flour milling or wholesale packaged sales.",
    image:
      "https://images.unsplash.com/photo-1585996659050-593685984620?w=600&auto=format&fit=crop&q=80",
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
