import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Eye, X } from "lucide-react";
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
      const [orderRes] = await Promise.all([
        axios.get("http://localhost:3000/orders"),
        axios.get("http://localhost:3000/users"),
      ]);
      setOrders(orderRes.data);
    } catch (error) {
      console.error("Gabim në marrjen e të dhënave:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Status) => {
    try {
      await axios.patch(`http://localhost:3000/orders/${id}`, {
        status: newStatus,
      });

      if (newStatus === "delivered") {
        // Hiq nga lista pas 5 sekondash
        setTimeout(() => {
          setOrders((prev) => prev.filter((o) => o.id !== id));
        }, 5000);
      } else {
        // Përditëso vetëm statusin
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
      await axios.delete(`http://localhost:3000/orders/${id}`);
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
        // EDITIM
        await axios.patch(`http://localhost:3000/orders/${id}`, orderData);
      } else {
        // SHTIM
        await axios.post("http://localhost:3000/orders", {
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tabela e porosive */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Emri</th>
              <th className="p-3">Email</th>
              <th className="p-3">Totali</th>
              <th className="p-3">Data</th>
              <th className="p-3">Porosia</th>
              <th className="p-3">Statusi</th>
              <th className="p-3 text-center">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((order) => order.status !== "delivered") // Fshih nga UI vetëm
              .map((order) => (
                <tr
                  key={order.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.name}</td>
                  <td className="p-3">{order.email}</td>
                  <td className="p-3">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="truncate">
                      {getOrderSummary(order.items)}
                    </div>
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-blue-600 hover:text-blue-800 text-xs mt-1 underline"
                    >
                      Shiko detajet
                    </button>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as Status)
                      }
                      className="bg-white dark:bg-gray-900 border rounded px-2 py-1"
                    >
                      <option value="pending">Në Pritje</option>
                      <option value="preparing">Po përgatitet</option>
                      <option value="delivering">Po transportohet</option>
                      <option value="delivered">Dërguar</option>
                    </select>
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-green-600 hover:text-green-800"
                      aria-label={`Shiko detajet e porosisë ${order.id}`}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(order)}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label={`Edito porosinë ${order.id}`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={`Fshi porosinë ${order.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal për detajet e porosisë */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Detajet e Porosisë #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600"
                aria-label="Mbyll"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informacioni i klientit */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">
                  Informacioni i Klientit
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Emri:</span>{" "}
                    {selectedOrder.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.email}
                  </div>
                  {selectedOrder.phone && (
                    <div>
                      <span className="font-medium">Telefoni:</span>{" "}
                      {selectedOrder.phone}
                    </div>
                  )}
                  {selectedOrder.address && (
                    <div>
                      <span className="font-medium">Adresa:</span>{" "}
                      {selectedOrder.address}
                    </div>
                  )}
                  {selectedOrder.paymentMethod && (
                    <div>
                      <span className="font-medium">Pagesa:</span>{" "}
                      {selectedOrder.paymentMethod === "card"
                        ? "Kartë"
                        : "Para në dorë"}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Data:</span>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Artikujt e porositur */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Artikujt e Porositur
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            {item.size && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Madhësia: {item.size}
                              </p>
                            )}
                            {item.crust && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Brumi: {item.crust}
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
                            <p className="font-medium">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </p>
                            <p className="text-sm font-bold">
                              = ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Nuk ka artikuj të regjistruar
                    </p>
                  )}
                </div>
              </div>

              {/* Totali */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Totali:</span>
                  <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal për form-in e porosisë */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={handleFormClose}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
              aria-label="Mbyll"
            >
              ✕
            </button>
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
