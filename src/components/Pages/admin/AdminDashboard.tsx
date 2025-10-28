import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  Star,
  Menu,
  Bell,
  ListOrdered,
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
  { name: "Përdoruesit", icon: Users, color: "green" },
  { name: "Të Ardhurat", icon: DollarSign, color: "purple" },
  { name: "Vlerësimet", icon: Star, color: "yellow" },
  { name: "Produktet", icon: Package, color: "red" },
  { name: "Ofertat", icon: ListOrdered, color: "pink" },
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
  }, [orders, latestOrderId, pendingOrders]);

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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl border-b-4 border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left - Sidebar toggle + title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 sm:p-2 rounded-lg text-white/90 hover:bg-white/20 lg:hidden backdrop-blur-sm transition-all duration-200 hover:scale-105 flex-shrink-0"
                aria-label="Toggle Sidebar"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg flex-shrink-0">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-white truncate">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-white/80 hidden sm:block">
                    Paneli i menaxhimit
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Notifications */}
            <div className="flex items-center space-x-2 sm:space-x-4 relative">
              <div className="relative">
                <button
                  className="p-1.5 sm:p-2 rounded-lg text-white/90 hover:bg-white/20 relative backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  onClick={() =>
                    setShowNotificationsDropdown(!showNotificationsDropdown)
                  }
                  aria-label="Hap njoftimet"
                >
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] sm:text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {notifications}
                    </span>
                  )}
                </button>

                {showNotificationsDropdown && (
                  <div className="fixed inset-x-3 sm:absolute sm:inset-x-auto sm:right-0 mt-2 w-auto sm:w-96 max-h-[80vh] sm:max-h-[500px] overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50">
                    <div className="sticky top-0 flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600 z-10">
                      <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        Porosi të reja ({pendingOrders.length})
                      </h4>
                      <button
                        onClick={() => setShowNotificationsDropdown(false)}
                        className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                        aria-label="Mbyll njoftimet"
                      >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>

                    <div>
                      {pendingOrders.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl sm:text-3xl">✓</span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                            Nuk ka porosi në pritje
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Të gjitha porositë janë pranuar!
                          </p>
                        </div>
                      ) : (
                        pendingOrders.map((order) => (
                          <div
                            key={`notification-${order._id}`}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                          >
                            <div className="p-3 sm:p-4">
                              <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                                      {order.name}
                                    </span>
                                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                                      E RE
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                                    ID: {order._id.substring(0, 8)}...
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    📅{" "}
                                    {new Date(order.createdAt).toLocaleString(
                                      "sq-AL",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-3 py-1 rounded-lg font-bold text-xs sm:text-sm shadow-md inline-block">
                                    ${order.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                                <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">
                                  📦 Artikujt:
                                </p>
                                {order.items && order.items.length > 0 ? (
                                  <div className="space-y-1">
                                    {order.items
                                      .slice(0, 2)
                                      .map((item, idx) => (
                                        <div
                                          key={`item-${order._id}-${idx}`}
                                          className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate"
                                        >
                                          • {item.quantity}x {item.title}
                                        </div>
                                      ))}
                                    {order.items.length > 2 && (
                                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 italic">
                                        +{order.items.length - 2} të tjera...
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                                    Nuk ka të dhëna
                                  </p>
                                )}
                              </div>

                              <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-2 sm:mb-3">
                                <p className="truncate">📧 {order.email}</p>
                                {order.phone && (
                                  <p className="truncate">📞 {order.phone}</p>
                                )}
                                {order.address && (
                                  <p className="truncate">📍 {order.address}</p>
                                )}
                              </div>

                              <button
                                onClick={() => handleAcceptOrder(order._id)}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                              >
                                <span className="text-base sm:text-lg">✓</span>
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

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2">
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
                className={`flex-shrink-0 flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${getColorClasses(
                  tab.color,
                  isActive
                )}`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="whitespace-nowrap">{tab.name}</span>
                {tab.name === "Porositë" && activeOrders > 0 && (
                  <span className="bg-blue-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    {activeOrders}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        {selectedTab === "Porositë" && <Orders />}
        {selectedTab === "Produktet" && <ProductPage />}
        {selectedTab === "Përdoruesit" && <UsersManagement />}
        {selectedTab === "Të Ardhurat" && <Revenue />}
        {selectedTab === "Vlerësimet" && <Reviews />}
        {selectedTab === "Ofertat" && <OfferTable />}
      </div>
    </div>
  );
}
