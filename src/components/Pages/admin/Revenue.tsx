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
  date: string;
  total: number;
};

export default function DashboardReports() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Raporte dhe Filtra
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState<RevenueData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductReport[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filtri i datave
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>("http://localhost:3000/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së të dhënave");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) {
      setTotalRevenue(0);
      setDailyRevenue([]);
      setTopProducts([]);
      setTotalOrders(0);
      return;
    }

    const filteredOrders = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= startDate && created <= endDate;
    });

    setTotalOrders(filteredOrders.length);

    const total = filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    setTotalRevenue(total);

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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    if (!isNaN(d.getTime())) setStartDate(d);
  };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    if (!isNaN(d.getTime())) setEndDate(d);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white drop-shadow-sm">
          Dashboard i Raporteve
        </h1>

        {/* Filtra */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8">
          <label className="flex flex-col text-gray-700 dark:text-gray-300 font-semibold">
            Fillimi
            <input
              type="date"
              value={startDate.toISOString().slice(0, 10)}
              onChange={handleStartDateChange}
              max={endDate.toISOString().slice(0, 10)}
              className="mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-sm"
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
              className="mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-sm"
            />
          </label>
        </div>

        {/* Cards Raporte */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Të Ardhurat Totale
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Numri i Porosive
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalOrders}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Top Produkte
            </h2>
            {topProducts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Nuk ka të dhëna
              </p>
            ) : (
              <ul className="max-h-32 overflow-auto space-y-1 text-sm text-gray-900 dark:text-white">
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

        {/* Grafikët në grid 2 kolona */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Të ardhurat ditore */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Të Ardhurat Ditore
            </h2>
            {dailyRevenue.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Nuk ka të dhëna për grafik.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={dailyRevenue}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
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
                    }}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top Produkte */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Top Produkte më të Shitura
            </h2>
            {topProducts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Nuk ka të dhëna.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={topProducts}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  barSize={30}
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
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
