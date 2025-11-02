import { useState } from "react";
import { X, Gift } from "lucide-react";
import { useRewards } from "./context/RewardsContext";

type Prize = {
  id: number;
  label: string;
  discount: number;
  color: string;
  chance: number;
};

const prizes: Prize[] = [
  { id: 1, label: "5%", discount: 5, color: "#FF6B6B", chance: 20 },
  { id: 2, label: "❌", discount: 0, color: "#95A5A6", chance: 10 },
  { id: 3, label: "10%", discount: 10, color: "#4ECDC4", chance: 18 },
  { id: 4, label: "15%", discount: 15, color: "#FFD93D", chance: 15 },
  { id: 5, label: "20%", discount: 20, color: "#95E1D3", chance: 12 },
  { id: 6, label: "❌", discount: 0, color: "#7F8C8D", chance: 10 },
  { id: 7, label: "25%", discount: 25, color: "#F38181", chance: 8 },
  { id: 8, label: "30%", discount: 30, color: "#AA96DA", chance: 5 },
  { id: 9, label: "50%", discount: 50, color: "#FCBAD3", chance: 2 },
];

export default function WheelSpinner({ onClose }: { onClose: () => void }) {
  const { lastSpinDate, canSpinToday, spinWheel } = useRewards();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const canSpin = canSpinToday();

  // Zgjedh çmimin bazuar në probabilitet
  const selectPrize = (): Prize => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (const prize of prizes) {
      cumulative += prize.chance;
      if (random <= cumulative) return prize;
    }
    return prizes[prizes.length - 1];
  };

  const handleSpin = async () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    const prize = selectPrize();

    const prizeIndex = prizes.findIndex((p) => p.id === prize.id);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = prizeIndex * segmentAngle;

    const finalRotation = 360 * 5 + (360 - targetAngle); // 5 rrotullime
    setRotation(finalRotation);

    setTimeout(async () => {
      setSelectedPrize(prize);
      setSpinning(false);

      // Ruaj spin-in pavarësisht nëse fiton apo humb
      await spinWheel(prize.discount);

      if (prize.discount > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 4000);
  };

  // Kohë për spin-in e ardhshëm
  const getNextSpinTime = () => {
    if (!lastSpinDate) return "Spin tani!";
    const last = new Date(lastSpinDate);
    const tomorrow = new Date(last);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const now = new Date();
    const diff = tomorrow.getTime() - now.getTime();
    if (diff <= 0) return "Spin tani!";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-red-900/80 rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative overflow-hidden backdrop-blur-xl border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition z-10"
        >
          <X size={28} />
        </button>

        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  backgroundColor: `hsl(${Math.random() * 360},70%,60%)`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-8 h-8 text-yellow-400" />
            <h2 className="text-4xl font-black text-white">Rrota e Fatit</h2>
            <Gift className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-white/80 text-sm">
            {canSpin
              ? "Rrotulloje dhe fito kupona ekskluzive!"
              : `Mund të luash përsëri pas: ${getNextSpinTime()}`}
          </p>
        </div>

        {/* Wheel */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Arrow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-20">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[35px] border-t-yellow-400 drop-shadow-2xl" />
          </div>

          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-600/30 blur-xl"></div>
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full transition-transform duration-[4000ms] ease-out drop-shadow-2xl"
              style={{
                transform: `rotate(${rotation}deg)`,
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
              }}
            >
              {/* Segments */}
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="#D4A574"
                stroke="#8B6F47"
                strokeWidth="2"
              />
              <circle cx="100" cy="100" r="90" fill="#FFE4B5" />

              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index - 90;
                const nextAngle = (360 / prizes.length) * (index + 1) - 90;
                const startX = 100 + 90 * Math.cos((angle * Math.PI) / 180);
                const startY = 100 + 90 * Math.sin((angle * Math.PI) / 180);
                const endX = 100 + 90 * Math.cos((nextAngle * Math.PI) / 180);
                const endY = 100 + 90 * Math.sin((nextAngle * Math.PI) / 180);
                const textAngle = angle + 360 / prizes.length / 2;
                const textRadius = 58;
                const textX =
                  100 + textRadius * Math.cos((textAngle * Math.PI) / 180);
                const textY =
                  100 + textRadius * Math.sin((textAngle * Math.PI) / 180);

                return (
                  <g key={prize.id}>
                    <path
                      d={`M 100 100 L ${startX} ${startY} A 90 90 0 0 1 ${endX} ${endY} Z`}
                      fill={prize.color}
                      stroke="#fff"
                      strokeWidth="3"
                      opacity="0.95"
                    />
                    <rect
                      x={textX - 20}
                      y={textY - 10}
                      width="37"
                      height="25"
                      rx="8"
                      fill="rgba(255,255,255,0.25)"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1.5"
                    />
                    {prize.discount > 0 ? (
                      <>
                        <text
                          x={textX}
                          y={textY - 2}
                          fill="#1a1a1a"
                          fontSize="10"
                          fontWeight="900"
                          textAnchor="middle"
                        >
                          {prize.label}
                        </text>
                        <text
                          x={textX}
                          y={textY + 12}
                          fill="#1a1a1a"
                          fontSize="10"
                          fontWeight="700"
                          textAnchor="middle"
                          opacity="0.85"
                        >
                          OFF
                        </text>
                      </>
                    ) : (
                      <text
                        x={textX}
                        y={textY + 4}
                        fill="#2c3e50"
                        fontSize="20"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        ❌
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Center */}
              <circle
                cx="100"
                cy="100"
                r="20"
                fill="#FFD700"
                stroke="#FFA500"
                strokeWidth="3"
              />
              <circle cx="100" cy="100" r="16" fill="#FF6347" />
              <text
                x="100"
                y="104"
                fill="#fff"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                SPIN
              </text>
            </svg>
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center">
          <button
            onClick={handleSpin}
            disabled={!canSpin || spinning}
            className={`px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform ${
              canSpin && !spinning
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-110 hover:shadow-2xl animate-pulse"
                : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            {spinning
              ? "Duke rrotulluar..."
              : canSpin
              ? "🎰 RROTULLOJE!"
              : "🔒 Provoje Nesër"}
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {selectedPrize && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-[90%] text-center shadow-2xl relative">
            <button
              onClick={() => setSelectedPrize(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
            >
              <X size={22} />
            </button>
            {selectedPrize.discount > 0 ? (
              <>
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-3">
                  Urime!
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                  Fitove kupon{" "}
                  <span className="text-3xl font-black text-orange-600">
                    {selectedPrize.discount}%
                  </span>{" "}
                  zbritje!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  🎁 Kuponi është ruajtur automatikisht në seksionin "Rewards &
                  Kupona".
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                  Më fat herën tjetër!
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Provoje përsëri nesër për një shans të ri! ✨
                </p>
              </>
            )}

            <div className="flex justify-center gap-4">
              {selectedPrize.discount > 0 && (
                <button
                  onClick={() => (window.location.href = "/rewards")}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold"
                >
                  Shiko Kuponin
                </button>
              )}
              <button
                onClick={() => setSelectedPrize(null)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
              >
                Mbyll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Animation */}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti 3s ease-out forwards; }
      `}</style>
    </div>
  );
}
