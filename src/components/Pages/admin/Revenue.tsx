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
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

type OrderItem = {
  productId: number;
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState<RevenueData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductReport[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);

  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get<Order[]>(API_URL);
      setOrders(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së të dhënave të porosive:", err);
    } finally {
      setIsLoading(false);
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
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      return created >= startDate && created < adjustedEndDate;
    });

    setTotalOrders(filteredOrders.length);

    const total = filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    setTotalRevenue(total);

    const dailyTotals: Record<string, number> = {};
    const tempStartDate = new Date(startDate);
    const tempEndDate = new Date(endDate);

    while (tempStartDate <= tempEndDate) {
      const key = tempStartDate.toISOString().slice(0, 10);
      dailyTotals[key] = 0;
      tempStartDate.setDate(tempStartDate.getDate() + 1);
    }

    filteredOrders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      if (dailyTotals[key] !== undefined) {
        dailyTotals[key] += order.totalPrice;
      }
    });

    const dailyData = Object.entries(dailyTotals)
      .map(([date, total]) => {
        const d = new Date(date);
        return {
          date: d.toLocaleDateString("sq-AL", {
            day: "numeric",
            month: "short",
          }),
          total,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    d.setHours(0, 0, 0, 0);
    if (!isNaN(d.getTime())) setStartDate(d);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    d.setHours(23, 59, 59, 999);
    if (!isNaN(d.getTime())) setEndDate(d);
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-48 sm:h-64">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg flex-shrink-0">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold mb-1">
              Dashboard i Analizave
            </h1>
            <p className="text-white/90 text-xs sm:text-sm">
              Monitoroni performancën e biznesit tuaj
            </p>
          </div>
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6">
          <div className="w-full sm:w-auto space-y-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-blue-500" />
              Data e Fillimit
            </label>
            <input
              type="date"
              value={startDate.toISOString().slice(0, 10)}
              onChange={handleStartDateChange}
              max={endDate.toISOString().slice(0, 10)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all text-gray-800 dark:text-white text-sm sm:text-base"
            />
          </div>

          <div className="w-full sm:w-auto space-y-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-purple-500" />
              Data e Mbarimit
            </label>
            <input
              type="date"
              value={endDate.toISOString().slice(0, 10)}
              onChange={handleEndDateChange}
              min={startDate.toISOString().slice(0, 10)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all text-gray-800 dark:text-white text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Total Revenue Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                    Të Ardhurat Totale
                  </h2>
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                    Numri i Porosive
                  </h2>
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {totalOrders}
                </p>
              </div>
            </div>
          </div>

          {/* Top Products Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2.5 sm:p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Top 5 Produktet e Shitura
              </h2>
            </div>

            {topProducts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
                Nuk ka të dhëna për shitje në këtë periudhë.
              </p>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {topProducts.map((p, index) => (
                  <div
                    key={p.title}
                    className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border-2 border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-sm sm:text-base flex-shrink-0 ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                            : index === 1
                            ? "bg-gradient-to-r from-gray-400 to-gray-500"
                            : index === 2
                            ? "bg-gradient-to-r from-orange-600 to-orange-700"
                            : "bg-gradient-to-r from-blue-500 to-purple-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">
                        {p.title}
                      </span>
                    </div>
                    <span className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md whitespace-nowrap ml-2">
                      {p.quantitySold} copë
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Daily Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="text-sm sm:text-xl">
                  Fluksi Ditor i Të Ardhurave
                </span>
              </h2>
              {dailyRevenue.length === 0 ? (
                <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500 dark:text-gray-400 text-sm sm:text-base px-4 text-center">
                  Nuk ka të dhëna të porosive në rangun e caktuar.
                </div>
              ) : (
                <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <div className="min-w-[300px]">
                    <ResponsiveContainer
                      width="100%"
                      height={250}
                      className="sm:!h-[300px]"
                    >
                      <LineChart
                        data={dailyRevenue}
                        margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid
                          stroke="#e0e0e0"
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: "#888", fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: "#ccc" }}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          tickFormatter={(value: number) =>
                            `$${value.toFixed(0)}`
                          }
                          tick={{ fill: "#888", fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          width={40}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderRadius: 12,
                            borderColor: "#4b5563",
                            color: "#fff",
                            padding: 12,
                            fontSize: 12,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: "bold" }}
                          formatter={(value: number) => [
                            `$${value.toFixed(2)}`,
                            "Të Ardhurat",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="url(#lineGradient)"
                          strokeWidth={2}
                          dot={{
                            r: 4,
                            fill: "#8b5cf6",
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          activeDot={{
                            r: 6,
                            stroke: "#8b5cf6",
                            strokeWidth: 2,
                            fill: "#fff",
                          }}
                        />
                        <defs>
                          <linearGradient
                            id="lineGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Top Products Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                <span className="text-sm sm:text-xl">
                  Sasia e Shitjeve Sipas Produktit
                </span>
              </h2>
              {topProducts.length === 0 ? (
                <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  Nuk ka të dhëna për grafik.
                </div>
              ) : (
                <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <div className="min-w-[300px]">
                    <ResponsiveContainer
                      width="100%"
                      height={250}
                      className="sm:!h-[300px]"
                    >
                      <BarChart
                        data={topProducts}
                        margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                        layout="vertical"
                        barCategoryGap="20%"
                      >
                        <CartesianGrid
                          stroke="#e0e0e0"
                          strokeDasharray="3 3"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fill: "#888", fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: "#ccc" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="title"
                          tick={{ fill: "#888", fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          width={80}
                          tickFormatter={(value: string) =>
                            value.length > 12
                              ? value.substring(0, 12) + "..."
                              : value
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderRadius: 12,
                            borderColor: "#4b5563",
                            color: "#fff",
                            padding: 12,
                            fontSize: 12,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: "bold" }}
                          formatter={(value: number) => [
                            `${value} copë`,
                            "Sasia",
                          ]}
                        />
                        <Bar
                          dataKey="quantitySold"
                          fill="url(#barGradient)"
                          radius={[0, 10, 10, 0]}
                          minPointSize={5}
                        />
                        <defs>
                          <linearGradient
                            id="barGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
