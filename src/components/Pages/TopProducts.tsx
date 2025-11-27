import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, ShoppingCart, Flame, Award } from "lucide-react";

const ORDERS_URL = `${import.meta.env.VITE_API_URL}/orders`;
const PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/products`;

type OrderItem = {
  productId?: string; // mund të jetë undefined në porosi
  title?: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
  status: string;
};

type Product = {
  _id: string;
  id: string;
  title: string;
  price: number;
  image?: string;
};

type TopProduct = {
  title: string;
  quantitySold: number;
  avgPrice: number;
  productId: string;
  image?: string;
};

interface TopProductsProps {
  onAddToCart: (id: string, title: string, price: number) => void;
}

export default function TopProducts({ onAddToCart }: TopProductsProps) {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    setIsLoading(true);
    try {
      // Merr porositë
      const ordersRes = await axios.get<Order[]>(ORDERS_URL);
      const orders = ordersRes.data;

      // Merr produktet
      const productsRes = await axios.get<Product[]>(PRODUCTS_URL);
      const products = productsRes.data;

      // Map për të lidhur titullin me produktin (image, id)
      const titleToProduct = new Map<string, Product>();
      products.forEach((p) => {
        if (p.title) {
          titleToProduct.set(p.title.trim(), p);
        }
      });

      // Filtron porositë e 7 ditëve të fundit
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentOrders = orders.filter(
        (order) => new Date(order.createdAt) >= sevenDaysAgo
      );

      // Llogarit statistikat e produkteve
      const productStats: Record<
        string,
        {
          quantity: number;
          totalPrice: number;
          count: number;
          productId: string;
        }
      > = {};

      recentOrders.forEach((order) => {
        order.items.forEach((item) => {
          const key = item.title?.trim();
          if (!key) return;

          // Merr productId nga produkti origjinal
          const product = titleToProduct.get(key);
          if (!product) return;

          if (!productStats[key]) {
            productStats[key] = {
              quantity: 0,
              totalPrice: 0,
              count: 0,
              productId: product.id || product._id,
            };
          }
          productStats[key].quantity += item.quantity;
          productStats[key].totalPrice += item.price * item.quantity;
          productStats[key].count += item.quantity;
        });
      });

      // Krijon top 4 produktet
      const topProductsArr: TopProduct[] = Object.entries(productStats)
        .map(([title, stats]) => ({
          title,
          quantitySold: stats.quantity,
          avgPrice: stats.count ? stats.totalPrice / stats.count : 0,
          productId: stats.productId,
          image: titleToProduct.get(title)?.image || "/placeholder.jpg",
        }))
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 4);

      setTopProducts(topProductsArr);
    } catch (err) {
      console.error("Gabim gjatë marrjes së produkteve:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (topProducts.length === 0) {
    return null;
  }

  const getRankBadge = (index: number) => {
    const badges = [
      {
        icon: "🏆",
        gradient: "from-yellow-400 to-orange-500",
        shadow: "shadow-yellow-500/50",
      },
      {
        icon: "🥈",
        gradient: "from-gray-300 to-gray-400",
        shadow: "shadow-gray-400/50",
      },
      {
        icon: "🥉",
        gradient: "from-orange-400 to-orange-600",
        shadow: "shadow-orange-500/50",
      },
      {
        icon: "⭐",
        gradient: "from-purple-400 to-pink-500",
        shadow: "shadow-purple-500/50",
      },
    ];
    return badges[index] || badges[3];
  };

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Më të{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                Preferuarat
              </span>
            </h2>
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-300">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p>Top 4 produktet e 7 ditëve të fundit</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topProducts.map((product, index) => {
            const badge = getRankBadge(index);
            return (
              <div
                key={product.productId}
                className="group relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg rounded-2xl border-2 border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                </div>

                {/* Rank Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div
                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${badge.gradient} ${badge.shadow} shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}
                  >
                    <span className="text-xl sm:text-2xl">{badge.icon}</span>
                  </div>
                </div>

                {/* Trending Icon */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="p-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-4 sm:p-6 flex-1 flex flex-col justify-end -mt-10 sm:-mt-12">
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {product.title}
                  </h3>

                  <div className="space-y-1.5 sm:space-y-2 mb-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Shitur:</span>
                      <span className="font-bold text-orange-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {product.quantitySold} copë
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Çmimi:</span>
                      <span className="font-bold text-green-400">
                        ${product.avgPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3"></div>

                  <button
                    onClick={() =>
                      onAddToCart(
                        product.productId,
                        product.title,
                        product.avgPrice
                      )
                    }
                    className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/30 flex items-center justify-center gap-1.5 group/btn"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:animate-bounce" />
                    <span>Shto në Shportë</span>
                  </button>
                </div>

                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${badge.gradient} blur-2xl -z-10`}
                ></div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Të përditësuara në kohë reale bazuar në porositë tuaja
          </p>
        </div>
      </div>
    </section>
  );
}
