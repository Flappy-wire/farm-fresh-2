import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <h1 className="text-5xl font-bold text-green-800 dark:text-green-400 mb-4">
        🌾 AgriConnect
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
        AI-powered Marketplace for Farmers, Buyers & Riders
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <Link href="/farmer/crops/new">
          <Button className="w-full h-20 text-lg">🧑‍🌾 Farmer (List Crop)</Button>
        </Link>
        <Link href="/buyer/marketplace">
          <Button className="w-full h-20 text-lg">
            🛒 Buyer (Marketplace)
          </Button>
        </Link>
        <Link href="/buyer/bulk-order">
          <Button className="w-full h-20 text-lg">
            📦 Bulk Order (1,000kg)
          </Button>
        </Link>
        <Link href="/rider/deliveries">
          <Button variant="outline" className="w-full h-20 text-lg">
            🛵 Rider Dashboard
          </Button>
        </Link>
      </div>

      <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg max-w-2xl text-center">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          🚀 Hackathon Demo: All data is mocked. No backend required. Click the
          "Assign Optimal Rider" button to see the AI magic.
        </p>
      </div>
    </div>
  );
}
