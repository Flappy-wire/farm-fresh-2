"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sprout,
  Store,
  Boxes,
  Truck,
  Sparkles,
  MapPin,
  TrendingUp,
  PhoneCall,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Mandi Marketplace",
      href: "/buyer/marketplace",
      icon: Store,
    },
    {
      name: "Bulk Sourcing",
      href: "/buyer/bulk-order",
      icon: Boxes,
    },
    {
      name: "Farmer Portal",
      href: "/farmer/crops/new",
      icon: Sprout,
    },
    {
      name: "Rider Logistics",
      href: "/rider/deliveries",
      icon: Truck,
    },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 1. TOP LIVE MANDI TICKER STRIP */}
      <div className="bg-[#052514] text-amber-300 text-[11px] font-medium py-1.5 px-4 border-b border-amber-500/20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] border border-amber-400/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Live Mandi Ticker
            </span>
          </div>

          <div className="truncate hidden sm:flex items-center gap-6 text-emerald-100/90 text-xs">
            <span>
              🍅 Sonipat Tomatoes: <strong>₹24/kg</strong>{" "}
              <span className="text-emerald-400">▲ +4%</span>
            </span>
            <span>
              🧅 Lasalgaon Onions: <strong>₹22/kg</strong>{" "}
              <span className="text-emerald-400">▲ +2%</span>
            </span>
            <span>
              🌾 MP Sharbati Wheat: <strong>₹34/kg</strong>{" "}
              <span className="text-amber-300">● Stable</span>
            </span>
            <span>
              🥭 Ratnagiri Mangoes: <strong>₹190/kg</strong>{" "}
              <span className="text-emerald-400">▲ +8%</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-emerald-200/80 text-[11px]">
            <span className="hidden md:inline font-semibold">
              📞 Kisan Helpline: 1800-180-1551
            </span>
            <span className="bg-emerald-900/80 px-2 py-0.5 rounded text-amber-200 border border-emerald-700/50 font-bold">
              DoCA Direct
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND NAVIGATION BAR */}
      <nav className="bg-[#0b3b20] border-b border-emerald-800/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 p-0.5 shadow-md group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#0b3b20] rounded-[10px] flex items-center justify-center text-xl">
                🌾
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-serif">
                  FarmFresh
                </span>
                <span className="text-[10px] font-extrabold bg-amber-400 text-emerald-950 px-1.5 py-0.2 rounded font-sans tracking-wide">
                  KRISHI
                </span>
              </div>
              <p className="text-[10px] font-medium text-emerald-300/90 tracking-wide">
                100% Direct Farm Network
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-[#072a16]/80 p-1 rounded-xl border border-emerald-700/60 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? "bg-amber-400 text-emerald-950 shadow-sm"
                      : "text-emerald-100 hover:text-white hover:bg-emerald-800/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-emerald-950" : "text-amber-400"}`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick CTA & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/farmer/crops/new" className="hidden sm:block">
              <Button className="h-10 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black shadow-md border border-amber-300/40 text-xs cursor-pointer inline-flex items-center justify-center gap-1.5 leading-none transition">
                <span>🧑‍🌾</span>
                <span>List Crop</span>
              </Button>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-emerald-900/60 text-emerald-100 hover:text-white border border-emerald-700 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#072a16] border-t border-emerald-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-lg text-sm font-bold ${
                    isActive
                      ? "bg-amber-400 text-emerald-950"
                      : "text-emerald-100 hover:bg-emerald-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/farmer/crops/new"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm">
                  🧑‍🌾 List Crop
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
