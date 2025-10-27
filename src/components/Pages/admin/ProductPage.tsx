import { useEffect, useState } from "react";
import { useProduct, type Product } from "../../context/ProductContext";
import ProductForm from "./ProductForm";
import { Package, Plus, Edit2, Trash2, Star } from "lucide-react";

export default function ProductPage() {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } =
    useProduct();

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
      <div className="text-center py-20">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Duke ngarkuar produktet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">Lista e Produkteve</h2>
              <p className="text-white/90 text-sm">
                Menaxho të gjitha produktet e disponueshme
              </p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-white/30"
          >
            <Plus className="w-5 h-5" />
            Shto Produkt
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600">
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Titulli
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Përshkrimi
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Çmimi
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Kategoria
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Zbritja
                </th>
                <th className="py-4 px-6 text-center text-sm font-bold text-gray-800 dark:text-white">
                  i Ri?
                </th>
                <th className="py-4 px-6 text-center text-sm font-bold text-gray-800 dark:text-white">
                  Combo?
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Rating
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Imazhi
                </th>
                <th className="py-4 px-6 text-center text-sm font-bold text-gray-800 dark:text-white">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr
                  key={p.id}
                  className={`text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <td className="py-4 px-6 font-semibold">{p.title}</td>
                  <td className="py-4 px-6 text-sm max-w-xs truncate">
                    {p.description}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-md">
                      ${p.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {p.discount ? (
                      <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-md">
                        {p.discount}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {p.isNew ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow-md">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-full">
                        ✕
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {p.isCombo ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full shadow-md">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-full">
                        ✕
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {p.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{p.rating}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-600"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                        title="Edito"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                        title="Fshi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                Nuk ka produkte të disponueshme
              </p>
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Shto produktin e parë
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-t-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
            <span className="text-lg">📦</span>
            Gjithsej {products.length} produkt{products.length !== 1 && "e"}
          </p>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-auto border-2 border-gray-200 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200">
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
