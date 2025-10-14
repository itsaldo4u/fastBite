import { useState } from "react";
import axios from "axios";
import { Search, Package, CheckCircle, ChefHat, Truck } from "lucide-react";
import OrderCard from "./OrderCard";

import type { Order } from "./user/UserDashboard";
import { statusToStep } from "./user/UserDashboard";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderId.trim()) {
      setError("Ju lutem shkruani ID të vlefshme.");
      setOrder(null);
      return;
    }

    try {
      const res = await axios.get<Order>(
        `http://localhost:3000/orders/${orderId.trim()}`
      );
      const orderData = res.data;

      setOrder(orderData);
      setError("");

      if (orderData.status === "pending" || orderData.status === "preparing") {
        const createdAtMs = new Date(orderData.createdAt).getTime();
        const nowMs = Date.now();
        const elapsedMinutes = (nowMs - createdAtMs) / 60000;
        const left = orderData.prepTime - elapsedMinutes;
        setTimeLeft(left > 0 ? Math.ceil(left) : 0);
      } else {
        setTimeLeft(0);
      }
    } catch (err) {
      setOrder(null);
      setError("Nuk u gjet porosia me këtë ID.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 bg-[length:400%_400%] animate-gradient-shift" />

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />

      {/* Floating decorative elements */}
      <div className="absolute top-1/5 left-1/10 text-4xl opacity-10 animate-float">
        🍔
      </div>
      <div className="absolute top-3/5 right-1/6 text-4xl opacity-10 animate-float-delayed">
        🍟
      </div>
      <div className="absolute bottom-1/4 left-1/5 text-4xl opacity-10 animate-float-extra">
        🥤
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-lg bg-white/20 border-b border-white/30 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="text-center">
            <div className="inline-block mb-2">
              <Package className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-3xl font-black text-white drop-shadow-lg mb-1">
              Gjurmimi i Porosisë
            </h1>
            <p className="text-white/90 text-base drop-shadow">
              Ndiqni statusin e porosisë tuaj në kohë reale
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto p-4 space-y-4">
        {/* Search Section */}
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-5 transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg shadow-md">
                <Search className="text-white w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Kërko Porosinë
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Vendos ID e porosisë..."
                  className="w-full p-3 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/10 transition-all text-gray-800 placeholder-gray-400 text-base"
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                />
              </div>
              <button
                onClick={handleTrack}
                className="relative group px-5 py-3 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white rounded-lg hover:translate-y-[-2px] hover:shadow-lg transition-all font-bold text-base w-full sm:w-auto overflow-hidden before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Gjurmo
                  <Search className="w-4 h-4" />
                </span>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        {order && (
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-5 transform transition-all duration-300 hover:shadow-2xl">
            <OrderCard
              order={order}
              timeLeft={timeLeft}
              currentStep={statusToStep[order.status]}
              showReview={false}
            />
          </div>
        )}

        {/* Empty State */}
        {!order && !error && (
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-6 transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
                  <Package className="w-10 h-10 text-red-500" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Gjurmoni Porosinë Tuaj
              </h3>
              <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
                Shkruani numrin e porosisë për të parë statusin dhe detajet.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="relative group">
                  <div className="relative p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-green-400 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg">
                    <div className="relative inline-block mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 text-base mb-1">
                      Konfirmim i Shpejtë
                    </h4>
                    <p className="text-sm text-gray-600">
                      Merrni konfirmimin menjëherë
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-orange-400 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg">
                    <div className="relative inline-block mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-md">
                        <ChefHat className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 text-base mb-1">
                      Gatim i Freskët
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ushqim i përgatitur pas porosisë
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="relative p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg">
                    <div className="relative inline-block mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-md">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 text-base mb-1">
                      Dorëzim i Shpejtë
                    </h4>
                    <p className="text-sm text-gray-600">Brenda 30 minutave</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
