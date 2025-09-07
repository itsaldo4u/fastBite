import { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  Star,
  Zap,
  ChefHat,
  Heart,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckoutStepper from "./CheckoutStepper";
import PizzaBuilderGame from "./PizzaBuilderGame";
import { useOffers } from "../context/OffersContext";
import ShoppingCartDropdown from "../ShoppingCartDropdown";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

export default function HomePage() {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { offers, fetchOffers } = useOffers();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Dërgesa në 30 min",
      desc: "Ushqim i freskët dhe i shpejtë",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Cilësi Premium",
      desc: "Përbërës të freskët çdo ditë",
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: "Kuzhinierë Ekspertë",
      desc: "Receta tradicionale dhe moderne",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Kënaqësia juaj",
      desc: "Garantojmë shijet më të mira",
    },
  ];

  // ===== Cart Handlers =====
  const handleAddToCart = (id: string, title: string, price: number) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === id);
      if (exist) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, title, price, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === id);
      if (!exist) return prev;
      if (exist.quantity === 1) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    setCartOpen(false);
  };

  // ===== Offers Rotation =====
  useEffect(() => {
    fetchOffers();
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (offers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [offers]);

  const currentOffer = offers[currentOfferIndex] ?? null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Floating Background Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header Cart Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setCartOpen(!cartOpen)}
          className="relative p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Toggle shopping cart"
        >
          <ShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full text-xs w-6 h-6 flex items-center justify-center font-bold animate-pulse">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm mt-5 font-semibold tracking-wide">
                    USHQIM I SHPEJTË & I SHIJSHËM
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                  Shijet më të{" "}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
                    Mrekullueshme
                  </span>{" "}
                  në Tiranë!
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Zbuloni një botë shijesh të jashtëzakonshme me pica
                  artizanale, burger-e të freskëta dhe specialitete që do t'ju
                  lënë pa fjalë.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/menu")}
                  className="group bg-gradient-to-r from-yellow-400 to-red-500 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Porosit Tani</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/offers")}
                  className="group border-2 border-white/20 backdrop-blur-sm bg-white/10 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Oferta Speciale</span>
                </button>
              </div>
            </div>

            {/* Offer Card */}
            <div
              className={`${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
            >
              <div className="relative">
                {currentOffer ? (
                  <div className="bg-gradient-to-br from-yellow-400/10 to-red-500/10 rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105 max-w-sm mx-auto p-6">
                    <div className="text-center">
                      <img
                        src={currentOffer.image}
                        alt={currentOffer.title}
                        className="mx-auto mb-4 w-48 h-48 object-cover rounded-lg"
                      />
                      <h3 className="text-2xl font-bold text-white">
                        {currentOffer.title}
                      </h3>
                      <div className="space-y-2 mt-2">
                        <div className="text-3xl font-black text-yellow-400">
                          {currentOffer.newPrice}€
                        </div>
                        <div className="text-lg text-white/70 line-through">
                          {currentOffer.oldPrice}€
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleAddToCart(
                            currentOffer.id.toString(),
                            currentOffer.title,
                            currentOffer.newPrice
                          )
                        }
                        className="mt-4 bg-white text-red-600 font-bold py-3 px-6 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                      >
                        Shto në Shportë
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-white/10 text-center text-white">
                    Duke ngarkuar ofertat...
                  </div>
                )}
                <div className="flex justify-center mt-6 space-x-2">
                  {offers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentOfferIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentOfferIndex
                          ? "bg-yellow-400 w-8"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Pizza Builder Section */}
        <section className="py-16 px-4">
          <PizzaBuilderGame />
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`text-center space-y-4 p-6 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex justify-center text-yellow-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Shopping Cart */}
      {cartOpen && (
        <ShoppingCartDropdown
          cartItems={cartItems}
          onAdd={(id) => {
            const product = cartItems.find((p) => p.id === id);
            if (product)
              handleAddToCart(product.id, product.title, product.price);
          }}
          onRemove={handleRemoveFromCart}
          onClear={handleClearCart}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setShowCheckout(true);
            setCartOpen(false);
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

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-left { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in-left { animation: fade-in-left 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
