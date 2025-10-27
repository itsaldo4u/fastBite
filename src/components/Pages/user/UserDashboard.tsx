// src/components/Pages/user/UserDashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import UserProfile from "./UserProfile";
import UserInvoices from "./UserInvoices";
import Rewards from "../../Rewards";
import OrderCard from "../OrderCard";
import { useAuth, AuthProvider } from "../../context/AuthContext";
import { useProduct } from "../../context/ProductContext";

// ----------------------------------------------------
// Tipat
export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "preparing" | "delivering" | "delivered";

export interface Order {
  _id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  prepTime: number;
  items: OrderItem[];
  review?: string;
  trackingId?: string;
}

// ----------------------------------------------------
export function OrdersPanel() {
  const { currentUser } = useAuth();
  const { fetchProducts } = useProduct();
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeLeftMap, setTimeLeftMap] = useState<Record<string, number>>({});
  const [reviewMap, setReviewMap] = useState<Record<string, string>>({});
  const [ratingMap, setRatingMap] = useState<
    Record<string, Record<string, number>>
  >({});
  const [activeTab, setActiveTab] = useState<
    "orders" | "profile" | "invoices" | "rewards"
  >("orders");

  // Marrja e porosive
  const fetchUserOrders = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get<Order[]>(
        `http://localhost:5000/orders?userId=${currentUser._id}`
      );
      const filtered = res.data.filter(
        (order) => !(order.status === "delivered" && order.review)
      );
      setOrders(filtered);

      const newMap: Record<string, number> = {};
      filtered.forEach((order) => {
        if (order.status === "pending" || order.status === "preparing") {
          const createdAtMs = new Date(order.createdAt).getTime();
          const elapsedMinutes = (Date.now() - createdAtMs) / 60000;
          const left = order.prepTime - elapsedMinutes;
          newMap[order._id] = left > 0 ? Math.ceil(left) : 0;
        }
      });
      setTimeLeftMap(newMap);
    } catch (error) {
      console.error("Gabim në marrjen e porosive:", error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    if (currentUser) {
      const interval = setInterval(fetchUserOrders, 60000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Ndryshimi i komentit
  const handleReviewChange = (orderId: string, value: string) => {
    setReviewMap((prev) => ({ ...prev, [orderId]: value }));
  };

  // Ndryshimi i rating-ut për produktet
  const handleRatingChange = (
    orderId: string,
    productTitle: string,
    rating: number
  ) => {
    setRatingMap((prev) => ({
      ...prev,
      [orderId]: { ...(prev[orderId] || {}), [productTitle]: rating },
    }));
  };

  // Dërgimi i review + ratings
  const handleReviewSubmit = async (orderId: string, items: OrderItem[]) => {
    if (!currentUser) return;

    const review = reviewMap[orderId]?.trim() || "";
    const productRatings = ratingMap[orderId] || {};

    if (!review) {
      alert("Ju lutem shkruani një koment para se ta dërgoni.");
      return;
    }
    if (Object.keys(productRatings).length === 0) {
      alert("Ju lutem vlerësoni të paktën një produkt për të dërguar rating.");
      return;
    }

    try {
      // 1️⃣ Përditëso porosinë me review
      await axios.patch(`http://localhost:5000/orders/${orderId}/review`, {
        review,
        ratingMap: productRatings,
      });

      // 2️⃣ Dërgo rating-et për çdo produkt
      const ratingPromises = items.map((item) => {
        const rating = productRatings[item.title];
        if (!rating) return Promise.resolve();

        const validRating = Number(rating);
        if (isNaN(validRating) || validRating < 1 || validRating > 5) {
          return Promise.resolve();
        }

        const payload = {
          orderId,
          userId: currentUser._id,
          name: currentUser.name || "Anonim",
          comment: review,
          productId: item.id,
          productTitle: item.title,
          rating: validRating,
        };

        return axios.post("http://localhost:5000/ratings", payload);
      });

      await Promise.all(ratingPromises);
      await fetchProducts();

      // 3️⃣ Pastro state
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      setReviewMap((prev) => {
        const newMap = { ...prev };
        delete newMap[orderId];
        return newMap;
      });
      setRatingMap((prev) => {
        const newMap = { ...prev };
        delete newMap[orderId];
        return newMap;
      });

      alert("Koment dhe rating u dërguan me sukses!");
    } catch (error: any) {
      alert(
        `Ndodhi një gabim: ${error.response?.data?.message || error.message}`
      );
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 bg-[length:400%_400%] animate-gradient-shift" />

        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />

        {/* Floating decorative elements */}
        <div className="absolute top-1/5 left-1/10 text-5xl opacity-10 animate-float">
          🍔
        </div>
        <div className="absolute top-3/5 right-1/6 text-5xl opacity-10 animate-float-delayed">
          🍟
        </div>
        <div className="absolute bottom-1/4 left-1/5 text-5xl opacity-10 animate-float-extra">
          🥤
        </div>

        <div className="relative bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center z-10 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Ju lutemi Hyni!
          </h2>
          <p className="text-gray-700">
            Për të parë porositë dhe detajet e profilit tuaj, duhet të jeni të
            loguar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 bg-[length:400%_400%] animate-gradient-shift" />

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent" />

      {/* Floating decorative elements */}
      <div className="absolute top-1/6 left-1/12 text-5xl opacity-10 animate-float">
        🍕
      </div>
      <div className="absolute top-2/5 right-1/10 text-5xl opacity-10 animate-float-delayed">
        🍔
      </div>
      <div className="absolute bottom-1/5 left-1/4 text-5xl opacity-10 animate-float-extra">
        🌮
      </div>
      <div className="absolute top-3/4 right-1/5 text-5xl opacity-10 animate-float">
        🍟
      </div>
      <div className="absolute top-1/2 left-1/6 text-5xl opacity-10 animate-float-delayed">
        🥤
      </div>
      <div className="absolute bottom-1/3 right-1/3 text-5xl opacity-10 animate-float-extra">
        🍦
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-3xl">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center relative">
            {currentUser.name
              ? `Mirë se vjen, ${currentUser.name}! 👋`
              : "Paneli i Përdoruesit"}
            <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-2 mb-6">
          <div className="flex justify-center space-x-2 md:space-x-3 overflow-x-auto">
            {[
              { key: "orders", label: "Porositë Aktive", emoji: "📦" },
              { key: "invoices", label: "Faturat", emoji: "🧾" },
              { key: "profile", label: "Profili Im", emoji: "👤" },
              { key: "rewards", label: "Rewards", emoji: "🎁" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm md:text-base relative overflow-hidden ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === "orders" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {orders.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 text-center transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-3xl">
                <div className="text-7xl mb-4 animate-bounce">🍕</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Nuk keni asnjë porosi aktualisht
                </h2>
                <p className="text-gray-600">
                  Porosisni ushqimin tuaj të preferuar dhe ndiqeni këtu!
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl"
                >
                  <OrderCard
                    order={order}
                    timeLeft={timeLeftMap[order._id] || 0}
                    reviewMap={reviewMap}
                    ratingMap={ratingMap}
                    onReviewChange={handleReviewChange}
                    onRatingChange={handleRatingChange}
                    onReviewSubmit={handleReviewSubmit}
                  />
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "profile" && (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-3xl">
            <UserProfile />
          </div>
        )}
        {activeTab === "invoices" && (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-3xl">
            <UserInvoices />
          </div>
        )}
        {activeTab === "rewards" && (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-3xl">
            <Rewards />
          </div>
        )}
      </div>
    </div>
  );
}

// Komponenti App
export default function App() {
  return (
    <AuthProvider>
      <OrdersPanel />
    </AuthProvider>
  );
}
