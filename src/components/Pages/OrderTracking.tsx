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
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Gjurmimi i Porosisë
            </h1>
            <p className="text-gray-600 text-lg">
              Ndiqni statusin e porosisë tuaj në kohë reale
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Search className="text-orange-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">
              Kërko Porosinë
            </h2>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Vendos ID e porosisë..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-lg"
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
              />
            </div>
            <button
              onClick={handleTrack}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Gjurmo
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
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
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Gjurmoni Porosinë Tuaj
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Shkruani numrin e porosisë për të parë statusin dhe detajet e
              porosisë tuaj në kohë reale.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-semibold text-gray-800">
                  Konfirmim i Shpejtë
                </h4>
                <p className="text-sm text-gray-600">
                  Merrni konfirmimin menjëherë
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChefHat className="w-8 h-8 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-800">Gatim i Freskët</h4>
                <p className="text-sm text-gray-600">
                  Ushqim i përgatitur porosi pas porosie
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="font-semibold text-gray-800">
                  Dorëzim i Shpejtë
                </h4>
                <p className="text-sm text-gray-600">
                  Dorëzojmë brenda 30 minutave
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
