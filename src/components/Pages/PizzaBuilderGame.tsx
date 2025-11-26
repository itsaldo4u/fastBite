import React, { useState, useRef, useEffect } from "react";
import { Heart, ShoppingCart, RotateCcw, Sparkles, X } from "lucide-react";
import CheckoutStepper from "./CheckoutStepper";
import ShoppingCartDropdown from "../ShoppingCartDropdown";
import { useCart } from "../context/CartContext";

const PizzaBuilderGame = () => {
  type Topping = {
    id: number;
    name: string;
    price: number;
    emoji: string;
    color: string;
    x?: number;
    y?: number;
    animationId?: number;
  };

  type Favorite = {
    id: number;
    name: string;
    toppings: Topping[];
    size: string;
    crust: string;
    price: number;
  };

  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedCrust, setSelectedCrust] = useState("classic");
  const [totalPrice, setTotalPrice] = useState(0);
  const [savedFavorites, setSavedFavorites] = useState<Favorite[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draggedTopping, setDraggedTopping] = useState<Topping | null>(null);
  const [pizzaAnimations, setPizzaAnimations] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<
    "size" | "crust" | "toppings" | null
  >(null);
  // USE CART CONTEXT INSTEAD OF LOCAL STATE
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();

  const pizzaRef = useRef<HTMLDivElement>(null);

  const toppings: Topping[] = [
    { id: 1, name: "Pepperoni", price: 1.5, emoji: "🍕", color: "#d2001f" },
    { id: 2, name: "Kerpudha", price: 1.2, emoji: "🍄", color: "#8b4513" },
    { id: 3, name: "Djathë Extra", price: 1.8, emoji: "🧀", color: "#ffd700" },
    { id: 4, name: "Ullinj", price: 1.0, emoji: "🫒", color: "#556b2f" },
    { id: 5, name: "Domate", price: 0.8, emoji: "🍅", color: "#ff6347" },
    { id: 6, name: "Qepë", price: 0.7, emoji: "🧅", color: "#dda0dd" },
    { id: 7, name: "Speca", price: 1.1, emoji: "🫑", color: "#228b22" },
    { id: 8, name: "Proshutë", price: 2.2, emoji: "🥓", color: "#cd853f" },
    { id: 9, name: "Ananas", price: 1.3, emoji: "🍍", color: "#ffa500" },
    { id: 10, name: "Borzilok", price: 0.9, emoji: "🌿", color: "#32cd32" },
    { id: 11, name: "Salsiçe", price: 2.0, emoji: "🌭", color: "#8b0000" },
    { id: 12, name: "Rukola", price: 1.1, emoji: "🥬", color: "#006400" },
  ];

  const sizes = [
    { id: "small", name: "Small (25cm)", basePrice: 8.99, multiplier: 1 },
    { id: "medium", name: "Medium (30cm)", basePrice: 12.99, multiplier: 1.2 },
    { id: "large", name: "Large (35cm)", basePrice: 16.99, multiplier: 1.5 },
  ];

  const crusts = [
    { id: "classic", name: "Klasike", price: 0 },
    { id: "thin", name: "E Hollë", price: 1.0 },
    { id: "thick", name: "E Trashë", price: 1.5 },
    { id: "stuffed", name: "Me Djathë", price: 2.5 },
  ];

  useEffect(() => {
    const sizeData = sizes.find((s) => s.id === selectedSize);
    const crustData = crusts.find((c) => c.id === selectedCrust);
    const toppingsPrice = selectedToppings.reduce(
      (sum, topping) => sum + topping.price * (sizeData?.multiplier ?? 1),
      0
    );
    if (sizeData && crustData) {
      setTotalPrice(sizeData.basePrice + crustData.price + toppingsPrice);
    } else {
      setTotalPrice(0);
    }
  }, [selectedToppings, selectedSize, selectedCrust]);

  // Drag & Drop
  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    topping: Topping
  ) => {
    setDraggedTopping(topping);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (
      draggedTopping &&
      !selectedToppings.find((t) => t.id === draggedTopping.id)
    ) {
      if (!pizzaRef.current) return;
      const rect = pizzaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const newTopping = { ...draggedTopping, x, y, animationId: Date.now() };
      setSelectedToppings((prev) => [...prev, newTopping]);
      setPizzaAnimations((prev) => [...prev, { id: Date.now(), x, y }]);
      setTimeout(() => setPizzaAnimations((prev) => prev.slice(1)), 1000);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 500);
    }
    setDraggedTopping(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Add / Remove toppings
  const addToppingToPizza = (topping: Topping) => {
    if (!selectedToppings.find((t) => t.id === topping.id)) {
      const x = 30 + Math.random() * 40;
      const y = 30 + Math.random() * 40;
      const newTopping = { ...topping, x, y, animationId: Date.now() };
      setSelectedToppings((prev) => [...prev, newTopping]);
      setPizzaAnimations((prev) => [...prev, { id: Date.now(), x, y }]);
      setTimeout(() => setPizzaAnimations((prev) => prev.slice(1)), 1000);
    }
  };

  const removeTopping = (toppingId: number) =>
    setSelectedToppings((prev) => prev.filter((t) => t.id !== toppingId));

  const clearPizza = () => setSelectedToppings([]);

  // Favorites
  const saveAsFavorite = () => {
    const favorite: Favorite = {
      id: Date.now(),
      name: `Custom Pizza ${savedFavorites.length + 1}`,
      toppings: selectedToppings,
      size: selectedSize,
      crust: selectedCrust,
      price: totalPrice,
    };
    setSavedFavorites((prev) => [...prev, favorite]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  const removeFavorite = (id: number) =>
    setSavedFavorites((prev) => prev.filter((fav) => fav.id !== id));

  // UPDATED: Add to cart using context
  const handleAddToCart = () => {
    const sizeData = sizes.find((s) => s.id === selectedSize);
    const crustData = crusts.find((c) => c.id === selectedCrust);

    addToCart({
      id: `pizza-${Date.now()}`,
      title: `Pizza ${sizeData?.name} - ${crustData?.name}`,
      price: totalPrice,
      size: selectedSize,
      crust: selectedCrust,
      toppings: selectedToppings.map((t) => t.name),
    });

    setCartOpen(true);
  };

  // UPDATED: Clear cart using context
  const handleClearCart = () => {
    clearPizza();
    setSelectedSize("medium");
    setSelectedCrust("classic");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-2">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            🍕{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              Krijo Picen Tënde
            </span>
          </h2>
          <p className="text-base text-gray-300 max-w-xl mx-auto">
            Krijo picën tënde perfekte! Tërhiq ose kliko përbërësit
          </p>
        </div>

        {/* MOBILE BOTTOM TAB BAR – fikse poshtë */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900/95 backdrop-blur border-t border-white/10 px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveMobileTab("size")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                activeMobileTab === "size"
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              Madhësia
            </button>
            <button
              onClick={() => setActiveMobileTab("crust")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                activeMobileTab === "crust"
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              Brumi
            </button>
            <button
              onClick={() => setActiveMobileTab("toppings")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                activeMobileTab === "toppings"
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              Përbërësit
            </button>
          </div>
        </div>

        {/* GRID – e njëjta si ty, por me padding poshtë për mobile */}
        <div className="grid lg:grid-cols-3 gap-4 pb-28 lg:pb-0">
          {/* LEFT PANEL – vetëm në desktop (lg+) */}
          <div className="hidden lg:block space-y-4">
            {/* Size */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-2">Madhësia</h3>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`w-full p-2 rounded-lg border text-sm transition-all ${
                      selectedSize === size.id
                        ? "bg-gradient-to-r from-yellow-400 to-red-500 text-white border-yellow-400"
                        : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{size.name}</span>
                      <span>{size.basePrice}$</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Crust */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-2">Brumi</h3>
              <div className="space-y-2">
                {crusts.map((crust) => (
                  <button
                    key={crust.id}
                    onClick={() => setSelectedCrust(crust.id)}
                    className={`w-full p-2 rounded-lg border text-sm transition-all ${
                      selectedCrust === crust.id
                        ? "bg-gradient-to-r from-yellow-400 to-red-500 text-white border-yellow-400"
                        : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{crust.name}</span>
                      <span>+{crust.price}$</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Favorites – desktop */}
            {savedFavorites.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  Të Preferuarat
                </h3>
                <div className="space-y-2">
                  {savedFavorites.slice(-3).map((favorite) => (
                    <div
                      key={favorite.id}
                      className="flex justify-between items-center bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition"
                    >
                      <button
                        onClick={() => {
                          setSelectedToppings(favorite.toppings);
                          setSelectedSize(favorite.size);
                          setSelectedCrust(favorite.crust);
                        }}
                        className="flex-1 p-2 text-left text-white text-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span>{favorite.name}</span>
                          <span className="text-yellow-400 font-bold">
                            {favorite.price.toFixed(2)}$
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CENTER – Pizza (e njëjta në mobile dhe desktop) */}
          <div className="space-y-4">
            {/* Pizza */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 relative">
              <div
                ref={pizzaRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative w-56 h-56 mx-auto bg-gradient-to-br from-yellow-700 to-orange-600 rounded-full border-4 border-yellow-800 shadow-xl overflow-hidden"
              >
                <div className="absolute inset-4 bg-gradient-to-br from-red-700 to-red-800 rounded-full opacity-80"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full opacity-90"></div>

                {selectedToppings.map((topping) => (
                  <button
                    key={topping.animationId}
                    onClick={() => removeTopping(topping.id)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-all duration-300 animate-bounce"
                    style={{ left: `${topping.x}%`, top: `${topping.y}%` }}
                  >
                    {topping.emoji}
                  </button>
                ))}

                {pizzaAnimations.map((anim) => (
                  <div
                    key={anim.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${anim.x}%`, top: `${anim.y}%` }}
                  >
                    <div className="animate-ping w-4 h-4 bg-yellow-400 rounded-full opacity-75"></div>
                    <div className="absolute inset-0 animate-pulse">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={clearPizza}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-full flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
                <button
                  onClick={saveAsFavorite}
                  disabled={selectedToppings.length === 0}
                  className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-500 text-white px-3 py-1.5 text-sm rounded-full flex items-center gap-1"
                >
                  <Heart className="w-3 h-3" /> Ruaj
                </button>
              </div>
            </div>

            {/* Çmimi + Shto në shportë */}
            <div className="bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl p-4 text-white text-center">
              <div className="text-2xl font-bold mb-1">
                {totalPrice.toFixed(2)}$
              </div>
              <div className="text-sm mb-2 opacity-90">
                {selectedToppings.length} përbërës
              </div>
              <button
                onClick={handleAddToCart}
                disabled={selectedToppings.length === 0}
                className="bg-white text-red-600 font-bold py-2 px-6 text-sm rounded-full hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                <ShoppingCart className="w-4 h-4" /> Shto në Shportë
              </button>
            </div>
          </div>

          {/* RIGHT PANEL – vetëm në desktop */}
          <div className="hidden lg:block bg-white/10 rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-2">Përbërësit</h3>
            <div className="grid grid-cols-3 gap-2">
              {toppings.map((topping) => (
                <button
                  key={topping.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, topping)}
                  onClick={() => addToppingToPizza(topping)}
                  className="bg-white/5 hover:bg-white/10 text-white text-base p-2 rounded-lg transition flex flex-col items-center"
                >
                  {topping.emoji}
                  <span className="text-xs">{topping.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE FAVORITES */}
        {savedFavorites.length > 0 && (
          <div className="lg:hidden mt-6 bg-white/10 rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1">
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              Të Preferuarat
            </h3>
            <div className="space-y-2">
              {savedFavorites.slice(-3).map((f) => (
                <div
                  key={f.id}
                  className="flex justify-between items-center bg-white/5 rounded-lg p-2 border border-white/10"
                >
                  <button
                    onClick={() => {
                      setSelectedToppings(f.toppings);
                      setSelectedSize(f.size);
                      setSelectedCrust(f.crust);
                    }}
                    className="flex-1 text-left text-sm text-white"
                  >
                    <div className="flex justify-between">
                      <span>{f.name}</span>
                      <span className="text-yellow-400 font-bold">
                        {f.price.toFixed(2)}$
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => removeFavorite(f.id)}
                    className="text-red-400 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MOBILE BOTTOM SHEET */}
        {activeMobileTab && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setActiveMobileTab(null)}
            />
            <div
              className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-white">
                  {activeMobileTab === "size" && "Zgjidh Madhësinë"}
                  {activeMobileTab === "crust" && "Zgjidh Brumin"}
                  {activeMobileTab === "toppings" && "Zgjidh Përbërësit"}
                </h3>
                <button onClick={() => setActiveMobileTab(null)}>
                  <X className="w-8 h-8 text-gray-400" />
                </button>
              </div>

              {/* Size */}
              {activeMobileTab === "size" &&
                sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSize(s.id);
                      setActiveMobileTab(null);
                    }}
                    className={`w-full p-5 rounded-xl text-left mb-3 transition-all ${
                      selectedSize === s.id
                        ? "bg-yellow-500 text-black font-bold"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg">{s.name}</span>
                      <span className="text-2xl font-bold">{s.basePrice}$</span>
                    </div>
                  </button>
                ))}

              {/* Crust */}
              {activeMobileTab === "crust" &&
                crusts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCrust(c.id);
                      setActiveMobileTab(null);
                    }}
                    className={`w-full p-5 rounded-xl text-left mb-3 transition-all ${
                      selectedCrust === c.id
                        ? "bg-yellow-500 text-black font-bold"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg">{c.name}</span>
                      <span className="text-2xl font-bold">+{c.price}$</span>
                    </div>
                  </button>
                ))}

              {/* Toppings */}
              {activeMobileTab === "toppings" && (
                <div className="grid grid-cols-3 gap-4 pb-20">
                  {toppings.map((t) => {
                    const isAdded = selectedToppings.some((x) => x.id === t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => addToppingToPizza(t)}
                        className={`p-6 rounded-2xl transition-all flex flex-col items-center ${
                          isAdded
                            ? "bg-yellow-500 text-black scale-105 shadow-xl"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <div className="text-5xl mb-2">{t.emoji}</div>
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-yellow-300">
                          +{t.price}$
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn z-50">
            ✅ Veprimi u krye me sukses!
          </div>
        )}

        {/* Shopping Cart Dropdown */}
        {cartOpen && (
          <ShoppingCartDropdown
            cartItems={cartItems}
            onAdd={(id) => {
              const item = cartItems.find((i) => i.id === id);
              if (item) {
                addToCart({
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  size: item.size,
                  crust: item.crust,
                  toppings: item.toppings,
                });
              }
            }}
            onRemove={removeFromCart}
            onClear={handleClearCart}
            onClose={() => setCartOpen(false)}
            onCheckout={() => {
              setCartOpen(false);
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
      </div>
    </div>
  );
};

export default PizzaBuilderGame;
