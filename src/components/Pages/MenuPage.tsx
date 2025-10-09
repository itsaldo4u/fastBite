import { useState, useEffect, useRef } from "react";
import ProductCard from "../ProductCard";
import ShoppingCartDropdown from "../ShoppingCartDropdown";
import { ShoppingCart, Utensils, Sparkles, TrendingUp } from "lucide-react";
import CheckoutStepper from "./CheckoutStepper";
import { useProduct } from "../context/ProductContext";

export default function MenuPage() {
  const { products } = useProduct();

  const [cartItems, setCartItems] = useState<
    { id: string; title: string; price: number; quantity: number }[]
  >([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleAddToCart = (id: string) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === id);
      if (exist) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const product = products.find((p) => p.id === id);
      if (!product) return prev;
      return [
        ...prev,
        { id, title: product.title, price: product.price, quantity: 1 },
      ];
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

  useEffect(() => {
    const openCheckoutHandler = () => setShowCheckout(true);
    window.addEventListener("openCheckout", openCheckoutHandler);
    return () =>
      window.removeEventListener("openCheckout", openCheckoutHandler);
  }, []);

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  const categories = ["Pizza", "Burger", "Pije"];

  const offerSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = offerSliderRef.current;
    if (!slider) return;

    let animationFrameId: number;
    const scrollStep = 1;

    function scroll() {
      if (!isPaused && slider) {
        slider.scrollLeft += scrollStep;
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    }

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-20 px-6 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-24 left-24 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-500" />
        {/* Animated floating elements */}
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
                <Utensils className="w-10 h-10 transform group-hover:rotate-12 transition-transform duration-300" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-pink-400 animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Menyja
              </span>
            </h1>
            <div className="h-1 w-0 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-500 mt-2 rounded-full" />
          </div>

          <button
            onClick={() => setCartOpen(!cartOpen)}
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

        {/* Special Offers Slider */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <div className="mr-4 text-4xl animate-bounce">🎉</div>
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-red-500 transition-all duration-300">
                Zgjidhe te Preferuaren !
              </span>
              <TrendingUp className="ml-3 w-7 h-7 text-green-400 animate-pulse" />
            </h2>
          </div>

          <div
            ref={offerSliderRef}
            className="overflow-hidden whitespace-nowrap relative rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex space-x-8 px-2">
              {[...products, ...products]
                .filter((p) => p.isCombo || p.discount || p.isNew)
                .map((product, idx) => (
                  <div
                    key={product.id + "_" + idx}
                    className="flex-shrink-0 w-80 cursor-pointer transform hover:scale-105 transition-all duration-300"
                  >
                    <ProductCard {...product} onAddToCart={handleAddToCart} />
                  </div>
                ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-900/50 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-900/50 to-transparent pointer-events-none" />
          </div>
        </section>

        {/* Floating Stats (shkon mbi grid) */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-8 py-4 flex items-center space-x-8 shadow-2xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {products.length}
              </div>
              <div className="text-xs text-gray-300">Produktet</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {products.filter((p) => p.discount).length}
              </div>
              <div className="text-xs text-gray-300">Oferta</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">4.8★</div>
              <div className="text-xs text-gray-300">Rating</div>
            </div>
          </div>
        </div>

        {/* Food Categories Grid */}
        {categories
          .filter((cat) => !activeCategory || activeCategory === cat)
          .map((cat, categoryIndex) => (
            <section key={cat} className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center">
                  <span className="mr-3 text-4xl">
                    {cat === "Pizza" ? "🍕" : cat === "Burger" ? "🍔" : "🥤"}
                  </span>
                  {cat}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent ml-6" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products
                  .filter((p) => p.category === cat)
                  .map((product, index) => (
                    <div
                      key={product.id}
                      className={`transform transition-all duration-500 hover:scale-105 ${
                        index % 3 === 1 ? "lg:translate-y-8" : ""
                      } ${index % 4 === 2 ? "xl:translate-y-4" : ""}`}
                      style={{
                        animationDelay: `${categoryIndex * 100 + index * 50}ms`,
                      }}
                    >
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                        <div className="relative">
                          <ProductCard
                            {...product}
                            onAddToCart={handleAddToCart}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}

        {/* Categories as Floating Bottom */}
        <div className="fixed bottom-8 left-8 right-8 flex justify-center pointer-events-auto z-20">
          <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg transform scale-105"
                    : "text-white hover:bg-white/10 hover:scale-105"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping Cart */}
      {cartOpen && (
        <ShoppingCartDropdown
          cartItems={cartItems}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
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
          onClose={handleCheckoutClose}
          clearCart={handleClearCart}
        />
      )}
    </div>
  );
}
