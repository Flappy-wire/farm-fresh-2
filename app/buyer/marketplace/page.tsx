"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function Marketplace() {
  const [listings, setListings] = useState<any[]>([]);
  const [radius, setRadius] = useState(20);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const defaultLocation = { lat: 28.6139, lng: 77.209 };

  // Safe handler: parse to number, fallback to 20
  const handleRadiusChange = (value: number[]) => {
    const newRadius = Number(value[0]);
    if (!isNaN(newRadius) && newRadius >= 5 && newRadius <= 100) {
      setRadius(newRadius);
    } else {
      setRadius(20); // fallback
    }
  };

  useEffect(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await mockApi.getNearbyListings(
            pos.coords.latitude,
            pos.coords.longitude,
            radius,
          );
          setListings(data);
          setLocationError(null);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      async (err) => {
        console.warn("Geolocation error, using fallback:", err);
        try {
          const data = await mockApi.getNearbyListings(
            defaultLocation.lat,
            defaultLocation.lng,
            radius,
          );
          setListings(data);
          setLocationError(
            "Location access denied. Showing nearby listings from Delhi.",
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    );
  }, [radius]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <span className="font-medium">Radius: {radius} km</span>
        <Slider
          min={5}
          max={100}
          step={5}
          value={[isNaN(radius) ? 20 : radius]} // guard against NaN
          onValueChange={handleRadiusChange}
          className="w-48"
        />
        {locationError && (
          <span className="text-xs text-amber-600 ml-2">{locationError}</span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading nearby listings...
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No crops found within {radius} km. Try increasing the radius.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((crop: any) => (
            <Card key={crop.id} className="hover:shadow-lg transition">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-green-800">
                  {crop.name}
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{crop.quantityKg} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price</span>
                  <span className="text-green-600 font-bold">
                    ₹{crop.pricePerKg}/kg
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance</span>
                  <span className="text-gray-700">
                    {crop.distanceKm} km away
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Grade</span>
                  <span className="font-medium">{crop.quality}</span>
                </div>
                <Button className="w-full mt-2" variant="default">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
