import { useEffect, useState } from "react";
import { BadgePercent, ShoppingCart } from "lucide-react";
import axios from "axios";

type Offer = {
  id: number;
  title: string;
  description?: string;
  discount: string;
  price: string;
  originalPrice: string;
  image: string;
  icon: React.ReactNode;
  gradient: string;
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get<Offer[]>("http://localhost:3000/offers");
        setOffers(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së ofertave:", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <section className="min-h-screen py-12 px-4 bg-gradient-to-br from-red-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-red-600 dark:text-yellow-400 mb-4 flex justify-center items-center gap-2">
          <BadgePercent className="w-8 h-8" /> Oferta Speciale
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-12">
          Shijo ushqimin tënd të preferuar me zbritje fantastike! ⏰ Vetëm për
          një kohë të kufizuar.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {offers.length === 0 && (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              Nuk ka oferta të disponueshme aktualisht.
            </p>
          )}
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${offer.gradient}`}
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-red-600 dark:text-yellow-300">
                  {offer.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {offer.discount}
                </p>
                <div className="text-4xl mb-2">{offer.icon}</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-4">
                  {offer.price}{" "}
                  <span className="line-through ml-2 text-gray-400">
                    {offer.originalPrice}
                  </span>
                </div>

                {offer.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    {offer.description}
                  </p>
                )}

                <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
                  <ShoppingCart size={18} />
                  Porosit tani
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
