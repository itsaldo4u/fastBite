import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import OfferForm from "./OfferTableForm";

type Offer = {
  id: number;
  title: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  image: string;
};

export default function OfferTable() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const fetchOffers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/offers");
      setOffers(res.data);
    } catch (err) {
      console.error("Gabim në marrjen e ofertave", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("A jeni i sigurt që doni ta fshini këtë ofertë?")) {
      await axios.delete(`http://localhost:3000/offers/${id}`);
      fetchOffers();
    }
  };

  const handleSubmit = async (data: Omit<Offer, "id">, id?: number) => {
    if (id) {
      await axios.put(`http://localhost:3000/offers/${id}`, data);
    } else {
      await axios.post("http://localhost:3000/offers", data);
    }
    setShowForm(false);
    setEditingOffer(null);
    fetchOffers();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          📋 Menaxhimi i Ofertave
        </h2>
        <button
          onClick={() => {
            setEditingOffer(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <Plus size={18} /> Shto Ofertë
        </button>
      </div>

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
                    ${offer.oldPrice}
                  </span>{" "}
                  <span className="text-green-600 font-bold">
                    ${offer.newPrice}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setEditingOffer(offer);
                      setShowForm(true);
                    }}
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-xl shadow-lg relative">
            <OfferForm
              offer={editingOffer}
              onCancel={() => {
                setShowForm(false);
                setEditingOffer(null);
              }}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
