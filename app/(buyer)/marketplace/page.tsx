'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export default function Marketplace() {
    const [listings, setListings] = useState([]);
    const [radius, setRadius] = useState(20);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const res = await api.get('/crops/nearby', {
                params: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    radius: radius,
                },
            });

            setListings(res.data);
        });
    }, [radius]);

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <span>Radius: {radius} km</span>

                <Slider
                    min={5}
                    max={100}
                    step={5}
                    value={radius}
                    onValueChange={(value) => {
                        if (typeof value === 'number') {
                            setRadius(value);
                        }
                    }}
                    className="w-48"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {listings.map((crop: any) => (
                    <Card
                        key={crop.id}
                        className="hover:shadow-lg transition"
                    >
                        <CardContent className="p-4">
                            <h3 className="text-xl font-semibold">
                                {crop.name}
                            </h3>

                            <p>Quantity: {crop.quantityKg} kg</p>

                            <p className="text-green-600 font-bold">
                                ₹{crop.pricePerKg}/kg
                            </p>

                            <p className="text-sm text-gray-500">
                                {crop.farmer.distance} km away
                            </p>

                            <Button
                                className="w-full mt-2"
                                variant="default"
                            >
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}