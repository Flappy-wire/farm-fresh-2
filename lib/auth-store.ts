// lib/auth-store.ts
"use client";

import { create } from "zustand";

export type UserRole = "buyer" | "farmer" | "rider";

export interface BuyerProfile {
  deliveryAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
  };
  loyaltyTier: "Standard" | "FarmFresh Gold" | "Wholesale Direct";
  totalOrders: number;
}

export interface FarmerProfile {
  kisanId: string;
  farmName: string;
  district: string;
  state: string;
  verifiedKCC: boolean; // Kisan Credit Card
  soilHealthCard: boolean;
  totalHarvests: number;
  bankAccountLinked: boolean;
}

export interface RiderProfile {
  riderId: string;
  vehicleNumber: string;
  vehicleType: string;
  driverLicense: string;
  rating: number;
  safetyScore: number;
  completedTrips: number;
  payoutUpi: string;
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  location: string;
  buyerProfile?: BuyerProfile;
  farmerProfile?: FarmerProfile;
  riderProfile?: RiderProfile;
}

export const PRESET_USERS: Record<UserRole, AuthUser> = {
  buyer: {
    id: "user_buyer_01",
    name: "Ramesh Kumar",
    phone: "+91 98100 12345",
    email: "ramesh.kumar@delhi.in",
    role: "buyer",
    location: "Defence Colony, New Delhi",
    buyerProfile: {
      deliveryAddress: {
        fullName: "Ramesh Kumar",
        phone: "+91 98100 12345",
        addressLine1: "Flat 4B, Gulmohar Enclave",
        addressLine2: "Near Community Centre",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110049",
      },
      loyaltyTier: "FarmFresh Gold",
      totalOrders: 18,
    },
  },
  farmer: {
    id: "user_farmer_01",
    name: "Harish Chander",
    phone: "+91 98123 78901",
    email: "harish.chander@kisan.gov.in",
    role: "farmer",
    location: "Sonipat Agro Cluster, Haryana",
    farmerProfile: {
      kisanId: "KCC-HR-894120",
      farmName: "Chander Organic Orchards & Greens",
      district: "Sonipat",
      state: "Haryana",
      verifiedKCC: true,
      soilHealthCard: true,
      totalHarvests: 42,
      bankAccountLinked: true,
    },
  },
  rider: {
    id: "user_rider_01",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.rider@farmfresh.in",
    role: "rider",
    location: "Delhi-Sonipat Highway Corridor",
    riderProfile: {
      riderId: "RIDER-DEL-4421",
      vehicleNumber: "DL 1S AB 4421",
      vehicleType: "Electric Tata Ace Mini Truck",
      driverLicense: "DL-0420190038912",
      rating: 4.92,
      safetyScore: 99,
      completedTrips: 348,
      payoutUpi: "rajesh4421@okaxis",
    },
  },
};

interface AuthState {
  currentUser: AuthUser | null;
  activeRole: UserRole;
  isModalOpen: boolean;
  modalDefaultRole: UserRole;

  // Actions
  login: (user: AuthUser) => void;
  quickDemoLogin: (role: UserRole) => void;
  logout: () => void;
  openAuthModal: (role?: UserRole) => void;
  closeAuthModal: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Check if browser has saved user session
  let initialUser: AuthUser | null = null;
  let initialRole: UserRole = "buyer";

  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("farmfresh_auth_user");
      if (storedUser) {
        initialUser = JSON.parse(storedUser);
        if (initialUser?.role) {
          initialRole = initialUser.role;
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }

  return {
    currentUser: initialUser,
    activeRole: initialRole,
    isModalOpen: false,
    modalDefaultRole: "buyer",

    login: (user: AuthUser) => {
      set({ currentUser: user, activeRole: user.role, isModalOpen: false });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("farmfresh_auth_user", JSON.stringify(user));
          localStorage.setItem("access_token", `mock_token_${user.id}_${Date.now()}`);
        } catch {
          // Ignore
        }
      }
    },

    quickDemoLogin: (role: UserRole) => {
      const demoUser = PRESET_USERS[role];
      set({ currentUser: demoUser, activeRole: role, isModalOpen: false });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("farmfresh_auth_user", JSON.stringify(demoUser));
          localStorage.setItem("access_token", `mock_token_${demoUser.id}_${Date.now()}`);
        } catch {
          // Ignore
        }
      }
    },

    logout: () => {
      set({ currentUser: null });
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("farmfresh_auth_user");
          localStorage.removeItem("access_token");
        } catch {
          // Ignore
        }
      }
    },

    openAuthModal: (role?: UserRole) => {
      set((state) => ({
        isModalOpen: true,
        modalDefaultRole: role || state.activeRole,
      }));
    },

    closeAuthModal: () => {
      set({ isModalOpen: false });
    },

    updateUser: (partial: Partial<AuthUser>) => {
      set((state) => {
        if (!state.currentUser) return state;
        const updated = { ...state.currentUser, ...partial };
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("farmfresh_auth_user", JSON.stringify(updated));
          } catch {
            // Ignore
          }
        }
        return { currentUser: updated };
      });
    },
  };
});

