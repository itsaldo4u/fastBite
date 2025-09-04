import { useState, useEffect, useRef } from "react";
import axios from "axios";
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
const tabs = [
  { name: "Porositë", icon: ShoppingCart, color: "blue" },
  { name: "Përdoruesit", icon: UsersIcon, color: "green" },
  { name: "Të Ardhurat", icon: DollarSign, color: "purple" },
  { name: "Vlerësimet", icon: Star, color: "yellow" },
  { name: "Produktet", icon: Package, color: "red" },
  { name: "Ofertat", icon: ListOrderedIcon, color: "red" },
];

type Status = "pending" | "preparing" | "delivering" | "delivered";

type Order = {
  id: string;
  name: string;
  email: string;
  totalPrice: number;
  status: Status;
  createdAt: string;
  startTime?: string;
};

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("Porositë");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Merr të gjitha porositë
  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>(`http://localhost:3000/orders`);
      const fetchedOrders = res.data;

      setOrders(fetchedOrders);

      // Kontrollo për porosi të re
      const latest = fetchedOrders[fetchedOrders.length - 1];
      if (latest && latest.id !== latestOrderId) {
        if (latest.status === "pending") {
          setNotifications((prev) => prev + 1);
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }
        setLatestOrderId(latest.id);
      }
    } catch (error) {
      console.error("Gabim gjatë marrjes së porosive:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [latestOrderId]);

  // Ndryshon statusin e porosisë
  const handleStatusChange = async (orderId: string, newStatus: Status) => {
    try {
      // Nëse pranohet porosia (kalon nga pending në preparing), ruaj edhe startTime
      const dataToSend =
        newStatus === "preparing"
          ? { status: newStatus, startTime: new Date().toISOString() }
          : { status: newStatus };

      await axios.patch(`http://localhost:3000/orders/${orderId}`, dataToSend);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: newStatus,
                startTime: dataToSend.startTime ?? o.startTime,
              }
            : o
        )
      );

      setNotifications((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Gabim gjatë përditësimit të statusit:", error);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");

  const getColorClasses = (color: string, isActive: boolean) => {
    const styles: Record<string, string> = {
      blue: isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
        : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10",
      green: isActive
        ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
        : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10",
      purple: isActive
        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
        : "text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10",
      yellow: isActive
        ? "bg-yellow-600 text-white shadow-lg shadow-yellow-500/25"
        : "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/10",
    };
    return styles[color] || styles.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                aria-label="Toggle Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4 relative">
              <div className="relative">
                <button
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  onClick={() => {
                    setShowNotificationsDropdown(!showNotificationsDropdown);
                    setNotifications(0);
                  }}
                  aria-label="Hap njoftimet"
                >
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>

                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Porosi në pritje
                      </h4>
                      <button
                        onClick={() => setShowNotificationsDropdown(false)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        aria-label="Mbyll njoftimet"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div>
                      {pendingOrders.length === 0 ? (
                        <p className="p-4 text-center text-gray-600 dark:text-gray-400">
                          Nuk ka porosi në pritje.
                        </p>
                      ) : (
                        pendingOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Porosia #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleStatusChange(order.id, "preparing")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                              aria-label={`Prano porosinë ${order.id}`}
                            >
                              Prano
                            </button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Mirë se vini në panelin e administratorit
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Menaxho të dhënat e biznesit në mënyrë efikase.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setSelectedTab(tab.name)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${getColorClasses(
                  tab.color,
                  isActive
                )}`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {selectedTab === "Porositë" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Orders />
            </div>
          )}
          {selectedTab === "Produktet" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <ProductPage />
            </div>
          )}

          {selectedTab === "Përdoruesit" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <UsersManagement />
            </div>
          )}

          {selectedTab === "Të Ardhurat" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Revenue />
            </div>
          )}

          {selectedTab === "Vlerësimet" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Reviews />
            </div>
          )}
          {selectedTab === "Ofertat" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <OfferTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
