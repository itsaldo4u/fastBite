import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, ShoppingCart, Flame, Award } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const ORDERS_URL = `${API_URL}/orders`;
const PRODUCTS_URL = `${API_URL}/products`; // ky endpoint ekziston, apo jo?

type Product = {
  _id: string;
  id: string;
  title: string;
  price: number;
  image: string;
  discount?: number;
};

type OrderItem = {
  productId: string; // tani është string (sepse ti ke "pi03", "fe01", etj)
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  createdAt: string;
  items: OrderItem[];
};

type TopProduct = {
  productId: string;
  title: string;
  quantitySold: number;
  avgPrice: number;
  image: string;
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
      // 1. Merr të gjitha porositë
      const ordersRes = await axios.get<Order[]>(ORDERS_URL);
      const orders = ordersRes.data;

      // 7 ditët e fundit
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentOrders = orders.filter(
        (order) => new Date(order.createdAt) >= sevenDaysAgo
      );

      // 2. Llogarit shitjet për çdo productId (string!)
      const salesMap = new Map<
        string,
        { qty: number; total: number; count: number }
      >();

      recentOrders.forEach((order) => {
        order.items.forEach((item) => {
          const id = item.productId; // "pi03", "fe01", etj
          if (!salesMap.has(id)) {
            salesMap.set(id, { qty: 0, total: 0, count: 0 });
          }
          const stats = salesMap.get(id)!;
          stats.qty += item.quantity;
          stats.total += item.price * item.quantity;
          stats.count += item.quantity;
        });
      });

      // 3. Merr të gjithë produktet (vetëm një herë)
      const productsRes = await axios.get<Product[]>(PRODUCTS_URL);
      const productMap = new Map<string, Product>();
      productsRes.data.forEach((p) => {
        productMap.set(p.id, p); // kyç me "id" (pi03, fe01...)
        productMap.set(p._id, p); // edhe me ObjectId, për siguri
      });

      // 4. Krijo listën finale të top 4
      const topList: TopProduct[] = Array.from(salesMap.entries())
        .map(([productId, stats]) => {
          const product = productMap.get(productId);
          if (!product) return null;

          return {
            productId,
            title: product.title,
            quantitySold: stats.qty,
            avgPrice: stats.total / stats.count,
            image: product.image || "/placeholder.jpg",
          };
        })
        .filter(Boolean)
        .sort((a, b) => b!.quantitySold - a!.quantitySold)
        .slice(0, 4) as TopProduct[];

      setTopProducts(topList);
    } catch (err) {
      console.error("Gabim te TopProducts:", err);
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

  if (topProducts.length === 0) return null;

  const badges = ["Trophy", "Second Place", "Third Place", "Star"];
  const gradients = [
    "from-yellow-400 to-orange-500",
    "from-gray-300 to-gray-400",
    "from-orange-400 to-orange-600",
    "from-purple-400 to-pink-500",
  ];

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Më të{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
                Shitshmet
              </span>
            </h2>
            <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
          </div>
          <p className="text-gray-300 flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Top 4 produktet e 7 ditëve të fundit
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map((product, i) => (
            <div
              key={product.productId}
              className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20"
            >
              {/* Foto + overlay */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Rank Badge */}
                <div className="absolute top-4 left-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients[i]} shadow-2xl flex items-center justify-center text-2xl`}
                  >
                    {badges[i]}
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="p-2 bg-green-500/20 rounded-full border border-green-400/50 backdrop-blur">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
                  {product.title}
                </h3>

                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shitur:</span>
                    <span className="text-orange-400 font-bold flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {product.quantitySold} copë
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Çmimi mesatar:</span>
                    <span className="text-green-400 font-bold">
                      ${product.avgPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onAddToCart(
                      product.productId,
                      product.title,
                      product.avgPrice
                    )
                  }
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Shto në Shportë
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Përditësohet çdo minutë në bazë të porosive reale
          </p>
        </div>
      </div>
    </section>
  );
}
