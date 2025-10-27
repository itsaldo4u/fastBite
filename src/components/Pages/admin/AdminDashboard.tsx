import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Users as UsersIcon,
  DollarSign,
  Package,
  Star,
  Menu,
  Bell,
  ListOrderedIcon,
  X,
} from "lucide-react";
import UsersManagement from "./UsersManagement";
import Revenue from "./Revenue";
import Reviews from "./Reviews";
import Orders from "./Orders";
import ProductPage from "./ProductPage";
import OfferTable from "./OfferTable";
import { useOrders } from "../../context/OrdersContext";
import toast from "react-hot-toast";
import axios from "axios";

const tabs = [
  { name: "Porositë", icon: ShoppingCart, color: "blue" },
  { name: "Përdoruesit", icon: UsersIcon, color: "green" },
  { name: "Të Ardhurat", icon: DollarSign, color: "purple" },
  { name: "Vlerësimet", icon: Star, color: "yellow" },
  { name: "Produktet", icon: Package, color: "red" },
  { name: "Ofertat", icon: ListOrderedIcon, color: "pink" },
];

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("Porositë");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { orders, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "pending");

  // Play sound when new pending order arrives
  useEffect(() => {
    if (pendingOrders.length > 0) {
      const latest = pendingOrders[pendingOrders.length - 1];
      if (latest && latest._id !== latestOrderId) {
        setNotifications(pendingOrders.length);
        audioRef.current?.play().catch(() => {});
        setLatestOrderId(latest._id);
      } else {
        setNotifications(pendingOrders.length);
      }
    } else {
      setNotifications(0);
    }
  }, [orders, latestOrderId]);

  // Accept order — just mark in frontend for now
  const handleAcceptOrder = async (id: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, {
        status: "preparing",
      });

      toast.success(`Porosia ${id.substring(0, 8)} u pranua!`);
      fetchOrders();
    } catch (error) {
      console.error("Gabim gjatë pranimit të porosisë:", error);
      toast.error("Ndodhi një gabim gjatë pranimit të porosisë.");
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    const styles: Record<string, string> = {
      blue: isActive
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
        : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800",
      green: isActive
        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
        : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 border-2 border-green-200 dark:border-green-800",
      purple: isActive
        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
        : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800",
      yellow: isActive
        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30"
        : "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800",
      red: isActive
        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
        : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-red-200 dark:border-red-800",
      pink: isActive
        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
        : "text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 border-2 border-pink-200 dark:border-pink-800",
    };
    return styles[color] || styles.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl border-b-4 border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-lg text-white/90 hover:bg-white/20 lg:hidden backdrop-blur-sm transition-all duration-200 hover:scale-105"
                aria-label="Toggle Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-white/80">Paneli i menaxhimit</p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center space-x-4 relative">
              <div className="relative">
                <button
                  className="p-2.5 rounded-lg text-white/90 hover:bg-white/20 relative backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    setShowNotificationsDropdown(!showNotificationsDropdown);
                  }}
                  aria-label="Hap njoftimet"
                >
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {notifications}
                    </span>
                  )}
                </button>

                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-2 w-96 max-h-[500px] overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 transform transition-all duration-200">
                    <div className="sticky top-0 flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600 z-10">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-500" />
                        Porosi të reja ({pendingOrders.length})
                      </h4>
                      <button
                        onClick={() => setShowNotificationsDropdown(false)}
                        className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                        aria-label="Mbyll njoftimet"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div>
                      {pendingOrders.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl">✓</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Nuk ka porosi në pritje
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Të gjitha porositë janë pranuar!
                          </p>
                        </div>
                      ) : (
                        pendingOrders.map((order) => (
                          <div
                            key={`notification-${order._id}`}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900 dark:text-white">
                                      {order.name}
                                    </span>
                                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                                      E RE
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ID: {order._id.substring(0, 8)}...
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    📅{" "}
                                    {new Date(order.createdAt).toLocaleString(
                                      "sq-AL",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-md inline-block">
                                    ${order.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Order Items Summary */}
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                  📦 Artikujt:
                                </p>
                                {order.items && order.items.length > 0 ? (
                                  <div className="space-y-1">
                                    {order.items
                                      .slice(0, 2)
                                      .map((item, idx) => (
                                        <div
                                          key={`item-${order._id}-${idx}`}
                                          className="text-sm text-gray-700 dark:text-gray-300"
                                        >
                                          • {item.quantity}x {item.title}
                                        </div>
                                      ))}
                                    {order.items.length > 2 && (
                                      <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                                        +{order.items.length - 2} të tjera...
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-500">
                                    Nuk ka të dhëna
                                  </p>
                                )}
                              </div>

                              {/* Contact Info */}
                              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                                <p>📧 {order.email}</p>
                                {order.phone && <p>📞 {order.phone}</p>}
                                {order.address && (
                                  <p className="truncate">📍 {order.address}</p>
                                )}
                              </div>

                              {/* Accept Button */}
                              <button
                                onClick={() => handleAcceptOrder(order._id)}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                aria-label={`Prano porosinë nga ${order.name}`}
                              >
                                <span className="text-lg">✓</span>
                                Prano Porosinë
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Mirë se vini në panelin e administratorit
          </h2>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span className="text-xl">📊</span>
            Menaxho të dhënat e biznesit në mënyrë efikase.
            {pendingOrders.length > 0 && (
              <span className="ml-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                🔔 {pendingOrders.length} porosi të reja!
              </span>
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.name;
            const activeOrders = orders.filter(
              (o) => o.status === "preparing" || o.status === "delivering"
            ).length;

            return (
              <button
                key={tab.name}
                onClick={() => setSelectedTab(tab.name)}
                className={`flex items-center space-x-3 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${getColorClasses(
                  tab.color,
                  isActive
                )}`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
                {tab.name === "Porositë" && activeOrders > 0 && (
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {activeOrders}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300 ease-in-out">
          {selectedTab === "Porositë" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-all duration-300">
              <Orders />
            </div>
          )}

          {selectedTab === "Produktet" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-all duration-300">
              <ProductPage />
            </div>
          )}

          {selectedTab === "Përdoruesit" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-all duration-300">
              <UsersManagement />
            </div>
          )}

          {selectedTab === "Të Ardhurat" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-all duration-300">
              <Revenue />
            </div>
          )}

          {selectedTab === "Vlerësimet" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-all duration-300">
              <Reviews />
            </div>
          )}

          {selectedTab === "Ofertat" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-all duration-300">
              <OfferTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
