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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Gjurmimi i Porosisë
            </h1>
            <p className="text-gray-600 text-base">
              Ndiqni statusin e porosisë tuaj në kohë reale
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Search className="text-orange-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-800">
              Kërko Porosinë
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Vendos ID e porosisë..."
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-base w-full"
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            />
            <button
              onClick={handleTrack}
              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-medium text-base shadow-md w-full sm:w-auto"
            >
              Gjurmo
            </button>
          </div>

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto">
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
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Gjurmoni Porosinë Tuaj
            </h3>
            <p className="text-gray-600 text-base mb-6 max-w-full mx-auto">
              Shkruani numrin e porosisë për të parë statusin dhe detajet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-full mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  Konfirmim i Shpejtë
                </h4>
                <p className="text-xs text-gray-600">
                  Merrni konfirmimin menjëherë
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ChefHat className="w-6 h-6 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  Gatim i Freskët
                </h4>
                <p className="text-xs text-gray-600">
                  Ushqim i përgatitur pas porosisë
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  Dorëzim i Shpejtë
                </h4>
                <p className="text-xs text-gray-600">Brenda 30 minutave</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
