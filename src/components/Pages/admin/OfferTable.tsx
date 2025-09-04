import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useOffers, type Offer } from "../../context/OffersContext";
import OfferForm from "./OfferTableForm";

export default function OfferTable() {
  const { offers, fetchOffers, deleteOffer } = useOffers();
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("A jeni i sigurt që doni ta fshini këtë ofertë?")) return;
    try {
      await deleteOffer(id);
      fetchOffers(); // rifreskon listën pas fshirjes
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingOffer(null);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          📋 Menaxhimi i Ofertave
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <Plus size={18} /> Shto Ofertë
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Titulli</th>
              <th className="p-3">Përshkrimi</th>
              <th className="p-3">Çmimi</th>
              <th className="p-3">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr
                key={offer.id}
                className="border-t border-gray-300 dark:border-gray-700"
              >
                <td className="p-3">
                  <img
                    src={offer.image}
                    alt="img"
                    className="w-20 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-semibold">{offer.title}</td>
                <td className="p-3 text-sm">{offer.description}</td>
                <td className="p-3">
                  <span className="line-through text-gray-400">
                    ${offer.oldPrice.toFixed(2)}
                  </span>{" "}
                  <span className="text-green-600 font-bold">
                    ${offer.newPrice.toFixed(2)}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-xl shadow-lg relative">
            <OfferForm
              offer={editingOffer}
              onCancel={() => {
                setShowForm(false);
                setEditingOffer(null);
              }}
              onSubmit={() => {
                setShowForm(false);
                setEditingOffer(null);
                fetchOffers(); // rifreskon listën pas CRUD
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
