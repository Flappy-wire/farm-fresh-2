"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { mockApi } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function RiderDeliveries() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching pending orders every 10 seconds (like Swiggy)
    const fetchOrders = async () => {
      const data = await mockApi.getNearbyListings(28.6, 77.2, 30);
      // Mock converting crops into "deliveries"
      const mapped = data.slice(0, 3).map((crop: any) => ({
        id: crop.id,
        pickup: crop.farmer.name,
        dropoff: "Buyer Location",
        distance: `${crop.distanceKm} km`,
        status: "PENDING",
      }));
      setOrders(mapped);
      setLoading(false);
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🛵 Nearby Delivery Requests</h1>
      {orders.map((order) => (
        <Card key={order.id} className="mb-4 hover:shadow-lg transition">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="font-bold">
                {order.pickup} → {order.dropoff}
              </p>
              <p className="text-sm text-gray-500">{order.distance} away</p>
            </div>
            <Button variant="default" size="sm">
              Accept Order
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
