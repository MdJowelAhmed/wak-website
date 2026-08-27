"use client";

import { useState } from "react";
import { Search, Package, CheckCircle2, Truck, MapPin, Home } from "lucide-react";
import DashboardCard from "../../../../shared/DashboardCard";

interface OrderTrackingData {
  orderId: string;
  estimatedDelivery: string;
  currentStatus: string;
  steps: {
    title: string;
    description: string;
    time?: string;
    expected?: string;
    icon: any;
  }[];
}

const mockOrderData: Record<string, OrderTrackingData> = {
  "#ORB10gz": {
    orderId: "#ORB10gz",
    estimatedDelivery: "20 April, 2024",
    currentStatus: "Delivered",
    steps: [
      {
        title: "Order Confirmed",
        description: "Your order has been placed successfully",
        time: "Nov 30, 10:30 AM",
        icon: Package,
      },
      {
        title: "Order Packed",
        description: "Your order has been packed and ready to ship",
        time: "Nov 30, 10:30 AM",
        icon: CheckCircle2,
      },
      {
        title: "Out for Delivery",
        description: "Your package is on the way",
        time: "Nov 30, 10:30 AM",
        icon: Truck,
      },
      {
        title: "Nearby",
        description: "Driver is near your location",
        expected: "Expected at 4:15 PM",
        icon: MapPin,
      },
      {
        title: "Delivered",
        description: "Package delivered successfully",
        expected: "Expected at 4:30 PM",
        icon: Home,
      },
    ],
  },
};

export default function OrderTrackingPage() {
  const [searchQuery, setSearchQuery] = useState("#ORB10gz");
  const [activeOrder, setActiveOrder] = useState<OrderTrackingData>(mockOrderData["#ORB10gz"]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      const query = searchQuery.trim();
      if (mockOrderData[query]) {
        setActiveOrder(mockOrderData[query]);
      } else {
        // Fallback or generic simulation
        setActiveOrder({
          orderId: query || "#ORB123456",
          estimatedDelivery: "25 May, 2026",
          currentStatus: "In Transit",
          steps: [
            {
              title: "Order Confirmed",
              description: "Your order has been placed successfully",
              time: "Today, 09:00 AM",
              icon: Package,
            },
            {
              title: "Order Packed",
              description: "Your order has been packed and ready to ship",
              time: "Today, 02:00 PM",
              icon: CheckCircle2,
            },
            {
              title: "Out for Delivery",
              description: "Your package is on the way",
              expected: "Expected tomorrow by 5:00 PM",
              icon: Truck,
            },
            {
              title: "Nearby",
              description: "Driver is heading towards destination",
              expected: "Pending",
              icon: MapPin,
            },
            {
              title: "Delivered",
              description: "Package delivered successfully",
              expected: "Pending",
              icon: Home,
            },
          ],
        });
      }
      setIsSearching(false);
    }, 500);
  };

  return (
    <DashboardCard className="p-8 sm:p-10 rounded-2xl bg-white border border-zinc-200/50 shadow-md">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-wide">
          Track Your Order
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          Enter your order number to track your package
        </p>
      </div>
 
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-12">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter order number (e.g., #ORB123456)"
            className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary focus:bg-white rounded-xl px-5 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-sm focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="bg-primary hover:bg-orange-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer shadow-md shadow-orange-500/10 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4 shrink-0 font-bold" />
          )}
          <span>Track Order</span>
        </button>
      </form>
 
      {/* Order Info Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 mb-5 text-sm border-b border-zinc-100">
        <div className="space-y-3 font-normal">
          <div className="flex items-center gap-8">
            <span className="text-zinc-500 w-36">Order ID</span>
            <span className="text-zinc-900 font-semibold">: {activeOrder.orderId}</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-zinc-500 w-36">Estimated Delivery</span>
            <span className="text-zinc-900 font-semibold">: {activeOrder.estimatedDelivery}</span>
          </div>
        </div>
 
        <div className="flex items-center justify-end gap-2">
          <span className="text-zinc-500 text-xs">Current Status:</span>
          <span className="bg-[#00D26A] text-white px-5 py-1.5 rounded-full font-bold text-xs tracking-wide shadow-lg shadow-[#00D26A]/20 inline-block">
            {activeOrder.currentStatus}
          </span>
        </div>
      </div>
 
      {/* Order Status Timeline */}
      <div className="max-w-3xl ">
        <h3 className="text-primary font-bold text-lg mb-8 tracking-wide">
          Order Status
        </h3>
 
        <div className="space-y-0">
          {activeOrder.steps.map((step, index) => (
            <div key={index} className="flex gap-6 items-start min-h-[90px] group">
              <div className="flex flex-col items-center self-stretch">
                <div className="w-10 h-10 rounded-full bg-[#00D26A] flex items-center justify-center text-white shadow-lg shadow-[#00D26A]/20 shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <step.icon className="w-5 h-5 shrink-0" />
                </div>
                {index < activeOrder.steps.length - 1 && (
                  <div className="w-0 flex-1 border-l-2 border-dashed border-zinc-200 my-1.5" />
                )}
              </div>
 
              <div className="flex flex-col pb-8 pt-1">
                <h4 className="text-zinc-800 font-semibold text-base tracking-wide">
                  {step.title}
                </h4>
                <p className="text-zinc-650 text-sm mt-1.5 leading-relaxed font-normal">
                  {step.description}
                </p>
                {step.time && (
                  <span className="text-zinc-400 text-xs mt-1.5 font-normal">
                    {step.time}
                  </span>
                )}
                {step.expected && (
                  <span className="text-zinc-500 text-xs mt-1.5 font-normal">
                    {step.expected}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
