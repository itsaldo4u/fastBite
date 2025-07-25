import {
  Sparkles,
  Clock,
  Star,
  Zap,
  ChefHat,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { offers, fetchOffers } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Clock className=" w-8 h-8" />,
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Food Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-4xl opacity-20 animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {["🍕", "🍔", "🍟", "🌮", "🥤", "🍰"][i]}
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Main Content */}
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

              {/* Action Buttons */}
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

            {/* Right Side - Animated Offer Card */}
            <div
              className={`${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
            >
              <div className="relative">
                {currentOffer ? (
                  <div
                    className={`bg-gradient-to-br ${currentOffer.gradient} rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 max-w-sm mx-auto`}
                  >
                    <div className="absolute -top-4 -right-4 bg-white text-red-600 px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                      {currentOffer.discount}
                    </div>

                    <div className="text-center ">
                      <img
                        src={currentOffer.image}
                        alt={currentOffer.title}
                        className="mx-auto mb-4 w-48 h-48 object-cover rounded-lg"
                      />
                      <div className="text-6xl mb-4">{currentOffer.icon}</div>
                      <h3 className="text-2xl font-bold text-white">
                        {currentOffer.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="text-3xl font-black text-white">
                          {currentOffer.price}
                        </div>
                        <div className="text-lg text-white/70 line-through">
                          {currentOffer.originalPrice}
                        </div>
                      </div>
                      <button className="bg-white text-red-600 font-bold py-3 px-6 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                        Porosit Tani
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-white/10 text-center text-white">
                    Duke ngarkuar ofertat...
                  </div>
                )}

                {/* Offer Indicators */}
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

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button className="bg-gradient-to-r from-yellow-400 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group">
            <ChefHat className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
