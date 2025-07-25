import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Receipt,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import OrderForm from "./OrderForm";

export type Status = "pending" | "preparing" | "delivering" | "delivered";

export type Order = {
  id: string;
  name: string;
  email: string;
  totalPrice: number;
  status: Status;
  createdAt: string;
  items?: any[]; // array e produkteve, opsionale
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orderRes, userRes] = await Promise.all([
        axios.get("http://localhost:3000/orders"),
        axios.get("http://localhost:3000/users"),
      ]);
      setOrders(orderRes.data);
      setUsers(userRes.data);
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

  const handleAddNew = () => {
    setEditingOrder(null);
    setShowOrderForm(true);
  };

  const handleFormClose = () => {
    setShowOrderForm(false);
    setEditingOrder(null);
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

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paneli i Administratorit</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <PlusCircle size={20} />
          <span>Porosi e Re</span>
        </button>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Totali Porosive"
          value={orders.length}
          icon={<Receipt />}
        />
        <StatCard title="Përdoruesit" value={users.length} icon={<Users />} />
        <StatCard
          title="Të Ardhura"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<DollarSign />}
        />
        <StatCard title="Në Pritje" value={pendingOrders} icon={<Clock />} />
      </div>

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

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center space-x-4">
      <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-300">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
