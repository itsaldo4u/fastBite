// src/components/UserOrders.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import type { Order } from "../context/AuthContext";

export default function UserOrders() {
  const { currentUser } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Merr porositë e përdoruesit
  const fetchOrders = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get<Order[]>(
        `http://localhost:3000/orders?userId=${currentUser.id}`
      );
      setUserOrders(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e porosive:", error);
    }
  };

  // Fshij një porosi vetëm nga UI (jo nga serveri)
  const handleRemoveFromUI = (id: string) => {
    setUserOrders((prev) => prev.filter((order) => order.id !== id));
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        🧾 Faturat e Porosive
      </h2>

      {userOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Nuk ka porosi të ruajtura.
        </p>
      ) : (
        <ul className="space-y-4">
          {userOrders.map((order) => (
            <li
              key={order.id}
              className="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  Porosi #{order.id} - {order.status.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data:{" "}
                  {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Totali: ${order.totalPrice.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => handleRemoveFromUI(order.id)}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
              >
                Fshi nga UI
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
