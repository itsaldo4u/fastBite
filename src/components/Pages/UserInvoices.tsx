// src/components/UserInvoices.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import type { Order } from "../context/AuthContext";

export default function UserInvoices() {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState<Order[]>([]);

  const fetchDeliveredOrders = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get<Order[]>(
        `http://localhost:3000/orders?userId=${currentUser.id}&status=delivered`
      );
      setInvoices(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e porosive të dorëzuara:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Jeni i sigurt që doni të fshini këtë faturë?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/orders/${id}`);
      setInvoices((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error);
    }
  };

  const handleShowInvoice = (order: Order) => {
    const win = window.open("", "_blank");
    if (!win) return;

    const invoiceHtml = `
      <html>
        <head>
          <title>Fatura e Porosisë #${order.id}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #ff6600; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Fatura e Porosisë #${order.id}</h1>
          <p><strong>Emri:</strong> ${order.name}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Data:</strong> ${new Date(
            order.createdAt
          ).toLocaleDateString("sq-AL")}</p>

          <table>
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Sasia</th>
                <th>Çmimi</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
              <tr>
                <td colspan="2"><strong>Totali:</strong></td>
                <td><strong>$${order.totalPrice.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    win.document.write(invoiceHtml);
    win.document.close();
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, [currentUser]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        📦 Faturat e Dorëzuara
      </h2>

      {invoices.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Nuk ka fatura të dorëzuara për këtë përdorues.
        </p>
      ) : (
        <ul className="space-y-4">
          {invoices.map((order) => (
            <li
              key={order.id}
              className="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  Porosi #{order.id} - ${order.totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data:{" "}
                  {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShowInvoice(order)}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Shfaq Faturën
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Fshi
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
