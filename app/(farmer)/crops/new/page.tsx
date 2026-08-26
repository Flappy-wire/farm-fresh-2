'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Zod validation schema
const cropSchema = z.object({
    name: z.string().min(1, 'Crop name is required'),
    quantityKg: z.number().min(1, 'Quantity must be > 0'),
    pricePerKg: z.number().min(1, 'Price is required'),
    quality: z.enum(['A', 'B', 'C']),
});

type CropForm = z.infer<typeof cropSchema>;

export default function NewCropPage() {
    const [aiSuggestion, setAiSuggestion] = useState<{ action: string; suggestedPrice: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<CropForm>({
        resolver: zodResolver(cropSchema),
    });

    const onSubmit = async (data: CropForm) => {
        setLoading(true);
        try {
            // 1. Get AI recommendation (calls our Python FastAPI microservice via NestJS proxy)
            const recRes = await api.post('/ai/recommend', {
                cropName: data.name,
                currentPrice: data.pricePerKg,
                // lat/lng grabbed from user's browser geolocation
            });
            setAiSuggestion(recRes.data);

            // 2. If user confirms, list the crop in the database
            // await api.post('/crops', { ...data, suggestedPrice: recRes.data.suggestedPrice });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>🌾 List Your Crop</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input {...register('name')} placeholder="Crop name (e.g., Tomato)" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                        <Input type="number" {...register('quantityKg', { valueAsNumber: true })} placeholder="Quantity (kg)" />

                        <Input type="number" {...register('pricePerKg', { valueAsNumber: true })} placeholder="Your price per kg" />

                        <select {...register('quality')} className="w-full p-2 border rounded">
                            <option value="A">Grade A</option>
                            <option value="B">Grade B</option>
                            <option value="C">Grade C</option>
                        </select>

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Analyzing Market...' : 'Get AI Suggestion'}
                        </Button>
                    </form>

                    {/* AI Recommendation Output */}
                    {aiSuggestion && (
                        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <h3 className="font-bold">🤖 AI Market Insight</h3>
                            <p>Action: <span className="font-bold">{aiSuggestion.action}</span></p>
                            <p>Suggested Price: ₹{aiSuggestion.suggestedPrice}/kg</p>
                            <Button className="mt-2" variant="outline">
                                List at Suggested Price
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}