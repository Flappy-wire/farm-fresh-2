"use client";

import { useState } from "react";
import { mockApi } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Install if needed: npx shadcn@latest add badge

export default function BulkOrderPage() {
  const [quantity, setQuantity] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const handleBulkOrder = async () => {
    setLoading(true);
    const result = await mockApi.aggregateOrder("Tomato", quantity);
    setOrder(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">
        🚜 Bulk Order Aggregation
      </h1>
      <p className="text-gray-600">
        Buy large quantities. We automatically split across nearby farmers.
      </p>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium">Quantity (kg)</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <Button onClick={handleBulkOrder} disabled={loading} size="lg">
          {loading ? "Aggregating..." : "🚀 Find Best Sources"}
        </Button>
      </div>

      {order && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Order #{order.orderId}</span>
              <Badge variant="outline" className="text-green-600">
                AGGREGATED
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Qty</p>
                <p className="font-bold text-xl">{order.totalQuantity} kg</p>
              </div>
              <div>
                <p className="text-gray-500">Total Price</p>
                <p className="font-bold text-xl text-green-600">
                  ₹{order.totalPrice}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Farmers</p>
                <p className="font-bold text-xl">{order.splits.length}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">📦 Sourcing Breakdown</h4>
              {order.splits.map((split: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2"
                >
                  <span className="font-medium">{split.farmerName}</span>
                  <span>
                    {split.quantity} kg @ ₹{split.pricePerKg}/kg
                  </span>
                  <Badge>{split.distance} km away</Badge>
                </div>
              ))}
            </div>

            {/* Simulate Rider Assignment */}
            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={async () => {
                const rider = await mockApi.assignRider(order.orderId);
                alert(
                  `✅ Rider ${rider.riderName} assigned! ETA: ${rider.etaMinutes} mins.`,
                );
              }}
            >
              🛵 Assign Optimal Rider (Demo)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
