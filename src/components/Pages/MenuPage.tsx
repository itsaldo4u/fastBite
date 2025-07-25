import { useState, useEffect, useRef } from "react";
import ProductCard from "../ProductCard";
import ShoppingCartDropdown from "../ShoppingCartDropdown";
import { ShoppingCart, Utensils } from "lucide-react";
import CheckoutStepper from "./CheckoutStepper";
import { useAuth } from "../context/AuthContext";

export default function MenuPage() {
  const { products } = useAuth();

  const [cartItems, setCartItems] = useState<
    { id: string; title: string; price: number; quantity: number }[]
  >([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Kontroll për ndaljen e scroll-it gjatë hover
  const [isPaused, setIsPaused] = useState(false);

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

  // Scroll automatik me ndalim gjatë hover dhe vazhdim kur largohet maus
  useEffect(() => {
    const slider = offerSliderRef.current;
    if (!slider) return;

    let animationFrameId: number;

    const scrollStep = 1;

    function scroll() {
      if (!isPaused && slider) {
        slider.scrollLeft += scrollStep;
        // Kur arrin gjysmën e scrollWidth kthe në 0 për scroll pafund
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-20 px-6">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-24 left-24 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 pt-12">
          <h1 className="text-4xl font-black text-yellow-400 flex items-center space-x-3">
            <Utensils className="w-8 h-8" />
            <span>Menyja</span>
          </h1>

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

        {/* Oferta Speciale */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2">🎉</span>
            Oferta Speciale
          </h2>

          <div
            ref={offerSliderRef}
            className="overflow-hidden whitespace-nowrap relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex space-x-6 px-2">
              {[...products, ...products]
                .filter((p) => p.isCombo || p.discount || p.isNew)
                .map((product, idx) => (
                  <div
                    key={product.id + "_" + idx}
                    className="flex-shrink-0 w-80 cursor-pointer"
                  >
                    <ProductCard {...product} onAddToCart={handleAddToCart} />
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Kategoritë e ushqimit */}
        {categories.map((cat) => (
          <section key={cat} className="mb-16">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-6 border-b-2 border-yellow-500 pb-2">
              {cat}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .filter((p) => p.category === cat)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      {/* Shopping Cart */}
      {cartOpen && (
        <ShoppingCartDropdown
          cartItems={cartItems}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
          onClear={handleClearCart}
          onClose={() => setCartOpen(false)}
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
