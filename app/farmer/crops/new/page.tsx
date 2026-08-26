"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockApi } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Zod validation schema
const cropSchema = z.object({
  name: z.string().min(1, "Crop name is required"),
  quantityKg: z.number().min(1, "Quantity must be > 0"),
  pricePerKg: z.number().min(1, "Price is required"),
  quality: z.enum(["A", "B", "C"]),
});

type CropForm = z.infer<typeof cropSchema>;

export default function NewCropPage() {
  const [aiSuggestion, setAiSuggestion] = useState<{
    action: string;
    suggestedPrice: number;
    confidence: number;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [listed, setListed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CropForm>({
    resolver: zodResolver(cropSchema),
  });

  const onSubmit = async (data: CropForm) => {
    setLoading(true);
    try {
      // 1. Get AI recommendation (mocked)
      const recRes = await mockApi.getAIRecommendation(
        data.name,
        data.pricePerKg,
      );
      setAiSuggestion(recRes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleListAtSuggested = () => {
    setListed(true);
    // In a real app, you'd POST to /crops here
    setTimeout(() => {
      alert("✅ Crop listed successfully at suggested price!");
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🌾 List Your Crop</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("name")}
                placeholder="Crop name (e.g., Tomato)"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="number"
                {...register("quantityKg", { valueAsNumber: true })}
                placeholder="Quantity (kg)"
              />
              {errors.quantityKg && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.quantityKg.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="number"
                {...register("pricePerKg", { valueAsNumber: true })}
                placeholder="Your price per kg (₹)"
              />
              {errors.pricePerKg && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pricePerKg.message}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("quality")}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
              {errors.quality && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.quality.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Analyzing Market..." : "🤖 Get AI Suggestion"}
            </Button>
          </form>

          {/* AI Recommendation Output */}
          {aiSuggestion && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">🤖 AI Market Insight</h3>
                <Badge variant="outline" className="text-blue-600">
                  Confidence: {aiSuggestion.confidence}%
                </Badge>
              </div>
              <p className="text-sm text-gray-700">{aiSuggestion.message}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Action:</span>
                  <span
                    className={`ml-2 font-bold ${
                      aiSuggestion.action === "SELL_NOW"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {aiSuggestion.action}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Suggested Price:</span>
                  <span className="ml-2 font-bold">
                    ₹{aiSuggestion.suggestedPrice}/kg
                  </span>
                </div>
              </div>
              {!listed ? (
                <Button
                  className="mt-2 w-full"
                  variant="default"
                  onClick={handleListAtSuggested}
                >
                  ✅ List at Suggested Price
                </Button>
              ) : (
                <Badge className="mt-2 w-full justify-center bg-green-100 text-green-800 border-green-300">
                  🎉 Listed successfully!
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
