"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  MapPin,
  Truck,
  Sparkles,
  ShieldCheck,
  Check,
  Store,
  Grid,
  Globe,
  Layers,
  ChevronDown,
  User,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "farmer" | "buyer" | "rider" | "fpo"
  >("farmer");

  const tabContents = {
    farmer: {
      title: "List crops, get real-time price intelligence.",
      desc: "Our Farmer Interface enables farmers and FPOs to list crops, quantity, quality grade, location, and current stock. The integrated AI analyzes market prices, local demand, and weather forecasts to recommend a 'Sell Now' or 'Hold' action along with the recommended selling price.",
      bullets: [
        "Eliminate middleman margins and sell directly to consumers.",
        "Get instant recommendations based on mandi data.",
        "Request pickup with optimized transport coordination.",
      ],
      link: "/farmer/crops/new",
      cta: "Access Farmer Portal",
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80",
    },
    buyer: {
      title: "Direct-from-farm marketplace & bulk order aggregation.",
      desc: "Our OLX-style Buyer Marketplace shows local listings based on a 10/20/30+ km radius. Filters help you find crops by quality grade, price, and distance. If you need larger quantities (e.g., 1,000 kg), the Bulk Order Aggregation engine automatically combines stock from multiple nearby farmers to fulfill your order.",
      bullets: [
        "Access fresh produce at lower consumer prices.",
        "Support local farmers directly.",
        "Aggregated fulfillment for wholesalers and restaurants.",
      ],
      link: "/buyer/marketplace",
      cta: "Explore Marketplace",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
    },
    rider: {
      title: "AI-driven route optimization & rider dispatch.",
      desc: "A Swiggy-style delivery rider dashboard that matches supply with local demand. Nearby orders are dispatched to local riders or optimized for self-pickup, while long-distance shipments are integrated with external logistics services. AI assigns the optimal rider based on capacity, distance, and deadlines.",
      bullets: [
        "Real-time navigation with optimized multi-stop route planning.",
        "Fair, distance-based payout metrics.",
        "Reduced fuel consumption and carbon footprint.",
      ],
      link: "/rider/deliveries",
      cta: "Open Rider Dashboard",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    },
    fpo: {
      title: "Empowering Farmer Producer Organizations.",
      desc: "Empower local agricultural cooperatives to manage inventory collectively, fulfill large institutional orders, track regional logistics, and gain wholesale market bargaining power using unified group accounts.",
      bullets: [
        "Consolidated crop dashboards for dozens of member farms.",
        "Shared logistics storage and dispatch hubs.",
        "Direct linkages with Ministry and Department distribution channels.",
      ],
      link: "/buyer/bulk-order",
      cta: "FPO Aggregation Tool",
      image:
        "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80",
    },
  };

  return (
    <div className="min-h-screen bg-[#f7f8f9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#002f34] text-white border-b border-teal-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-lg">
                🌾
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                FarmFresh
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-200">
              <Link
                href="/buyer/marketplace"
                className="hover:text-white transition"
              >
                Marketplace
              </Link>
              <Link
                href="/buyer/bulk-order"
                className="hover:text-white transition"
              >
                Bulk Sourcing
              </Link>
              <Link
                href="/farmer/crops/new"
                className="hover:text-white transition"
              >
                Farmer Price Intelligence
              </Link>
              <Link
                href="/rider/deliveries"
                className="hover:text-white transition"
              >
                Rider Dispatch
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950/60 px-3 py-1 rounded">
              DoCA Hackathon Demo
            </span>
            <Link href="/buyer/marketplace">
              <Button
                size="sm"
                className="bg-teal-500 hover:bg-teal-400 text-[#002f34] font-bold"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Dark background, globe-like style matching Uber Freight) */}
      <section className="relative bg-gradient-to-b from-[#002f34] via-[#001e21] to-[#041113] text-white overflow-hidden py-24 md:py-32">
        {/* Abstract background graphics (simulated globe grid) */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border-2 border-dashed border-teal-400 rounded-full animate-[spin_120s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-teal-500/50 rounded-full animate-[spin_80s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-teal-300/20 rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Powering intelligent agricultural logistics to drive better outcomes
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-teal-100/80 max-w-3xl mx-auto font-medium leading-relaxed">
            A digital marketplace connecting farmers & FPOs directly with
            consumers and bulk buyers. Integrated with AI price forecasting,
            logistics matching, and route optimization.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/buyer/marketplace">
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-400 text-[#002f34] font-black px-8 py-6 text-base rounded shadow-lg shadow-teal-500/10"
              >
                Explore Marketplace
              </Button>
            </Link>
            <Link href="/buyer/bulk-order">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-6 text-base rounded"
              >
                Bulk Sourcing Engine
              </Button>
            </Link>
          </div>

          <div className="pt-8 text-xs text-teal-300/70 font-semibold flex items-center justify-center gap-1.5 flex-wrap">
            <span>
              Ministry of Consumer Affairs, Food & Public Distribution
            </span>
            <span>•</span>
            <span>Department of Consumer Affairs (DoCA)</span>
          </div>
        </div>
      </section>

      {/* 3. STATS GRID SECTION (Light Background) */}
      <section className="bg-white dark:bg-zinc-900 border-y border-gray-200 dark:border-zinc-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#002f34] dark:text-white tracking-tight">
              Tap into India's largest managed farm-to-consumer logistics
              network
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              By removing unnecessary intermediaries, we optimize pricing and
              freshness from rural farms to urban markets.
            </p>
          </div>

          {/* Grid of metrics matching Uber Freight style */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { val: "₹50 Cr+", label: "Direct-to-Farmer Earnings" },
              { val: "18M kg", label: "Produce Moved Efficiently" },
              { val: "1.8B", label: "Intermediary Markup Eliminated" },
              { val: "15-20%", label: "Lower Price for Consumers" },
              { val: "1 in 3", label: "Local FPOs Connected" },
              { val: "15,000+", label: "Registered Delivery Riders" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#f7f8f9] dark:bg-zinc-800/50 p-6 rounded border border-gray-200/60 dark:border-zinc-800 text-center flex flex-col justify-center space-y-1 hover:shadow-xs transition"
              >
                <span className="text-3xl font-black text-[#002f34] dark:text-teal-400">
                  {stat.val}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC FEATURES SECTION (Dark background) */}
      <section className="bg-[#001e21] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Strategic logistics built for agricultural efficiency
            </h2>
            <p className="text-teal-100/60 text-sm md:text-base mt-2">
              Unifying supply listings, customer demand, and logistics dispatch
              into one intelligent system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Farmer card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:bg-white/10 transition">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center text-2xl text-teal-400">
                  🧑‍🌾
                </div>
                <h3 className="text-xl font-bold">Farmer / Seller Interface</h3>
                <p className="text-sm text-teal-100/70 leading-relaxed">
                  Farmers list crop variety, quantity, quality grade, and farm
                  location. Integrated AI checks current mandi rates, demand
                  curves, and local weather patterns to suggest real-time
                  pricing and advice.
                </p>
              </div>
              <Link
                href="/farmer/crops/new"
                className="mt-8 text-teal-400 hover:text-teal-300 font-bold text-sm inline-flex items-center gap-1"
              >
                <span>Access Price Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Buyer card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:bg-white/10 transition">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center text-2xl text-teal-400">
                  🛒
                </div>
                <h3 className="text-xl font-bold">OLX-Style Buyer Interface</h3>
                <p className="text-sm text-teal-100/70 leading-relaxed">
                  A geo-fenced marketplace showing listings by distance radius.
                  Supports both individual households and bulk commercial buyers
                  with automatic order aggregation across nearby farmers.
                </p>
              </div>
              <Link
                href="/buyer/marketplace"
                className="mt-8 text-teal-400 hover:text-teal-300 font-bold text-sm inline-flex items-center gap-1"
              >
                <span>Explore Sourced Crops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Rider card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:bg-white/10 transition">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center text-2xl text-teal-400">
                  🛵
                </div>
                <h3 className="text-xl font-bold">Intelligent Logistics Hub</h3>
                <p className="text-sm text-teal-100/70 leading-relaxed">
                  A Zomato-style delivery dashboard. Matches local orders with
                  nearby riders. Utilizes advanced algorithms to assign optimal
                  riders based on distance, cargo capacity, and delivery
                  deadlines.
                </p>
              </div>
              <Link
                href="/rider/deliveries"
                className="mt-8 text-teal-400 hover:text-teal-300 font-bold text-sm inline-flex items-center gap-1"
              >
                <span>View Rider Logistics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ROLE SECTION (Serving the industries that move North America) */}
      <section className="bg-white dark:bg-zinc-900 py-20 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#002f34] dark:text-white tracking-tight">
              Serving the actors of the agricultural supply chain
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
              Select your role below to learn how FarmFresh drives efficiency
              for you.
            </p>
          </div>

          {/* Interactive tabs */}
          <div className="flex justify-center border-b border-gray-200 dark:border-zinc-800 max-w-xl mx-auto">
            <div className="flex gap-2 p-1">
              {Object.keys(tabContents).map((tabKey) => {
                const isActive = activeTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey as any)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
                      isActive
                        ? "border-[#002f34] text-[#002f34] dark:border-teal-400 dark:text-teal-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {tabKey}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#f7f8f9] dark:bg-zinc-800/40 p-6 sm:p-10 rounded-xl border border-gray-200/50 dark:border-zinc-800 max-w-5xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-extrabold text-[#002f34] dark:text-white leading-tight">
                {tabContents[activeTab].title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {tabContents[activeTab].desc}
              </p>
              <ul className="space-y-2.5">
                {tabContents[activeTab].bullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link href={tabContents[activeTab].link}>
                  <Button className="bg-[#002f34] dark:bg-teal-600 hover:bg-[#003d44] font-bold text-xs px-6 py-5">
                    <span>{tabContents[activeTab].cta}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-md">
              <img
                src={tabContents[activeTab].image}
                alt={activeTab}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. ADDITIONAL METRIC BANNER */}
      <section className="bg-teal-50 dark:bg-teal-950/20 py-10 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="text-xl font-bold text-[#002f34] dark:text-teal-400">
              ₹50 Crore saved and 1.8 million kilograms of produce moved for
              customers
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Empowering farmers across India with direct consumer links &
              real-time dispatch systems.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
            <span className="font-extrabold text-sm tracking-widest text-[#002f34] dark:text-white uppercase">
              MINISTRY OF CONSUMER AFFAIRS
            </span>
            <span className="font-extrabold text-sm tracking-widest text-[#002f34] dark:text-white uppercase">
              DoCA
            </span>
          </div>
        </div>
      </section>

      {/* 7. PROVEN RESULTS / CASE STUDIES */}
      <section className="bg-[#f7f8f9] dark:bg-zinc-950 py-20 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#002f34] dark:text-white tracking-tight">
              Proven results across complex transportation networks
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Case studies and features driving measurable supply chain
              transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case study 1 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md transition">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80"
                  alt="bulk-aggregation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Bulk Order Aggregation
                </span>
                <h4 className="text-lg font-bold leading-tight">
                  Automatically combining stock from nearby farmers
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  When a bulk buyer requests large stock (e.g. 1,000 kg), the
                  engine groups inventories from nearby smallholder farms to
                  fulfill the capacity, dispatching unified logistics.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2">
                <Link href="/buyer/bulk-order">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold"
                  >
                    Test Bulk Aggregator
                  </Button>
                </Link>
              </div>
            </div>

            {/* Case study 2 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md transition">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&auto=format&fit=crop&q=80"
                  alt="ai-price"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  AI Matching Engine
                </span>
                <h4 className="text-lg font-bold leading-tight">
                  Synchronizing Farmer + Buyer + Rider in real-time
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Intelligently matching producers with demand and shipping
                  fleets, reducing delivery ETA from days to hours, and
                  minimizing post-harvest crop degradation.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2">
                <Link href="/buyer/marketplace">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold"
                  >
                    Explore Direct Sourcing
                  </Button>
                </Link>
              </div>
            </div>

            {/* Case study 3 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md transition">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80"
                  alt="intermediary-cost"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Reduced Supply Chain Wastage
                </span>
                <h4 className="text-lg font-bold leading-tight">
                  Maximizing earnings while cutting retail prices
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Direct farm linkages bypass multiple tiered wholesalers.
                  Consumers pay less for fresher food, and farmers retain
                  margins previously lost to middlemen.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2">
                <Link href="/farmer/crops/new">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold"
                  >
                    Test Farmer Interface
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAST-ACCESS DASHBOARDS LAYOUT (Connect with an expert form placeholder) */}
      <section className="bg-white dark:bg-zinc-900 py-20 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-[#002f34] dark:text-white tracking-tight">
              Get started with FarmFresh dashboards
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Ready to test the system? Choose the interface matching your role
              to experience the logistics aggregation in action.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/farmer/crops/new"
              className="p-6 border border-gray-200 dark:border-zinc-800 hover:border-teal-500 dark:hover:border-teal-500 rounded-lg hover:shadow-md transition text-center space-y-2"
            >
              <span className="text-3xl block">🧑‍🌾</span>
              <h4 className="font-bold text-sm">Farmer Portal</h4>
              <p className="text-[11px] text-gray-500">
                List crops & get AI recommendations
              </p>
            </Link>

            <Link
              href="/buyer/marketplace"
              className="p-6 border border-gray-200 dark:border-zinc-800 hover:border-teal-500 dark:hover:border-teal-500 rounded-lg hover:shadow-md transition text-center space-y-2"
            >
              <span className="text-3xl block">🛒</span>
              <h4 className="font-bold text-sm">Buyer Marketplace</h4>
              <p className="text-[11px] text-gray-500">
                Search and buy crops within radius
              </p>
            </Link>

            <Link
              href="/buyer/bulk-order"
              className="p-6 border border-gray-200 dark:border-zinc-800 hover:border-teal-500 dark:hover:border-teal-500 rounded-lg hover:shadow-md transition text-center space-y-2"
            >
              <span className="text-3xl block">📦</span>
              <h4 className="font-bold text-sm">Bulk Sourcing</h4>
              <p className="text-[11px] text-gray-500">
                Aggregate order from nearby farms
              </p>
            </Link>

            <Link
              href="/rider/deliveries"
              className="p-6 border border-gray-200 dark:border-zinc-800 hover:border-teal-500 dark:hover:border-teal-500 rounded-lg hover:shadow-md transition text-center space-y-2"
            >
              <span className="text-3xl block">🛵</span>
              <h4 className="font-bold text-sm">Rider Dashboard</h4>
              <p className="text-[11px] text-gray-500">
                Manage deliveries & optimized routes
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. LATEST UPDATES & NEWS */}
      <section className="bg-[#f7f8f9] dark:bg-zinc-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <h3 className="text-2xl font-extrabold text-[#002f34] dark:text-white text-center">
            Latest updates and recommended content
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-sm transition">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80"
                  alt="onion-distribution"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug hover:text-teal-600 transition">
                  DoCA launches pilot direct-to-consumer crop distribution
                  program in Delhi NCR
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  New logistics channels connect Farmer Producer Organizations
                  (FPOs) directly with urban distribution terminals to stabilize
                  seasonal price fluctuations.
                </p>
              </div>
              <div className="px-5 pb-5 pt-2 text-[11px] font-semibold text-gray-400">
                Aug 26, 2026
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-sm transition">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80"
                  alt="onion-distribution-2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug hover:text-teal-600 transition">
                  AI route optimization cuts post-harvest transit losses by 22%
                  during peak summer
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dynamic rider allocation and route consolidation algorithms
                  ensure fresh leafy greens are delivered to consumer hubs
                  before heat damage occurs.
                </p>
              </div>
              <div className="px-5 pb-5 pt-2 text-[11px] font-semibold text-gray-400">
                Aug 22, 2026
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-sm transition">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"
                  alt="onion-distribution-3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug hover:text-teal-600 transition">
                  FPO success story: How 40 farmers in Sonipat combined forces
                  to fulfill a 5-ton potato order
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Using our bulk order aggregation software, smallholders
                  consolidated stock under a single dispatch, saving 40% on
                  collective logistics charges.
                </p>
              </div>
              <div className="px-5 pb-5 pt-2 text-[11px] font-semibold text-gray-400">
                Aug 18, 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. UBER-STYLE RICH FOOTER */}
      <footer className="bg-[#001012] text-white text-xs pt-16 pb-8 border-t border-teal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h5 className="font-bold text-teal-400 uppercase tracking-widest text-[10px] mb-4">
              FarmFresh Hubs
            </h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/buyer/marketplace"
                  className="hover:text-white transition"
                >
                  Direct Sourcing Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/buyer/bulk-order"
                  className="hover:text-white transition"
                >
                  Bulk Order Aggregator
                </Link>
              </li>
              <li>
                <Link
                  href="/farmer/crops/new"
                  className="hover:text-white transition"
                >
                  Farmer AI Price Assistant
                </Link>
              </li>
              <li>
                <Link
                  href="/rider/deliveries"
                  className="hover:text-white transition"
                >
                  Logistics Dispatch Terminal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-teal-400 uppercase tracking-widest text-[10px] mb-4">
              Ministry Initative
            </h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Ministry of Consumer Affairs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Department of Consumer Affairs (DoCA)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Intermediary Elimination Goals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Agricultural FoodTech Reforms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-teal-400 uppercase tracking-widest text-[10px] mb-4">
              Resources & Support
            </h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Mandi Price API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Logistics Partner Onboarding
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FPO Registration Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Consumer Help Desk
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-teal-400 uppercase tracking-widest text-[10px] mb-4">
              FarmFresh App
            </h5>
            <p className="text-gray-400 mb-3 leading-relaxed">
              Available soon for Android and iOS devices, featuring real-time
              mandi updates and SMS alerts for farmers.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-teal-950 text-teal-300 rounded font-bold text-[10px] cursor-pointer hover:bg-teal-900">
                Google Play
              </span>
              <span className="px-3 py-1.5 bg-teal-950 text-teal-300 rounded font-bold text-[10px] cursor-pointer hover:bg-teal-900">
                App Store
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-teal-950/60 text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white tracking-tighter">
              FarmFresh
            </span>
            <span>© 2026. Built for Hackathon Demo.</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Accessibility
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
