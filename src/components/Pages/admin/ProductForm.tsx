import React, { useState, useEffect } from "react";
import { type Product } from "../../context/AuthContext";

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
    } else if (name === "price" || name === "discount" || name === "rating") {
      val = Number(value);
    } else {
      val = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
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
      // KJO është thirrja që duhet të ekzistojë
      await onSubmit(formData, product?.id);
    } catch (error) {
      alert("Gabim gjatë ruajtjes së produktit.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["Pizza", "Burger", "Pije", "Combo", "Ëmbëlsira"];

  return (
    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl mx-auto p-6 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {product ? "✏️ Edito Produktin" : "➕ Shto Produkt të Ri"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {product
              ? "Përditëso informacionet e produktit"
              : "Krijo një produkt të ri për menunë"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Titulli *
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="p.sh. Pizza Margherita"
            className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Çmimi ($) *
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              min={0}
              step="0.01"
              className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Kategoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Përshkrimi
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Përshkruaj produktin..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            URL e Imazhit *
          </label>
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            type="url"
            required
            className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 max-h-32 mx-auto rounded-lg object-cover border dark:border-gray-500"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Zbritja (%)
            </label>
            <input
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
              className="w-full px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
            />
            Produkt i Ri
          </label>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="isCombo"
              checked={formData.isCombo}
              onChange={handleChange}
            />
            Combo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Anulo
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin border-b-2 border-white w-5 h-5 mr-2 rounded-full" />
                Duke ruajtur...
              </>
            ) : product ? (
              "💾 Përditëso"
            ) : (
              "➕ Shto"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
