import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../context/AuthContext";
import ProductForm from "./ProductForm";

export default function ProductPage() {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } =
    useAuth();

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
      setLoading(false);
    };
    load();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirm = window.confirm("Je i sigurt që do ta fshish produktin?");
    if (confirm) {
      await deleteProduct(id);
    }
  };

  const handleFormSubmit = async (data: Omit<Product, "id">, id?: string) => {
    if (id) {
      await updateProduct(id, data);
    } else {
      await addProduct(data);
    }
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-700 dark:text-white">
        Duke ngarkuar produktet...
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Lista e Produkteve
        </h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Shto Produkt
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
              <th className="py-2 px-4 border">Titulli</th>
              <th className="py-2 px-4 border">Përshkrimi</th>
              <th className="py-2 px-4 border">Çmimi</th>
              <th className="py-2 px-4 border">Kategoria</th>
              <th className="py-2 px-4 border">Zbritja</th>
              <th className="py-2 px-4 border">i Ri?</th>
              <th className="py-2 px-4 border">Combo?</th>
              <th className="py-2 px-4 border">Rating</th>
              <th className="py-2 px-4 border">Imazhi</th>
              <th className="py-2 px-4 border">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="py-2 px-4 border">{p.title}</td>
                <td className="py-2 px-4 border">{p.description}</td>
                <td className="py-2 px-4 border">${p.price.toFixed(2)}</td>
                <td className="py-2 px-4 border">{p.category}</td>
                <td className="py-2 px-4 border">{p.discount || 0}%</td>
                <td className="py-2 px-4 border">{p.isNew ? "✅" : "❌"}</td>
                <td className="py-2 px-4 border">{p.isCombo ? "✅" : "❌"}</td>
                <td className="py-2 px-4 border">{p.rating ?? "-"}</td>
                <td className="py-2 px-4 border">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-16 h-16 object-cover rounded shadow-md"
                  />
                </td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-500 hover:underline"
                  >
                    Edito
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:underline"
                  >
                    Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-4xl max-h-[80vh] overflow-auto relative">
            <ProductForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
