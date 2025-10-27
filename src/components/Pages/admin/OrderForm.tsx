import { useEffect, useState } from "react";
import { Save, X, Package } from "lucide-react";
import type { Order } from "./Orders";

type OrderFormProps = {
  order: Order | null;
  onSubmit: (data: Omit<Order, "id" | "createdAt">, id?: string) => void;
  onCancel: () => void;
};

export default function OrderForm({
  order,
  onSubmit,
  onCancel,
}: OrderFormProps) {
  const [formData, setFormData] = useState<Omit<Order, "id" | "createdAt">>({
    name: "",
    email: "",
    totalPrice: 0,
    status: "pending",
  });

  useEffect(() => {
    if (order) {
      setFormData({
        name: order.name,
        email: order.email,
        totalPrice: order.totalPrice,
        status: order.status,
      });
    }
  }, [order]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, order?.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 w-full max-w-lg mx-auto rounded-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 text-white relative overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {order ? "Përditëso Porosinë" : "Shto Porosi të Re"}
              </h2>
              <p className="text-white/90 text-sm">
                {order
                  ? "Modifiko informacionet e porosisë"
                  : "Krijo një porosi të re"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-blue-500">👤</span>
            Emri i Klientit
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all text-gray-800 dark:text-white placeholder-gray-400"
            placeholder="Shkruani emrin..."
            required
          />
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-purple-500">📧</span>
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all text-gray-800 dark:text-white placeholder-gray-400"
            placeholder="email@example.com"
            required
          />
        </div>

        {/* Total Price Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-green-500">💵</span>
            Totali (€)
          </label>
          <input
            name="totalPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.totalPrice}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all text-gray-800 dark:text-white placeholder-gray-400"
            placeholder="0.00"
            required
          />
        </div>

        {/* Status Select */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-orange-500">📊</span>
            Statusi
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all text-gray-800 dark:text-white"
          >
            <option value="pending">Në Pritje</option>
            <option value="preparing">Po përgatitet</option>
            <option value="delivering">Po transportohet</option>
            <option value="delivered">Dërguar</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
          >
            Anulo
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-100 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {order ? "Përditëso" : "Shto"}
          </button>
        </div>
      </form>
    </div>
  );
}
