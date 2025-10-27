// src/components/UserInvoices.tsx
import { useEffect, useState } from "react";
import {
  Download,
  Eye,
  Search,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Trash2,
  Receipt,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import type { Order } from "../../context/OrdersContext";

export default function UserInvoices() {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch delivered orders
  const fetchDeliveredOrders = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const res = await axios.get<Order[]>(
        `http://localhost:5000/orders/user-invoices/${currentUser._id}`
      );
      setInvoices(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e porosive të dorëzuara:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete invoice
  const handleDelete = async (_id: string) => {
    if (!window.confirm("Jeni i sigurt që doni të fshini këtë faturë?")) return;
    try {
      await axios.delete(`http://localhost:5000/orders/${_id}`);
      setInvoices((prev) => prev.filter((order) => order._id !== _id));
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error);
      alert("Ndodhi një gabim gjatë fshirjes së faturës.");
    }
  };

  // Generate invoice HTML
  const generateInvoiceHTML = (order: Order) => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Fatura #${order._id}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gradient-to-br from-indigo-500 to-purple-600 min-h-screen p-4 text-sm">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
          <div class="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 text-center">
            <h1 class="text-2xl font-bold mb-1">🧾 FATURA</h1>
            <p>Porosia #${order._id}</p>
          </div>
          <div class="p-4 space-y-4">
            <div class="grid md:grid-cols-2 gap-2">
              <div class="bg-gray-50 p-3 rounded border-l-4 border-indigo-500">
                <h3 class="font-semibold mb-2">👤 Klienti</h3>
                <p><span class="font-medium">Emri:</span> ${order.name}</p>
                <p><span class="font-medium">Email:</span> ${order.email}</p>
                <p><span class="font-medium">Tel:</span> ${order.phone}</p>
                <p><span class="font-medium">Adresa:</span> ${order.address}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded border-l-4 border-indigo-500">
                <h3 class="font-semibold mb-2">📅 Detajet e Porosisë</h3>
                <p><span class="font-medium">ID:</span> #${order._id}</p>
                <p><span class="font-medium">Data:</span> ${new Date(
                  order.createdAt
                ).toLocaleDateString("sq-AL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
                <p><span class="font-medium">Pagesa:</span> ${
                  order.paymentMethod === "card" ? "Kartë" : "Cash"
                }</p>
                <p><span class="font-medium">Statusi:</span> ✅ Dorëzuar</p>
              </div>
            </div>
            <table class="w-full text-sm bg-white rounded shadow">
              <thead class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <tr>
                  <th class="px-3 py-2 text-left">🍕 Produkt</th>
                  <th class="px-3 py-2 text-left">📦 Sasia</th>
                  <th class="px-3 py-2 text-left">💰 Njësi</th>
                  <th class="px-3 py-2 text-left">💵 Totali</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `<tr class="border-b hover:bg-gray-50">
                      <td class="px-3 py-2">${item.title}</td>
                      <td class="px-3 py-2">${item.quantity}</td>
                      <td class="px-3 py-2">$${item.price.toFixed(2)}</td>
                      <td class="px-3 py-2">$${(
                        item.price * item.quantity
                      ).toFixed(2)}</td>
                    </tr>`
                  )
                  .join("")}
                <tr class="bg-blue-50 font-bold">
                  <td colspan="3" class="px-3 py-2">💰 TOTAL:</td>
                  <td class="px-3 py-2">$${order.totalPrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center bg-gray-50 p-3 rounded">
              <p class="font-semibold mb-1">🙏 Faleminderit!</p>
              <p class="text-gray-600 mb-1">Kontaktoni për pyetje.</p>
              <p class="text-gray-600">📧 info@fastfood.com | 📞 +355 XX XXX XXX</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Show invoice
  const handleShowInvoice = (order: Order) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(generateInvoiceHTML(order));
    win.document.close();
  };

  // Print/download
  const handleDownloadPDF = (order: Order) => {
    handleShowInvoice(order);
    setTimeout(() => {
      if (window.confirm("Doni të printoni faturën?")) window.print();
    }, 800);
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, [currentUser]);

  // Filter invoices
  const filteredInvoices = invoices.filter(
    (order) =>
      order._id.includes(searchTerm) ||
      order.items?.some((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredInvoices.reduce(
    (sum, o) => sum + o.totalPrice,
    0
  );

  if (loading)
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Duke ngarkuar faturat...
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Receipt size={28} /> Faturat e Mia
          </h1>
          <p className="text-white/80 text-sm">
            Historiku i porosive të dorëzuara
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs border border-white/30">
              📦 {filteredInvoices.length} Fatura
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs border border-white/30">
              💰 ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border p-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Kërko sipas ID, produktit ose emrit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-6 text-sm">
          <div className="text-4xl mb-2">📄</div>
          <h2 className="font-semibold text-gray-600 dark:text-gray-300 mb-1">
            {searchTerm ? "Nuk u gjetën fatura" : "Nuk ka fatura"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Nuk ka fatura që përputhen."
              : "Pas dorëzimit, këtu do shfaqen."}
          </p>
        </div>
      )}

      {/* Invoices List */}
      <div className="space-y-2">
        {filteredInvoices.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow border overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="p-3 space-y-2">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    #{order._id.slice(0, 6)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Fatura #{order._id.slice(0, 6)}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600">
                    ✅ Dorëzuar
                  </span>
                  <div className="text-right text-sm">
                    <div className="font-bold text-gray-900 dark:text-white">
                      ${order.totalPrice.toFixed(2)}
                    </div>
                    <div className="capitalize text-gray-600 dark:text-gray-400">
                      {order.paymentMethod === "card" ? "💳 Kartë" : "💵 Cash"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-2 text-xs">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                  <User size={16} /> Klienti:
                </h4>
                <div className="grid md:grid-cols-2 gap-1">
                  {[
                    { icon: User, label: "Emri", value: order.name },
                    { icon: Mail, label: "Email", value: order.email },
                    { icon: Phone, label: "Tel", value: order.phone },
                    { icon: MapPin, label: "Adresa", value: order.address },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-1">
                      <Icon size={14} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {label}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-2 text-xs space-y-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                  📋 Produktet:
                </h4>
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 px-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-xs"
                  >
                    <div className="flex items-center gap-1">
                      <span>🍕</span>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </span>
                        <div className="text-gray-600 dark:text-gray-400">
                          Sasia: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between font-bold text-sm">
                  <span className="text-gray-900 dark:text-white">Totali:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-1">
                {[
                  {
                    onClick: () => handleShowInvoice(order),
                    icon: Eye,
                    label: "Shiko",
                    gradient:
                      "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
                  },
                  {
                    onClick: () => handleDownloadPDF(order),
                    icon: Download,
                    label: "Print/PDF",
                    gradient:
                      "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                  },
                  {
                    onClick: () => handleDelete(order._id),
                    icon: Trash2,
                    label: "Fshi",
                    gradient:
                      "from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700",
                  },
                ].map(({ onClick, icon: Icon, label, gradient }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`flex-1 flex items-center justify-center gap-1 bg-gradient-to-r ${gradient} text-white py-2 px-2 rounded-lg font-medium text-xs transition-all duration-200 shadow`}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
