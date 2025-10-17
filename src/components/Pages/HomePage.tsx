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
  Gift,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckoutStepper from "./CheckoutStepper";
import PizzaBuilderGame from "./PizzaBuilderGame";
import WheelSpinner from "../WheelSpinner";
import { useOffers } from "../context/OffersContext";
import { useRewards } from "../context/RewardsContext";
import { useAuth } from "../context/AuthContext";
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
  const [showWheel, setShowWheel] = useState(false);

  const { offers, fetchOffers } = useOffers();
  const { canSpinToday } = useRewards();
  const { currentUser } = useAuth();
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
  const canSpin = currentUser && canSpinToday();

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
              className={`space-y-5 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <div className="space-y-">
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
                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-purple-500/20 max-w-sm mx-auto border border-white/10">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-red-500/5 to-purple-500/5 animate-pulse"></div>

                    {/* Content */}
                    <div className="relative p-5">
                      {/* Discount badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-black px-4 py-2 rounded-full text-sm transform rotate-3 shadow-lg">
                        OFERTË
                      </div>

                      <div className="text-center">
                        {/* Image with modern frame */}
                        <div className="relative mb-6 group">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                          <img
                            src={currentOffer.image}
                            alt={currentOffer.title}
                            className="relative mx-auto w-48 h-48 object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-4">
                          {currentOffer.title}
                        </h3>

                        {/* Price section */}
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-2xl blur-lg"></div>
                          <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                            <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                              {currentOffer.newPrice}€
                            </div>
                            <div className="text-base text-white/50 line-through mt-1">
                              {currentOffer.oldPrice}€
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() =>
                            handleAddToCart(
                              currentOffer.id.toString(),
                              currentOffer.title,
                              currentOffer.newPrice
                            )
                          }
                          className="relative w-full group overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-slate-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Shto në Shportë
                            <svg
                              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </span>
                          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-xl text-center text-white border border-white/10">
                    <div className="animate-pulse">
                      Duke ngarkuar ofertat...
                    </div>
                  </div>
                )}

                {/* Modern pagination dots */}
                <div className="flex justify-center mt-8 space-x-3">
                  {offers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentOfferIndex(index)}
                      className={`relative transition-all duration-300 ${
                        index === currentOfferIndex
                          ? "w-10 h-3"
                          : "w-3 h-3 hover:scale-125"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-300 ${
                          index === currentOfferIndex
                            ? "bg-gradient-to-r from-yellow-400 to-red-500 shadow-lg shadow-yellow-500/50"
                            : "bg-white/20 hover:bg-white/40"
                        }`}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <br />
        {/* Join FastBite+ Section (visible only if user NOT logged in) */}
        {!currentUser && (
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-pink-600/10 backdrop-blur-lg rounded-3xl border border-white/10 p-10 shadow-2xl">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-white">
                  Bashkohu me{" "}
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    FastBite+
                  </span>
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Krijo një llogari FALAS për të përfituar nga{" "}
                  <span className="text-yellow-400 font-semibold">
                    kuponat e përditshëm
                  </span>
                  , shpërblimet dhe aksesin në lojën ekskluzive{" "}
                  <span className="text-pink-400 font-semibold">
                    Rrota e Fatit
                  </span>
                  .
                </p>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => navigate("/signup")}
                    className="group bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-4 px-10 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/30 flex items-center gap-2"
                  >
                    <span>Krijo Llogari Falas</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="group border-2 border-white/20 bg-white/10 text-white font-semibold py-4 px-10 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform" />
                    <span>Hyr në Llogarinë tënde</span>
                  </button>
                </div>

                <p className="text-sm text-gray-400 mt-6">
                  🚀 Bëhu pjesë e komunitetit FastBite dhe fito shpërblime çdo
                  ditë!
                </p>
              </div>
            </div>
          </section>
        )}

        {/* WHEEL OF FORTUNE SECTION */}
        {currentUser && (
          <section className="py-16 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 backdrop-blur-lg rounded-3xl p-4 border-2 border-white/10 shadow-2xl">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <Gift className="w-10 h-10 text-yellow-400 animate-bounce" />
                    <h2 className="text-4xl md:text-5xl font-black text-white">
                      Rrota e Fatit
                    </h2>
                    <Gift className="w-10 h-10 text-yellow-400 animate-bounce" />
                  </div>

                  <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    🎰 Rrotulloje rroten dhe fito kupona ekskluzive!
                    <br />
                    <span className="text-yellow-400 font-semibold">
                      {canSpin
                        ? "Loja jote e sotme të pret!"
                        : "Kthehu nesër për një shans tjetër!"}
                    </span>
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <span>🎁</span>
                      <span>Deri në 50% zbritje</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <span>⏰</span>
                      <span>1 herë në ditë</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <span>✨</span>
                      <span>100% FALAS</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowWheel(true)}
                    disabled={!canSpin}
                    className={`relative group px-10 py-5 rounded-2xl text-xl font-black transition-all duration-300 transform ${
                      canSpin
                        ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/50 animate-pulse"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {canSpin ? (
                      <>
                        <span className="relative z-10 flex items-center gap-3">
                          🎲 PROVO FATIN TËND TANI!
                          <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                        </span>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      </>
                    ) : (
                      <span className="flex items-center gap-2">
                        🔒 Kthehu Nesër
                      </span>
                    )}
                  </button>

                  {!canSpin && (
                    <p className="text-white/60 text-sm">
                      Ke përdorur shansin tënd të sotëm. Kthehu nesër për një
                      lojë të re! 🌟
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

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

      {/* WHEEL SPINNER MODAL - SHTO KËTË */}
      {showWheel && <WheelSpinner onClose={() => setShowWheel(false)} />}

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
