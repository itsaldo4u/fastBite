import { useEffect, useState } from "react";
import {
  BadgePercent,
  ShoppingCart,
  Sparkles,
  Gift,
  TrendingUp,
} from "lucide-react";
import ShoppingCartDropdown from "../ShoppingCartDropdown";
import CheckoutStepper from "./CheckoutStepper";
import ProductCard from "../ProductCard"; // REUSE PRODUCTCARD
import { useCart } from "../context/CartContext";
import type { Offer } from "../context/OffersContext";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/offers`);
        const data = await res.json();
        setOffers(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së ofertave:", error);
      }
    };
    fetchOffers();
  }, []);

  // Adapter function: Convert Offer to ProductCard props
  const offerToProductCardProps = (offer: Offer) => {
    // Calculate discount percentage
    const discountPercentage =
      offer.oldPrice > 0
        ? Math.round(((offer.oldPrice - offer.newPrice) / offer.oldPrice) * 100)
        : 0;

    return {
      id: offer._id.toString(),
      title: offer.title,
      description:
        offer.description || `${offer.icon} Ofertë speciale me zbritje!`,
      price: offer.oldPrice, // Original price
      image: offer.image,
      category: "Oferta", // Default category
      discount: discountPercentage,
      isNew: false,
      isCombo: offer.title.toLowerCase().includes("combo"),
      rating: 5, // Offers usually have high ratings
      onAddToCart: () => {
        addToCart({
          id: offer._id.toString(),
          title: offer.title,
          price: offer.newPrice, // Use discounted price
        });
        setShowCart(true);
      },
    };
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleAddMore = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
      });
    }
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-20 px-6 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-24 left-24 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-32 right-1/4 w-3 h-3 bg-yellow-400/40 rounded-full animate-bounce delay-300" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-pink-500/40 rounded-full animate-bounce delay-700" />
        <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-purple-400/30 rounded-full animate-bounce delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-16 pt-12">
          <div className="group">
            <h1 className="text-5xl font-black text-yellow-400 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105">
              <div className="relative">
                <BadgePercent className="w-12 h-12 transform group-hover:rotate-12 transition-transform duration-300" />
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-pink-400 animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Oferta Speciale
              </span>
            </h1>
            <div className="h-1 w-0 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-500 mt-2 rounded-full" />
          </div>

          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Toggle shopping cart"
          >
            <ShoppingCart
              size={26}
              className="transform group-hover:scale-110 transition-transform duration-300"
            />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full text-xs w-7 h-7 flex items-center justify-center font-bold animate-pulse shadow-lg">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Subtitle */}
        <div className="flex items-center justify-center mb-12">
          <div className="text-center max-w-2xl">
            <p className="text-xl text-gray-300 flex items-center justify-center gap-3 mb-2">
              <Gift className="w-6 h-6 text-yellow-400 animate-bounce" />
              Shijo ushqimin tënd të preferuar me zbritje fantastike!
              <TrendingUp className="w-6 h-6 text-green-400 animate-pulse" />
            </p>
            <p className="text-sm text-gray-400">
              ⏰ Vetëm për një kohë të kufizuar
            </p>
          </div>
        </div>

        {/* Offers Grid - USING PRODUCTCARD */}
        <section>
          {offers.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <p className="text-gray-400 text-lg">
                  Nuk ka oferta të disponueshme aktualisht.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Kthehu së shpejti për ofertat e reja! 🎁
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {offers.map((offer, index) => (
                <div
                  key={`offer-${offer._id || offer.id}-${index}`}
                  className={`transform transition-all duration-500 hover:scale-105 ${
                    index % 3 === 1 ? "lg:translate-y-8" : ""
                  } ${index % 4 === 2 ? "xl:translate-y-4" : ""}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />

                    {/* REUSE PRODUCTCARD COMPONENT */}
                    <div className="relative">
                      <ProductCard {...offerToProductCardProps(offer)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Shopping Cart Dropdown */}
      {showCart && (
        <ShoppingCartDropdown
          cartItems={cartItems}
          onAdd={handleAddMore}
          onRemove={handleRemoveFromCart}
          onClear={handleClearCart}
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
        />
      )}

      {/* Checkout Stepper */}
      {showCheckout && (
        <CheckoutStepper
          cartItems={cartItems}
          onClose={() => setShowCheckout(false)}
          clearCart={handleClearCart}
        />
      )}

      {/* Event listener to open checkout */}
      <CheckoutEventBridge
        onTrigger={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />
    </div>
  );
}

// Listener component for checkout events
function CheckoutEventBridge({ onTrigger }: { onTrigger: () => void }) {
  useEffect(() => {
    const handle = () => onTrigger();
    window.addEventListener("openCheckout", handle);
    return () => window.removeEventListener("openCheckout", handle);
  }, [onTrigger]);

  return null;
}
