import { useState } from "react";
import { Pencil, Trash2, Plus, Tag, Image } from "lucide-react";
import { useOffers, type Offer } from "../../context/OffersContext";
import OfferForm from "./OfferTableForm";

export default function OfferTable() {
  const { offers, fetchOffers, deleteOffer, updateOffer, addOffer } =
    useOffers();

  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("A jeni i sigurt që doni ta fshini këtë ofertë?")) return;
    try {
      await deleteOffer(id);
      fetchOffers();
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
    <div className="space-y-4 sm:space-y-6 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg flex-shrink-0">
              <Tag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-bold mb-1">
                Menaxhimi i Ofertave
              </h2>
              <p className="text-white/90 text-xs sm:text-sm">
                Shto dhe menaxho ofertat speciale
              </p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-white/30"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Shto Ofertë</span>
          </button>
        </div>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600">
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Foto
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Titulli
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Përshkrimi
                </th>
                <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                  Çmimi
                </th>
                <th className="p-4 text-center text-sm font-bold text-gray-800 dark:text-white">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => (
                <tr
                  key={`offer-${offer._id || offer.id}-${index}`}
                  className={`text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <td className="p-4">
                    {offer.image ? (
                      <img
                        src={offer.image}
                        alt="Imazh i ofertës"
                        className="w-24 h-20 object-cover rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-24 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      {offer.title}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {offer.description}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="line-through text-gray-400 dark:text-gray-500 text-sm">
                        ${offer.oldPrice.toFixed(2)}
                      </span>
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-md inline-block">
                        ${offer.newPrice.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                        title="Edito ofertën"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                        title="Fshi ofertën"
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
      </div>

      {/* Mobile/Tablet View - Cards */}
      <div className="lg:hidden space-y-3 sm:space-y-4">
        {offers.map((offer, index) => (
          <div
            key={`offer-card-${offer._id || offer.id}-${index}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 dark:border-gray-700"
          >
            <div className="p-4 sm:p-5 space-y-3">
              {/* Image and Title */}
              <div className="flex gap-3 sm:gap-4">
                {offer.image ? (
                  <img
                    src={offer.image}
                    alt="Imazh i ofertës"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <Image className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {offer.title}
                  </h3>

                  {/* Price Section */}
                  <div className="flex flex-col gap-1.5">
                    <span className="line-through text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                      ${offer.oldPrice.toFixed(2)}
                    </span>
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-sm sm:text-base shadow-md inline-block w-fit">
                      ${offer.newPrice.toFixed(2)}
                    </span>
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-lg text-xs font-bold inline-block w-fit">
                      -
                      {Math.round(
                        ((offer.oldPrice - offer.newPrice) / offer.oldPrice) *
                          100
                      )}
                      % ZBRITJE
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {offer.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <Pencil className="w-4 h-4" />
                  Edito
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Fshi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {offers.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-100 dark:border-gray-700">
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <Tag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400">
                Nuk ka oferta të disponueshme
              </p>
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-semibold flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Shto ofertën e parë
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {offers.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
            <span className="text-base sm:text-lg">🏷️</span>
            Gjithsej {offers.length} ofertë{offers.length !== 1 && "a"}
          </p>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] sm:max-h-[85vh] overflow-auto border-2 border-gray-200 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200">
            <OfferForm
              offer={editingOffer}
              onCancel={() => {
                setShowForm(false);
                setEditingOffer(null);
              }}
              onSubmit={async (data, id) => {
                try {
                  if (id) await updateOffer(id, data);
                  else await addOffer(data);
                  setShowForm(false);
                  setEditingOffer(null);
                  fetchOffers();
                } catch (error) {
                  console.error("Gabim gjatë ruajtjes së ofertës:", error);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
