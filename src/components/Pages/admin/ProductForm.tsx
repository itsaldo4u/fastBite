import React, { useState, useEffect } from "react";
import { type Product } from "../../context/ProductContext";
import {
  Package,
  DollarSign,
  Tag,
  FileText,
  Image as ImageIcon,
  Percent,
  Star,
  Sparkles,
  Pizza,
  Save,
  X,
} from "lucide-react";

type ProductFormProps = {
  product: Product | null;
  onSubmit: (data: Omit<Product, "id">, id?: string) => void;
  onCancel: () => void;
};

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    discount: 0,
    isNew: false,
    isCombo: false,
    rating: 0,
    ratingCount: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        discount: product.discount || 0,
        isNew: product.isNew || false,
        isCombo: product.isCombo || false,
        rating: product.rating || 0,
        ratingCount: product.ratingCount || 0,
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let val: string | number | boolean;

    if (type === "checkbox") {
      val = (e.target as HTMLInputElement).checked;
    } else if (["price", "discount", "rating"].includes(name)) {
      val = Number(value) || 0;
    } else {
      val = value;
    }

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.title || !formData.price || !formData.image) {
      alert("Ju lutem plotësoni Titullin, Çmimin dhe Imazhin.");
      setIsSubmitting(false);
      return;
    }

    try {
      const cleanData: Omit<Product, "id"> = { ...formData };
      if (!formData.discount || formData.discount === 0)
        delete cleanData.discount;
      if (!cleanData.ratingCount) cleanData.ratingCount = 0;

      await onSubmit(cleanData, product?.id);
    } catch (error) {
      console.error(error);
      alert("Gabim gjatë ruajtjes së produktit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["Pizza", "Burger", "Pije", "Combo", "Ëmbëlsira"];

  return (
    <div className="bg-white dark:bg-gray-800 w-full mx-auto rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              {product ? (
                <Package className="w-7 h-7 text-white" />
              ) : (
                <Sparkles className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {product ? "Edito Produktin" : "Shto Produkt të Ri"}
              </h2>
              <p className="text-white/90 text-sm">
                {product
                  ? "Përditëso informacionet e produktit"
                  : "Krijo një produkt të ri për menunë"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg text-white/90 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
            aria-label="Mbyll"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-5 max-h-[calc(85vh-120px)] overflow-y-auto"
      >
        {/* Title */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Package className="w-4 h-4 text-blue-500" />
            Titulli <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="p.sh. Pizza Margherita"
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-green-500" />
              Çmimi <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              min={0}
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all text-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4 text-purple-500" />
              Kategoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all text-gray-800 dark:text-white"
            >
              <option value="">Zgjidh kategorinë</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4 text-yellow-500" />
            Përshkrimi
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 dark:focus:ring-yellow-800 transition-all text-gray-800 dark:text-white placeholder-gray-400 resize-none"
            placeholder="Përshkruaj produktin..."
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <ImageIcon className="w-4 h-4 text-pink-500" />
            URL e Imazhit <span className="text-red-500">*</span>
          </label>
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            type="url"
            required
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-all text-gray-800 dark:text-white placeholder-gray-400"
          />
          {formData.image && (
            <div className="mt-3 flex justify-center">
              <img
                src={formData.image}
                alt="Preview"
                className="max-h-40 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 shadow-lg"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
        </div>

        {/* Discount and Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Percent className="w-4 h-4 text-red-500" />
              Zbritja (%)
            </label>
            <input
              name="discount"
              type="number"
              value={formData.discount === 0 ? "" : formData.discount}
              onChange={handleChange}
              min={0}
              max={100}
              placeholder="Zbritje (%)"
              className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all text-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              Vlerësimi (0-5)
            </label>
            <input
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              min={0}
              max={5}
              step="0.1"
              placeholder="0.0"
              className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 dark:focus:ring-yellow-800 transition-all text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 cursor-pointer group">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              ✨ Produkt i Ri
            </span>
          </label>
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 cursor-pointer group">
            <input
              type="checkbox"
              name="isCombo"
              checked={formData.isCombo}
              onChange={handleChange}
              className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
            />
            <span className="font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              🍔 Combo
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Anulo
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Duke ruajtur...
              </>
            ) : product ? (
              <>
                <Save className="w-5 h-5" />
                Përditëso
              </>
            ) : (
              <>
                <Pizza className="w-5 h-5" />
                Shto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
