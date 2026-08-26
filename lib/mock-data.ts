// lib/mock-data.ts

// Mock Farmers (with lat/lng near Delhi)
export const mockFarmers = [
  { id: "f1", name: "Ramesh Farm", lat: 28.6139, lng: 77.209 },
  { id: "f2", name: "Suresh Agro", lat: 28.7041, lng: 77.1025 },
  { id: "f3", name: "Gurpreet Farms", lat: 28.659, lng: 77.132 },
];

// Mock Crops (Listings)
export const mockListings = [
  {
    id: "c1",
    farmerId: "f1",
    name: "Tomato",
    quantityKg: 400,
    pricePerKg: 25,
    quality: "A",
    farmer: mockFarmers[0],
  },
  {
    id: "c2",
    farmerId: "f2",
    name: "Tomato",
    quantityKg: 350,
    pricePerKg: 22,
    quality: "A",
    farmer: mockFarmers[1],
  },
  {
    id: "c3",
    farmerId: "f3",
    name: "Tomato",
    quantityKg: 250,
    pricePerKg: 28,
    quality: "B",
    farmer: mockFarmers[2],
  },
  {
    id: "c4",
    farmerId: "f1",
    name: "Onion",
    quantityKg: 200,
    pricePerKg: 15,
    quality: "B",
    farmer: mockFarmers[0],
  },
  {
    id: "c5",
    farmerId: "f2",
    name: "Wheat",
    quantityKg: 500,
    pricePerKg: 30,
    quality: "A",
    farmer: mockFarmers[1],
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
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter mockListings and add distance
        const results = mockListings
          .map((crop) => ({
            ...crop,
            distanceKm: Math.floor(Math.random() * radius) + 1, // Simulate random distance
          }))
          .filter((crop) => crop.distanceKm <= radius)
          .sort((a, b) => a.distanceKm - b.distanceKm);
        resolve(results);
      }, 600);
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
            quantity: 400,
            pricePerKg: 25,
            distance: 4.2,
          },
          {
            farmerName: "Suresh Agro",
            quantity: 350,
            pricePerKg: 22,
            distance: 8.5,
          },
          {
            farmerName: "Gurpreet Farms",
            quantity: 250,
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
      }, 1000);
    });
  },

  // 4. Rider Assignment (Swiggy-style)
  assignRider: (orderId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          riderName: "Vikram Singh",
          riderPhone: "+91 98765 43210",
          vehicle: "Bike",
          etaMinutes: 18,
          routePolyline: "encoded_polyline_here", // mock
        });
      }, 800);
    });
  },
};
