import { useEffect, useState } from "react";
import {
  Save,
  X,
  Package,
  Phone,
  MapPin,
  User,
  Mail,
  DollarSign,
  Package2,
} from "lucide-react";

type Order = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  totalPrice: number;
  status: "pending" | "preparing" | "delivering" | "delivered";
  items?: any[];
  createdAt: string;
};

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
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    address: string;
    email: string;
    paymentMethod: string;
    orderDescription: string;
    totalPrice: number;
    status: "pending" | "preparing" | "delivering" | "delivered";
  }>({
    name: "",
    phone: "",
    address: "",
    email: "",
    paymentMethod: "cash",
    orderDescription: "",
    totalPrice: 0,
    status: "pending",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      // Konverto items në përshkrim tekstual
      const itemsDescription =
        order.items
          ?.map((item: any) => `${item.quantity || 1}x ${item.title}`)
          .join(", ") || "";

      setFormData({
        name: order.name,
        phone: order.phone || "",
        address: order.address || "",
        email: order.email || "",
        paymentMethod: order.paymentMethod || "cash",
        orderDescription: itemsDescription,
        totalPrice: order.totalPrice,
        status: order.status,
      });
    }
  }, [order]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalPrice" ? Number(value) : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Emri është i detyrueshëm";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Numri i telefonit është i detyrueshëm";
    } else if (!/^\+?\d{7,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Numri i telefonit nuk është i vlefshëm";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Adresa është e detyrueshme";
    }

    if (!formData.orderDescription.trim()) {
      newErrors.orderDescription = "Përshkrimi i porosisë është i detyrueshëm";
    }

    if (formData.totalPrice <= 0) {
      newErrors.totalPrice = "Çmimi duhet të jetë më i madh se 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Krijo një item të thjeshtë nga përshkrimi
    const items = [
      {
        id: `item-${Date.now()}`,
        title: formData.orderDescription,
        price: formData.totalPrice,
        quantity: 1,
      },
    ];

    const orderData = {
      name: formData.name,
      email: formData.email || `${formData.phone}@temp.com`, // Email fallback
      phone: formData.phone,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      totalPrice: formData.totalPrice,
      originalPrice: formData.totalPrice,
      discount: 0,
      couponUsed: null,
      status: formData.status,
      items: items,
      prepTime: 30,
    };

    onSubmit(orderData, order?.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 w-full max-w-3xl mx-auto rounded-xl overflow-hidden max-h-[85vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-4 sm:p-6 text-white relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">
                {order ? "Përditëso Porosinë" : "Porosi e Re"}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm hidden sm:block">
                Plotëso të dhënat e klientit që telefonoi
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition flex-shrink-0"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Form - Scrollable */}
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1"
      >
        {/* Informacioni i Klientit */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 sm:p-5 border-2 border-blue-200 dark:border-gray-600">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Informacioni i Klientit
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Emri */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                Emri i Plotë *
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white text-sm sm:text-base ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="Shkruani emrin e klientit"
              />
              {errors.name && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Telefoni */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                Telefoni *
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white text-sm sm:text-base ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="069 XXX XXXX"
              />
              {errors.phone && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-800 dark:text-white text-sm sm:text-base"
                placeholder="email@example.com"
              />
            </div>

            {/* Adresa */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                Adresa e Dërgesës *
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white text-sm sm:text-base ${
                  errors.address
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="Shkruani adresën e klientit"
              />
              {errors.address && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detajet e Porosisë */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 sm:p-5 border-2 border-orange-200 dark:border-gray-600">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Package2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            Detajet e Porosisë
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {/* Përshkrimi i Porosisë */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                📝 Çfarë dëshiron klienti? *
              </label>
              <textarea
                name="orderDescription"
                value={formData.orderDescription}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white resize-none text-sm sm:text-base ${
                  errors.orderDescription
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-200"
                }`}
                placeholder="Shembull: 2x Pizza Margherita, 1x Burger, 1x Coca Cola"
              />
              {errors.orderDescription && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.orderDescription}
                </p>
              )}
            </div>

            {/* Çmimi Total, Metoda e Pagesës, Statusi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Çmimi */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  Çmimi ($) *
                </label>
                <input
                  name="totalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white font-bold text-sm sm:text-base ${
                    errors.totalPrice
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                  }`}
                  placeholder="0.00"
                />
                {errors.totalPrice && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">
                    {errors.totalPrice}
                  </p>
                )}
              </div>

              {/* Metoda e Pagesës */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  💳 Pagesa
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-800 dark:text-white text-sm sm:text-base"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Kartë</option>
                </select>
              </div>

              {/* Statusi */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  📊 Statusi
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 dark:text-white text-sm sm:text-base"
                >
                  <option value="pending">⏳ Në Pritje</option>
                  <option value="preparing">👨‍🍳 Po Përgatitet</option>
                  <option value="delivering">🚚 Transportohet</option>
                  <option value="delivered">✅ E Dërguar</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 -mx-4 -mb-4 px-4 pb-4 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold text-sm sm:text-base"
          >
            Anulo
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {order ? "Përditëso" : "Ruaj Porosinë"}
          </button>
        </div>
      </form>
    </div>
  );
}
