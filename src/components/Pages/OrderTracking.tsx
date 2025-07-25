import { useState } from "react";
import axios from "axios";
import OrderCard from "./OrderCard";

import type { Order } from "./UserDashboard";
import { statusToStep } from "./UserDashboard"; // duhet të eksportosh statusToStep nga UserDashboard ose nga një utils file

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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gjurmimi i Porosisë
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Vendos ID e porosisë..."
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handleTrack}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Gjurmo
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {order && (
        <OrderCard
          order={order}
          timeLeft={timeLeft}
          currentStep={statusToStep[order.status]}
          showReview={false} // nuk e shfaq komentimin në këtë modalitet
        />
      )}
    </div>
  );
}
