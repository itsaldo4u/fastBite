import { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  Eye,
  X,
  ShoppingCart,
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Package,
} from "lucide-react";
import OrderForm from "./OrderForm";

export type Status = "pending" | "preparing" | "delivering" | "delivered";

export type OrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  crust?: string;
  toppings?: string[];
};

export type Order = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  totalPrice: number;
  status: Status;
  createdAt: string;
  items?: OrderItem[];
};

const BACKEND_URL = `${import.meta.env.VITE_API_URL}/orders`;

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(BACKEND_URL);
      const data = res.data.map((o: any) => ({ ...o, id: o._id }));
      setOrders(data);
    } catch (error) {
      console.error("Gabim në marrjen e të dhënave:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Status) => {
    try {
      await axios.patch(`${BACKEND_URL}/${id}/status`, { status: newStatus });

      if (newStatus === "delivered") {
        setTimeout(() => {
          setOrders((prev) => prev.filter((o) => o.id !== id));
        }, 5000);
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të statusit:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("A jeni i sigurt që doni të fshini këtë porosi?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      console.error("Gabim gjatë fshirjes së porosisë:", error);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  const handleFormClose = () => {
    setShowOrderForm(false);
    setEditingOrder(null);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleFormSubmit = async (
    orderData: Omit<Order, "id" | "createdAt">,
    id?: string
  ) => {
    try {
      if (id) {
        await axios.patch(`${BACKEND_URL}/${id}`, orderData);
      } else {
        await axios.post(BACKEND_URL, {
          ...orderData,
          createdAt: new Date().toISOString(),
        });
      }
      fetchData();
      handleFormClose();
    } catch (error) {
      console.error("Gabim gjatë ruajtjes së porosisë:", error);
      alert("Ndodhi një gabim gjatë ruajtjes së porosisë.");
    }
  };

  const getOrderSummary = (items?: OrderItem[]) => {
    if (!items || items.length === 0) return "Nuk ka artikuj";

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (items.length === 1) {
      return `${totalItems}x ${items[0].title}`;
    }
    return `${totalItems} artikuj (${items.length} lloje)`;
  };

  const shortenId = (id: string) =>
    `${id.substring(0, 4)}...${id.substring(id.length - 4)}`;

  const getStatusColor = (status: Status) => {
    const colors = {
      pending: "from-yellow-500 to-orange-500",
      preparing: "from-blue-500 to-cyan-500",
      delivering: "from-purple-500 to-pink-500",
      delivered: "from-green-500 to-emerald-500",
    };
    return colors[status];
  };

  // const getStatusText = (status: Status) => {
  //   const text = {
  //     pending: "Në Pritje",
  //     preparing: "Po përgatitet",
  //     delivering: "Po transportohet",
  //     delivered: "Dërguar",
  //   };
  //   return text[status];
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Lista e Porosive</h1>
              <p className="text-white/90 text-sm">
                Menaxho të gjitha porositë e klientëve
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingOrder(null);
              setShowOrderForm(true);
            }}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-white/30"
          >
            <Plus className="w-5 h-5" />
            Shto Porosi
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600">
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  ID
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Emri
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Email
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Totali
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Data
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Porosia
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Statusi
                </th>
                <th className="p-4 text-center text-sm font-bold text-gray-800 dark:text-white">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((order) => order.status !== "delivered")
                .map((order, index) => (
                  <tr
                    key={order.id}
                    className={`text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <td className="p-4" title={order.id}>
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {shortenId(order.id)}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{order.name}</td>
                    <td className="p-4 text-sm">{order.email}</td>
                    <td className="p-4">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-md">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="truncate text-sm">
                        {getOrderSummary(order.items)}
                      </div>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs mt-1 underline font-medium"
                      >
                        Shiko detajet →
                      </button>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as Status)
                        }
                        className={`bg-gradient-to-r ${getStatusColor(
                          order.status
                        )} text-white border-2 border-white/30 rounded-lg px-3 py-2 font-semibold text-sm shadow-md cursor-pointer hover:shadow-lg transition-all`}
                      >
                        <option value="pending">Në Pritje</option>
                        <option value="preparing">Po përgatitet</option>
                        <option value="delivering">Po transportohet</option>
                        <option value="delivered">Dërguar</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                          title="Shiko detajet"
                          aria-label={`Shiko detajet e porosisë ${order.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(order)}
                          className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                          title="Edito"
                          aria-label={`Edito porosinë ${order.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                          title="Fshi"
                          aria-label={`Fshi porosinë ${order.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {orders.filter((o) => o.status !== "delivered").length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                Nuk ka porosi aktive
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-t-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
            <span className="text-lg">🛒</span>
            Gjithsej {
              orders.filter((o) => o.status !== "delivered").length
            }{" "}
            porosi aktive
          </p>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border-2 border-gray-200 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Detajet e Porosisë</h2>
                    <p className="text-white/90 text-sm">
                      ID: {selectedOrder.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 rounded-lg text-white/90 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                  aria-label="Mbyll"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
              {/* Customer Info */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <User className="w-5 h-5 text-blue-500" />
                  Informacioni i Klientit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-purple-500 mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Emri:
                      </span>{" "}
                      <span className="text-gray-800 dark:text-white">
                        {selectedOrder.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Email:
                      </span>{" "}
                      <span className="text-gray-800 dark:text-white text-sm">
                        {selectedOrder.email}
                      </span>
                    </div>
                  </div>
                  {selectedOrder.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-blue-500 mt-1" />
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Telefoni:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-white">
                          {selectedOrder.phone}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedOrder.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-500 mt-1" />
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Adresa:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-white">
                          {selectedOrder.address}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedOrder.paymentMethod && (
                    <div className="flex items-start gap-2">
                      <CreditCard className="w-4 h-4 text-yellow-500 mt-1" />
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Pagesa:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-white">
                          {selectedOrder.paymentMethod === "card"
                            ? "Kartë"
                            : "Para në dorë"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-pink-500 mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Data:
                      </span>{" "}
                      <span className="text-gray-800 dark:text-white text-sm">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <ShoppingCart className="w-5 h-5 text-purple-500" />
                  Artikujt e Porositur
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 dark:text-white">
                              {item.title}
                            </h4>
                            {item.size && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <span className="font-medium">Madhësia:</span>{" "}
                                {item.size}
                              </p>
                            )}
                            {item.crust && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Brumi:</span>{" "}
                                {item.crust}
                              </p>
                            )}
                            {item.toppings && item.toppings.length > 0 && (
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <span className="font-medium">Përbërësit:</span>{" "}
                                {item.toppings.join(", ")}
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </p>
                            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Nuk ka artikuj të regjistruar
                    </p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-center text-white">
                  <span className="text-xl font-bold">Totali:</span>
                  <span className="text-3xl font-bold">
                    ${selectedOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border-2 border-gray-200 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden">
            <OrderForm
              order={editingOrder}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
