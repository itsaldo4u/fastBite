import { useState, useEffect, useRef } from "react";
import ProductCard from "../ProductCard";
import ShoppingCartDropdown from "../ShoppingCartDropdown";
import { ShoppingCart, Utensils, Sparkles, TrendingUp } from "lucide-react";
import CheckoutStepper from "./CheckoutStepper";
import { useProduct } from "../context/ProductContext";
import { useCart } from "../context/CartContext";

export default function MenuPage() {
  const { products } = useProduct();
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();

  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const finalPrice = product.discount
      ? product.price - product.price * (product.discount / 100)
      : product.price;

    addToCart({
      id,
      title: product.title,
      price: finalPrice,
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
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

  // Auto-scroll logic for offers
  useEffect(() => {
    const slider = offerSliderRef.current;
    if (!slider) return;

    let animationFrameId: number;
    const scrollStep = 1; // Speed

    function scroll() {
      if (!isPaused && slider) {
        slider.scrollLeft += scrollStep;
        // Reset scroll when reaching the halfway point (assuming duplicated content)
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    }

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-32 px-4 md:px-6 overflow-x-hidden">
      {/* Background decorations - Toned down slightly for mobile performance */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-24 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 pt-8 md:pt-12 md:mb-16">
          <div className="group">
            <h1 className="text-3xl md:text-5xl font-black text-yellow-400 flex items-center space-x-3 md:space-x-4 transform transition-all duration-300">
              <div className="relative">
                <Utensils className="w-8 h-8 md:w-10 md:h-10 transform group-hover:rotate-12 transition-transform duration-300" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 text-pink-400 animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Menyja
              </span>
            </h1>
            <div className="h-1 w-0 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-500 mt-2 rounded-full" />
          </div>

          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Toggle shopping cart"
          >
            <ShoppingCart
              size={24}
              className="transform group-hover:scale-110 transition-transform duration-300"
            />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full text-xs w-6 h-6 md:w-7 md:h-7 flex items-center justify-center font-bold animate-pulse shadow-lg">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Special Offers Slider */}
        <section className="mb-12 md:mb-20">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center group cursor-pointer">
              <div className="mr-3 md:mr-4 text-3xl md:text-4xl animate-bounce">
                🎉
              </div>
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-red-500 transition-all duration-300">
                Zgjidhe te Preferuaren!
              </span>
              <TrendingUp className="ml-2 md:ml-3 w-6 h-6 md:w-7 md:h-7 text-green-400 animate-pulse" />
            </h2>
          </div>

          <div
            ref={offerSliderRef}
            className="overflow-x-auto no-scrollbar relative rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 touch-pan-x"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="flex space-x-6 md:space-x-8 px-2 w-max">
              {[...products, ...products]
                .filter((p) => p.isCombo || p.discount || p.isNew)
                .map((product, idx) => (
                  <div
                    key={`${product.id}_offer_${idx}`}
                    className="flex-shrink-0 w-72 md:w-80 cursor-pointer transform hover:scale-105 transition-all duration-300"
                  >
                    <ProductCard {...product} onAddToCart={handleAddToCart} />
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Food Categories Grid */}
        {categories
          .filter((cat) => !activeCategory || activeCategory === cat)
          .map((cat, categoryIndex) => (
            <section key={`cat_${cat}`} className="mb-12 md:mb-20">
              <div className="flex items-center justify-between mb-6 md:mb-8 sticky top-0 z-10 py-4 bg-slate-900/80 backdrop-blur-md -mx-4 px-4 md:mx-0 md:bg-transparent md:backdrop-blur-none">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center">
                  <span className="mr-3 text-3xl md:text-4xl">
                    {cat === "Pizza" ? "🍕" : cat === "Burger" ? "🍔" : "🥤"}
                  </span>
                  {cat}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent ml-4 md:ml-6" />
              </div>

              {/* RESPONSIVE GRID LOGIC:
                - Mobile: grid-cols-1 (1 card per row)
                - Small Tablets/Large Phones: sm:grid-cols-2 (2 cards per row)
                - Desktop: lg:grid-cols-3, xl:grid-cols-4
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {products
                  .filter((p) => p.category === cat)
                  .map((product, index) => (
                    <div
                      key={`product_${product.id}_cat_${cat}`}
                      // The 'translate-y' effect creates gaps on mobile, so we restrict it to lg (large) screens only
                      className={`transform transition-all duration-500 hover:scale-105 ${
                        index % 3 === 1 ? "lg:translate-y-8" : ""
                      } ${index % 4 === 2 ? "xl:translate-y-4" : ""}`}
                      style={{
                        animationDelay: `${categoryIndex * 100 + index * 50}ms`,
                      }}
                    >
                      <div className="relative group h-full">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                        <div className="relative h-full">
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

        {/* Categories as Floating Bottom Bar */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20 px-4">
          <div className="pointer-events-auto max-w-full overflow-x-auto no-scrollbar rounded-2xl">
            <div className="flex space-x-2 bg-slate-900/90 backdrop-blur-xl p-2 border border-white/20 rounded-2xl shadow-2xl">
              {categories.map((cat) => (
                <button
                  key={`bottom_cat_${cat}`}
                  onClick={() => {
                    setActiveCategory(activeCategory === cat ? null : cat);
                    // Optional: scroll to top when changing filters
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`whitespace-nowrap px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg transform scale-105"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Reset Button (only shows if filter active) */}
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="whitespace-nowrap px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm md:text-base"
                >
                  Të gjitha
                </button>
              )}
            </div>
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
