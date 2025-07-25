import React, { useState, useEffect } from "react";
import type { Order, Status } from "./Orders";

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
    items: [],
  });

  useEffect(() => {
    if (order) {
      setFormData({
        name: order.name,
        email: order.email,
        totalPrice: order.totalPrice,
        status: order.status,
        items: order.items || [],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        totalPrice: 0,
        status: "pending",
        items: [],
      });
    }
  }, [order]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: name === "totalPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Ju lutem plotësoni emrin dhe emailin.");
      return;
    }
    onSubmit(formData, order?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {order ? "Edito Porosin" : "Porosi e Re"}
      </h2>

      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Emri
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Totali ($)
        </label>
        <input
          type="number"
          name="totalPrice"
          value={formData.totalPrice}
          onChange={handleChange}
          min={0}
          step={0.01}
          required
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Statusi
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="pending">Në Pritje</option>
          <option value="preparing">Po përgatitet</option>
          <option value="delivering">Po transportohet</option>
          <option value="delivered">Dërguar</option>
        </select>
      </div>

      {/* Mund të shtosh këtu input për items, por për thjeshtësi e lamë jashtë */}

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Anulo
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Ruaj
        </button>
      </div>
    </form>
  );
}
