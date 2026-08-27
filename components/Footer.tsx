"use client";

import Link from "next/link";
import {
  Sprout,
  ShieldCheck,
  PhoneCall,
  HeartHandshake,
  Award,
  Truck,
  Leaf,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#052112] text-emerald-100/90 text-xs border-t-4 border-amber-500 font-sans">
      
      {/* 1. KISAAN DIRECT VALUE PROPOSITION BAR */}
      <div className="bg-[#082e1a] border-b border-emerald-800/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0b3b20]/60 border border-emerald-700/40">
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">100% Farm Direct</h5>
                <p className="text-[11px] text-emerald-300/80">Zero intermediate brokers or commission agents</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0b3b20]/60 border border-emerald-700/40">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">DoCA Mandi Verified</h5>
                <p className="text-[11px] text-emerald-300/80">Real-time fair price benchmarks & APMC sync</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0b3b20]/60 border border-emerald-700/40">
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Smart Agri Logistics</h5>
                <p className="text-[11px] text-emerald-300/80">AI route optimization cuts transit waste by 22%</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0b3b20]/60 border border-emerald-700/40">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Kisan Samriddhi</h5>
                <p className="text-[11px] text-emerald-300/80">Higher earnings for farmers, lower cost for buyers</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. FOOTER NAVIGATION & DIRECT LINKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-lg text-emerald-950 font-black">
              🌾
            </div>
            <span className="text-xl font-black text-white tracking-tight font-serif">
              FarmFresh <span className="text-amber-400">KRISHI</span>
            </span>
          </div>
          <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
            Empowering Indian farmers and Farmer Producer Organizations (FPOs) with direct consumer access, automated bulk order aggregation, and AI-enabled logistics dispatch.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs text-amber-300 font-bold">
            <span className="bg-[#0b3b20] px-3 py-1.5 rounded-lg border border-emerald-700/80 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              Kisan Helpline: 1800-180-1551
            </span>
          </div>
        </div>

        {/* Portals */}
        <div className="space-y-3">
          <h6 className="font-extrabold text-amber-400 uppercase tracking-widest text-[11px]">
            Agri Portals
          </h6>
          <ul className="space-y-2 text-emerald-200/80">
            <li>
              <Link href="/buyer/marketplace" className="hover:text-white transition">
                Mandi Marketplace
              </Link>
            </li>
            <li>
              <Link href="/buyer/bulk-order" className="hover:text-white transition">
                Bulk Aggregation
              </Link>
            </li>
            <li>
              <Link href="/farmer/crops/new" className="hover:text-white transition">
                Farmer Listing Hub
              </Link>
            </li>
            <li>
              <Link href="/rider/deliveries" className="hover:text-white transition">
                Rider Logistics
              </Link>
            </li>
          </ul>
        </div>

        {/* Commodity Categories */}
        <div className="space-y-3">
          <h6 className="font-extrabold text-amber-400 uppercase tracking-widest text-[11px]">
            Direct Produce
          </h6>
          <ul className="space-y-2 text-emerald-200/80">
            <li>
              <Link href="/buyer/marketplace" className="hover:text-white transition">
                🍅 Fresh Vegetables
              </Link>
            </li>
            <li>
              <Link href="/buyer/marketplace" className="hover:text-white transition">
                🌾 Grains & Pulses
              </Link>
            </li>
            <li>
              <Link href="/buyer/marketplace" className="hover:text-white transition">
                🥭 Seasonal Fruits
              </Link>
            </li>
            <li>
              <Link href="/buyer/marketplace" className="hover:text-white transition">
                🌿 Organic Certified
              </Link>
            </li>
          </ul>
        </div>

        {/* Institutional Backing */}
        <div className="space-y-3">
          <h6 className="font-extrabold text-amber-400 uppercase tracking-widest text-[11px]">
            Institutional Linkage
          </h6>
          <ul className="space-y-2 text-emerald-200/80 text-[11px]">
            <li>Ministry of Consumer Affairs</li>
            <li>Dept of Consumer Affairs (DoCA)</li>
            <li>e-NAM Integration Ready</li>
            <li>FPO Cooperative Networks</li>
          </ul>
        </div>

      </div>

      {/* 3. COPYRIGHT & ATTRIBUTION BAR */}
      <div className="border-t border-emerald-900/80 bg-[#03170c] py-5 text-emerald-400/70 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 FarmFresh Krishi. Department of Consumer Affairs Hackathon Initiative.</p>
          <div className="flex items-center gap-4 text-xs font-semibold text-amber-400/90">
            <span>जय जवान, जय किसान</span>
            <span>•</span>
            <span>Direct Farm-to-Fork Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
