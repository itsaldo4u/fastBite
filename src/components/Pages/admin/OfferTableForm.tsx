import { useEffect, useState } from "react";
import { Save, X, Tag, Image } from "lucide-react";
import type { Offer } from "../../context/OffersContext";

type OfferFormProps = {
  offer: Offer | null;
  onSubmit: (data: OfferFormData, id?: string) => void;
  onCancel: () => void;
};

export type OfferFormData = {
  title: string;
  description?: string;
  oldPrice: number;
  newPrice: number;
  image: string;
  discount?: string;
  icon?: string;
  gradient?: string;
};

export default function OfferForm({
  offer,
  onSubmit,
  onCancel,
}: OfferFormProps) {
  const [formData, setFormData] = useState<OfferFormData>({
    title: "",
    description: "",
    oldPrice: 0,
    newPrice: 0,
    image: "",
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title,
        description: offer.description || "",
        oldPrice: offer.oldPrice,
        newPrice: offer.newPrice,
        image: offer.image,
        discount: offer.discount,
        icon: offer.icon,
        gradient: offer.gradient,
      });
    }
  }, [offer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "oldPrice" || name === "newPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, offer?._id);
  };

  const discountPercent =
    formData.oldPrice > 0
      ? Math.round(
          ((formData.oldPrice - formData.newPrice) / formData.oldPrice) * 100
        )
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl mx-auto rounded-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-4 sm:p-6 text-white relative overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg flex-shrink-0">
              <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold truncate">
                {offer ? "Përditëso Ofertën" : "Shto Ofertë të Re"}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm">
                {offer
                  ? "Modifiko detajet e ofertës"
                  : "Krijo një ofertë speciale"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[70vh] overflow-y-auto">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-orange-500">📝</span>
            Titulli i Ofertës
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all text-gray-800 dark:text-white placeholder-gray-400 text-sm sm:text-base"
            placeholder="p.sh. Super Deal Pizza + Pije"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-purple-500">📄</span>
            Përshkrimi
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all text-gray-800 dark:text-white placeholder-gray-400 resize-none text-sm sm:text-base"
            rows={3}
            placeholder="Përshkruaj ofertën në detaje..."
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="text-gray-500">💰</span>
              Çmimi i Vjetër
            </label>
            <input
              name="oldPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.oldPrice}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 transition-all text-gray-800 dark:text-white text-sm sm:text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="text-green-500">✨</span>
              Çmimi i Ri
            </label>
            <input
              name="newPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.newPrice}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all text-gray-800 dark:text-white text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Discount Display */}
        {formData.oldPrice > 0 &&
          formData.newPrice > 0 &&
          discountPercent > 0 && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Zbritje:
                </span>
                <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {discountPercent}% OFF
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Kursimi: ${(formData.oldPrice - formData.newPrice).toFixed(2)}
              </div>
            </div>
          )}

        {/* Image URL */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Image className="w-4 h-4 text-blue-500" />
            URL e Imazhit
          </label>
          <input
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all text-gray-800 dark:text-white placeholder-gray-400 text-sm sm:text-base"
            placeholder="https://example.com/image.jpg"
            required
          />
          {formData.image && (
            <div className="mt-2 sm:mt-3 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-40 sm:h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold text-sm sm:text-base order-2 sm:order-1"
          >
            Anulo
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {offer ? "Përditëso" : "Shto"}
          </button>
        </div>
      </div>
    </div>
  );
}
