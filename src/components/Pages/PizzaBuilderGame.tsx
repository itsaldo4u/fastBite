import React, { useState, useRef, useEffect } from "react";
import { Heart, ShoppingCart, RotateCcw, Sparkles, X } from "lucide-react";
import CheckoutStepper from "./CheckoutStepper";
import ShoppingCartDropdown from "../ShoppingCartDropdown";

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

  type CartItem = {
    id: string;
    title: string;
    price: number;
    quantity: number;
    size?: string;
    crust?: string;
    toppings?: string[];
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

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
  const addTopping = (topping: Topping) => {
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

  // Cart
  const createCartItems = (): CartItem[] => {
    const sizeData = sizes.find((s) => s.id === selectedSize);
    const crustData = crusts.find((c) => c.id === selectedCrust);

    return [
      {
        id: `pizza-${Date.now()}`,
        title: `Pizza ${sizeData?.name} - ${crustData?.name}`,
        price: totalPrice,
        quantity: 1,
        size: selectedSize,
        crust: selectedCrust,
        toppings: selectedToppings.map((t) => t.name),
      },
    ];
  };

  const handleAddToCart = () => {
    const items = createCartItems();
    setCartItems((prev) => [...prev, ...items]);
    setCartOpen(true);
  };

  const handleClearCart = () => {
    clearPizza();
    setSelectedSize("medium");
    setSelectedCrust("classic");
    setCartItems([]);
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

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Panel */}
          <div className="space-y-4">
            {/* Size */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-2">📏 Madhësia</h3>
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
                      <span>{size.basePrice}€</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Crust */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-2">🥖 Brumi</h3>
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
                      <span>+{crust.price}€</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Favorites */}
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
                            {favorite.price.toFixed(2)}€
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

          {/* Center Pizza */}
          <div className="space-y-4">
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

              {/* Controls */}
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

            {/* Price & Add to Cart */}
            <div className="bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl p-4 text-white text-center">
              <div className="text-2xl font-bold mb-1">
                {totalPrice.toFixed(2)}€
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

              {/* Checkout */}
              {showCheckout && (
                <CheckoutStepper
                  cartItems={
                    cartItems.length > 0 ? cartItems : createCartItems()
                  }
                  onClose={() => setShowCheckout(false)}
                  clearCart={handleClearCart}
                />
              )}
            </div>
          </div>

          {/* Right Toppings */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-2">🧄 Përbërësit</h3>
            <div className="grid grid-cols-3 gap-2">
              {toppings.map((topping) => (
                <button
                  key={topping.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, topping)}
                  onClick={() => addTopping(topping)}
                  className="bg-white/5 hover:bg-white/10 text-white text-base p-2 rounded-lg transition flex flex-col items-center"
                >
                  {topping.emoji}
                  <span className="text-xs">{topping.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
            ✅ Veprimi u krye me sukses!
          </div>
        )}

        {/* Shopping Cart Dropdown */}
        {cartOpen && (
          <ShoppingCartDropdown
            cartItems={cartItems}
            onAdd={(id) => {
              setCartItems((prev) =>
                prev.map((item) =>
                  item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
              );
            }}
            onRemove={(id) => {
              setCartItems((prev) =>
                prev
                  .map((item) =>
                    item.id === id
                      ? { ...item, quantity: item.quantity - 1 }
                      : item
                  )
                  .filter((item) => item.quantity > 0)
              );
            }}
            onClear={handleClearCart}
            onClose={() => setCartOpen(false)}
            onCheckout={() => setShowCheckout(true)}
          />
        )}
      </div>
    </div>
  );
};

export default PizzaBuilderGame;
