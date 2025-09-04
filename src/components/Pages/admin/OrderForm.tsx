import { useEffect, useState } from "react";
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
        {order ? "✏️ Përditëso Porosinë" : "➕ Shto Porosi"}
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium">Emri</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Totali (€)</label>
        <input
          name="totalPrice"
          type="number"
          min="0"
          value={formData.totalPrice}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Statusi</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="pending">Në Pritje</option>
          <option value="preparing">Po përgatitet</option>
          <option value="delivering">Po transportohet</option>
          <option value="delivered">Dërguar</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Anulo
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
        >
          {order ? "Përditëso" : "Shto"}
        </button>
      </div>
    </form>
  );
}
