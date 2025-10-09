import { useRewards } from "./context/RewardsContext";
import { Gift, Ticket, Star } from "lucide-react";

export default function Rewards() {
  const { userPoints, userCoupons, generateCoupon } = useRewards();

  const rewardTiers = [
    { pointsCost: 100, discount: 10, label: "10% Zbritje" },
    { pointsCost: 200, discount: 15, label: "15% Zbritje" },
    { pointsCost: 300, discount: 20, label: "20% Zbritje" },
  ];

  const availableCoupons = userCoupons.filter(
    (c) => !c.used && new Date(c.expiresAt) > new Date()
  );
  const usedCoupons = userCoupons.filter((c) => c.used);
  const expiredCoupons = userCoupons.filter(
    (c) => !c.used && new Date(c.expiresAt) <= new Date()
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pikat Section */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Star className="fill-white" size={28} />
              Pikat e Mia
            </h2>
            <p className="text-white/90">
              Mblidh pika me çdo blerje dhe shkëmbeji për kupona!
            </p>
          </div>
          <div className="text-5xl font-bold">{userPoints}</div>
        </div>
        <div className="mt-4 bg-white/20 rounded-lg p-3">
          <p className="text-sm">
            💡 <strong>Si funksionon:</strong> Për çdo $10 të shpenzuara, fiton
            10 pika!
          </p>
        </div>
      </div>

      {/* Shkëmbej Pika për Kupona */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Gift size={24} className="text-orange-500" />
          Shkëmbej Pikat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewardTiers.map((tier) => (
            <div
              key={tier.pointsCost}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-orange-500 transition-all"
            >
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {tier.discount}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Zbritje
                </div>
              </div>
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {tier.pointsCost}
                </span>
                <span className="text-sm text-gray-500 ml-1">pika</span>
              </div>
              <button
                onClick={() => generateCoupon(tier.pointsCost, tier.discount)}
                disabled={userPoints < tier.pointsCost}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-all font-semibold"
              >
                {userPoints < tier.pointsCost
                  ? "Jo të mjaftueshme"
                  : "Shkëmbej"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Kuponat Aktiv */}
      {availableCoupons.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <Ticket size={24} className="text-green-500" />
            Kuponat e Mi Aktiv
          </h3>
          <div className="space-y-3">
            {availableCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-50 dark:bg-green-900/20"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-mono font-bold text-lg text-gray-800 dark:text-white">
                      {coupon.code}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {coupon.discount}% zbritje • Skadon:{" "}
                      {new Date(coupon.expiresAt).toLocaleDateString("sq-AL")}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {coupon.discount}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kuponat e Përdorur */}
      {usedCoupons.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <Ticket size={24} className="text-gray-400" />
            Kuponat e Përdorur
          </h3>
          <div className="space-y-2">
            {usedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50 opacity-60"
              >
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {coupon.code}
                  </div>
                  <div className="text-sm text-gray-500">✓ E përdorur</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kuponat e Skaduar */}
      {expiredCoupons.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <Ticket size={24} className="text-red-400" />
            Kuponat e Skaduar
          </h3>
          <div className="space-y-2">
            {expiredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="border border-red-200 dark:border-red-900 rounded-lg p-3 bg-red-50 dark:bg-red-900/20 opacity-60"
              >
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {coupon.code}
                  </div>
                  <div className="text-sm text-red-500">⏰ E skaduar</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
