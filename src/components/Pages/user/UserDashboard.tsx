import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "./UserProfile";
import UserInvoices from "./UserInvoices";
import Rewards from "../../Rewards";

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "preparing" | "delivering" | "delivered";

export interface Order {
  id: number;
  userId: number;
  createdAt: string;
  status: OrderStatus;
  prepTime: number;
  items: OrderItem[];
  review?: string;
}

export const steps = [
  {
    id: 1,
    label: "Ne Pritje",
    icon: "🧑‍🍳",
    desc: "Porosia eshte ne pritje , po mblidhen perbersit !",
  },
  { id: 2, label: "Në Furre", icon: "🔥", desc: "Pica juaj po piqet" },
  {
    id: 3,
    label: "Për Shpërndarje",
    icon: "🛵",
    desc: "Dorëzuesi është në rrugë",
  },
  { id: 4, label: "Dorëzuar", icon: "📬", desc: "Porosia është dorëzuar" },
];

export const statusToStep: Record<OrderStatus, number> = {
  pending: 1,
  preparing: 2,
  delivering: 3,
  delivered: 4,
};

const isDrink = (title: string) =>
  title.toLowerCase().includes("pije") || title.toLowerCase().includes("drink");

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative flex justify-between items-center w-full max-w-sm mx-auto my-3">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div
            key={step.id}
            className="relative flex-1 flex flex-col items-center"
          >
            {index !== 0 && (
              <div
                className={`absolute top-4 -left-1/2 h-1 w-full z-0 transition-all duration-500 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gray-300"
                }`}
              />
            )}
            <div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 transform ${
                isCompleted
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white scale-105 shadow"
                  : isActive
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white scale-105 shadow animate-pulse"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {isCompleted ? "✓" : step.icon}
            </div>
            <div
              className={`mt-1 text-[11px] font-semibold text-center ${
                isCompleted || isActive
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "from-yellow-400 to-yellow-500";
    case "preparing":
      return "from-orange-400 to-orange-600";
    case "delivering":
      return "from-blue-400 to-blue-600";
    case "delivered":
      return "from-green-400 to-green-600";
    default:
      return "from-gray-400 to-gray-500";
  }
}

function getStatusText(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Porosia juaj është marrë dhe do të përgatitet së shpejti.";
    case "preparing":
      return "Pica juaj është në përgatitje.";
    case "delivering":
      return "Porosia është nisur për dorëzim.";
    case "delivered":
      return "Porosia është dorëzuar me sukses.";
    default:
      return "Status i panjohur";
  }
}

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeLeftMap, setTimeLeftMap] = useState<Record<number, number>>({});
  const [reviewMap, setReviewMap] = useState<Record<number, string>>({});
  const [ratingMap, setRatingMap] = useState<
    Record<number, Record<string, number>>
  >({});
  const [activeTab, setActiveTab] = useState<
    "orders" | "profile" | "invoices" | "rewards"
  >("orders");

  const fetchUserOrders = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get<Order[]>(
        `http://localhost:3000/orders?userId=${currentUser.id}`
      );

      // Filter orders: hiq ato që janë delivered dhe kanë review
      const filtered = res.data.filter(
        (order) => !(order.status === "delivered" && order.review)
      );

      setOrders(filtered);

      const newMap: Record<number, number> = {};
      filtered.forEach((order) => {
        if (order.status === "pending" || order.status === "preparing") {
          const createdAtMs = new Date(order.createdAt).getTime();
          const nowMs = Date.now();
          const elapsedMinutes = (nowMs - createdAtMs) / 60000;
          const left = order.prepTime - elapsedMinutes;
          newMap[order.id] = left > 0 ? Math.ceil(left) : 0;
        }
      });
      setTimeLeftMap(newMap);
    } catch (error) {
      console.error("Gabim në marrjen e porosive:", error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    const interval = setInterval(fetchUserOrders, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleReviewChange = (orderId: number, value: string) => {
    setReviewMap((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleRatingChange = (
    orderId: number,
    productTitle: string,
    rating: number
  ) => {
    setRatingMap((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [productTitle]: rating,
      },
    }));
  };

  const handleReviewSubmit = async (orderId: number, _items: OrderItem[]) => {
    const review = reviewMap[orderId];
    if (!currentUser) return;

    try {
      await axios.patch(`http://localhost:3000/orders/${orderId}`, { review });

      const productReviews = Object.entries(ratingMap[orderId] || {});
      await Promise.all(
        productReviews.map(([productTitle, rating]) =>
          axios.post("http://localhost:3000/ratings", {
            userId: currentUser.id,
            name: currentUser.name || "Përdorues Anonim",
            comment: review,
            productTitle,
            rating,
            createdAt: new Date().toISOString(),
          })
        )
      );

      alert("Faleminderit për vlerësimin!");

      setOrders((prev) => prev.filter((order) => order.id !== orderId));

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
    } catch (error) {
      console.error("Gabim në ruajtjen e review:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Buttons për ndërrim tab-esh */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeTab === "orders"
                ? "bg-orange-600 text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            Porositë Aktive
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeTab === "invoices"
                ? "bg-orange-600 text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            Faturat
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeTab === "profile"
                ? "bg-orange-600 text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            Profili Im
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeTab === "rewards"
                ? "bg-orange-600 text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            Rewards & Kupona
          </button>
        </div>

        {/* Sekcionet sipas tab-it aktiv */}
        {activeTab === "orders" && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">🍕</div>
                <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Nuk keni asnjë porosi aktualisht
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Porosisni picën tuaj të preferuar dhe ndiqeni këtu!
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {orders.map((order: Order) => {
                  const currentStep = statusToStep[order.status];
                  const timeLeft = timeLeftMap[order.id] || 0;
                  const isDelivered = order.status === "delivered";

                  return (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-100 dark:border-gray-700"
                    >
                      <div
                        className={`bg-gradient-to-r ${getStatusColor(
                          order.status
                        )} p-4 text-white relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                              <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
                                #{order.id}
                              </span>
                              Porosia Juaj
                            </h2>
                            <p className="text-white/90 text-sm flex items-center gap-2">
                              <span>🕒</span>
                              {new Date(order.createdAt).toLocaleDateString(
                                "sq-AL",
                                {
                                  day: "numeric",
                                  month: "long",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            <p className="text-white/80 text-xs mt-1 bg-white/20 rounded-full px-2 py-1 inline-block">
                              {getStatusText(order.status)}
                            </p>
                          </div>
                          <div className="text-4xl animate-bounce">
                            {steps[currentStep - 1]?.icon}
                          </div>
                        </div>
                        <Stepper currentStep={currentStep} />
                      </div>

                      <div className="p-4">
                        {isDelivered ? (
                          <div className="text-center py-3">
                            <div className="text-4xl mb-3 animate-bounce">
                              🎉
                            </div>
                            <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                              Porosia #{order.id} është dorëzuar me sukses!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                              🍕 Shijojeni picën tuaj të shijshme dhe mos
                              harroni të na vlerësoni! ⭐
                            </p>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <div className="flex items-center gap-3 mb-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="text-2xl">
                                {steps[currentStep - 1]?.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                  {steps[currentStep - 1]?.label}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {steps[currentStep - 1]?.desc}
                                </p>
                              </div>
                            </div>
                            {timeLeft > 0 && (
                              <div className="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                                    <span className="text-lg">⏱️</span>
                                    <span className="font-medium">
                                      Koha e mbetur: {timeLeft} minuta
                                    </span>
                                  </div>
                                  <div className="w-16 h-2 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000"
                                      style={{
                                        width: `${Math.max(
                                          0,
                                          Math.min(
                                            100,
                                            ((order.prepTime - timeLeft) /
                                              order.prepTime) *
                                              100
                                          )
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-600">
                          <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <span className="text-lg">📋</span>
                            Produktet e Porosisë:
                          </h3>
                          <div className="space-y-2">
                            {order.items?.map((item: OrderItem, i: number) => (
                              <div
                                key={i}
                                className="flex flex-col gap-2 py-3 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">🍕</span>
                                    <div>
                                      <span className="font-medium text-gray-800 dark:text-white">
                                        {item.title}
                                      </span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                                          Sasia: {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>

                                {isDelivered && !isDrink(item.title) && (
                                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      Vlerësoni këtë produkt:
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          size={20}
                                          className={`cursor-pointer transition-all duration-200 hover:scale-110 ${
                                            (ratingMap[order.id]?.[
                                              item.title
                                            ] || 0) >= star
                                              ? "fill-yellow-400 stroke-yellow-500"
                                              : "stroke-gray-400 hover:stroke-yellow-400"
                                          }`}
                                          onClick={() =>
                                            handleRatingChange(
                                              order.id,
                                              item.title,
                                              star
                                            )
                                          }
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {isDelivered && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleReviewSubmit(order.id, order.items);
                            }}
                            className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700"
                          >
                            <label
                              htmlFor={`review-${order.id}`}
                              className="block font-semibold mb-2 text-gray-800 dark:text-gray-200"
                            >
                              Lërni një koment për porosinë:
                            </label>
                            <textarea
                              id={`review-${order.id}`}
                              rows={4}
                              value={reviewMap[order.id] || ""}
                              onChange={(e) =>
                                handleReviewChange(order.id, e.target.value)
                              }
                              className="w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white"
                              placeholder="Shkruani këtu komentet tuaja..."
                              required
                            ></textarea>
                            <button
                              type="submit"
                              className="mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow transition-colors"
                            >
                              Dërgo Komentin
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "invoices" && <UserInvoices />}
        {activeTab === "rewards" && <Rewards />}
      </div>
    </div>
  );
}
