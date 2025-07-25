import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type OrderItem = {
  productId: number;
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
  status: string;
};

type ProductReport = {
  title: string;
  quantitySold: number;
};

type RevenueData = {
  date: string; // "19 Jul"
  total: number;
};

export default function DashboardReports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Raporte dhe Filtra
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState<RevenueData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductReport[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filtri i datave (start dhe end)
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6); // 7 ditët e fundit
    return d;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Funksion për të marrë porositë nga API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mund të ndryshohet API për filtra në backend më vonë
      const res = await axios.get<Order[]>("http://localhost:3000/orders");
      setOrders(res.data);
    } catch (err) {
      setError("Gabim gjatë marrjes së të dhënave");
    } finally {
      setLoading(false);
    }
  };

  // Marrim porositë një herë në fillim
  useEffect(() => {
    fetchOrders();
  }, []);

  // Përpunojmë të dhënat sa herë ndryshon orders ose filter datat
  useEffect(() => {
    if (orders.length === 0) {
      setTotalRevenue(0);
      setDailyRevenue([]);
      setTopProducts([]);
      setTotalOrders(0);
      return;
    }

    // Filtrimi i porosive sipas dates startDate dhe endDate
    const filteredOrders = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= startDate && created <= endDate;
    });

    setTotalOrders(filteredOrders.length);

    // 1. Të ardhurat totale në periudhë
    const total = filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    setTotalRevenue(total);

    // 2. Të ardhurat ditore në periudhë
    // Ndërto listën e ditëve midis startDate dhe endDate
    const dayCount =
      Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      ) + 1;
    const dailyTotals: Record<string, number> = {};
    for (let i = 0; i < dayCount; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dailyTotals[key] = 0;
    }

    filteredOrders.forEach((order) => {
      const key = order.createdAt.slice(0, 10);
      if (dailyTotals[key] !== undefined) {
        dailyTotals[key] += order.totalPrice;
      }
    });

    const dailyData = Object.entries(dailyTotals).map(([date, total]) => {
      const d = new Date(date);
      return {
        date: d.toLocaleDateString("sq-AL", { day: "numeric", month: "short" }),
        total,
      };
    });
    setDailyRevenue(dailyData);

    // 3. Produktet më të shitura (top 5)
    const productCount: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        productCount[item.title] =
          (productCount[item.title] || 0) + item.quantity;
      });
    });

    const topProductsArr = Object.entries(productCount)
      .map(([title, quantitySold]) => ({ title, quantitySold }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);
    setTopProducts(topProductsArr);
  }, [orders, startDate, endDate]);

  // Ndryshimi i datave nga input-et
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    if (!isNaN(d.getTime())) setStartDate(d);
  };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    if (!isNaN(d.getTime())) setEndDate(d);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-white drop-shadow-sm">
          Dashboard i Raporteve
        </h1>

        {/* Filtra për periudhën */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 mb-16">
          <label className="flex flex-col text-gray-700 dark:text-gray-300 font-semibold">
            Fillimi
            <input
              type="date"
              value={startDate.toISOString().slice(0, 10)}
              onChange={handleStartDateChange}
              max={endDate.toISOString().slice(0, 10)}
              className="mt-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          </label>
          <label className="flex flex-col text-gray-700 dark:text-gray-300 font-semibold">
            Mbarimi
            <input
              type="date"
              value={endDate.toISOString().slice(0, 10)}
              onChange={handleEndDateChange}
              min={startDate.toISOString().slice(0, 10)}
              max={new Date().toISOString().slice(0, 10)}
              className="mt-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          </label>
        </div>

        {/* Statusi */}
        {loading && (
          <p className="text-center text-orange-600 font-semibold text-lg animate-pulse">
            Duke ngarkuar të dhënat...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 font-semibold text-lg">
            {error}
          </p>
        )}

        {/* Raportet */}
        {!loading && !error && (
          <>
            {/* Cards Raporte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Card 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Të Ardhurat Totale
                </h2>
                <p className="text-5xl font-extrabold text-green-600 dark:text-green-400">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Numri i Porosive
                </h2>
                <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                  {totalOrders}
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Produktet më të Shitura
                </h2>
                {topProducts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    Nuk ka të dhëna
                  </p>
                ) : (
                  <ul className="text-left max-h-48 overflow-auto space-y-2 font-medium text-gray-900 dark:text-white">
                    {topProducts.map((p) => (
                      <li key={p.title} className="flex justify-between">
                        <span>{p.title}</span>
                        <span className="text-orange-500">
                          {p.quantitySold} copë
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Grafik Të Ardhura Ditore */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-16">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-300">
                Të Ardhurat Ditore
              </h2>
              {dailyRevenue.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Nuk ka të dhëna për grafik.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart
                    data={dailyRevenue}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#888" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#888" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        borderColor: "#ddd",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#f97316"
                      strokeWidth={4}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Grafik Produktet më të Shitura */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-300">
                Top 5 Produkte më të Shitura
              </h2>
              {topProducts.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Nuk ka të dhëna.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={topProducts}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    barSize={40}
                  >
                    <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="title"
                      tick={{ fill: "#888" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#888" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="quantitySold"
                      fill="#f97316"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
