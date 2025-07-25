interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

type OrderStatus = "pending" | "preparing" | "delivering" | "delivered";

interface Order {
  id: number;
  userId: number;
  createdAt: string;
  status: OrderStatus;
  prepTime: number;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  timeLeft: number;
  currentStep: number;
  showReview?: boolean; // default true
}

const steps = [
  { id: 1, label: "Ne Pritje", icon: "🧑‍🍳", desc: "Po mblidhen përbërësit!" },
  { id: 2, label: "Në Furre", icon: "🔥", desc: "Pica po piqet" },
  { id: 3, label: "Për Shpërndarje", icon: "🛵", desc: "Në rrugë për dorëzim" },
  { id: 4, label: "Dorëzuar", icon: "📬", desc: "Dorëzuar me sukses" },
];


export default function OrderCard({
  order,
  timeLeft,
  currentStep,
  showReview = true,
}: OrderCardProps) {
  const isDelivered = order.status === "delivered";

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Porosia juaj është marrë dhe po përgatitet.";
      case "preparing":
        return "Pica juaj është në përgatitje.";
      case "delivering":
        return "Porosia është nisur për dorëzim.";
      case "delivered":
        return "Porosia është dorëzuar me sukses.";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "from-yellow-400 to-yellow-500";
      case "preparing":
        return "from-orange-400 to-orange-600";
      case "delivering":
        return "from-blue-400 to-blue-600";
      case "delivered":
        return "from-green-400 to-green-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div
        className={`bg-gradient-to-r ${getStatusColor(
          order.status
        )} p-4 text-white`}
        aria-live="polite"
      >
        <h2 className="font-bold text-lg">Porosia #{order.id}</h2>
        <p className="text-sm">{getStatusText(order.status)}</p>
      </div>

      {/* Stepper */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
                aria-current={isActive ? "step" : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 select-none ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-orange-500 text-white animate-pulse"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {isCompleted ? "✓" : step.icon}
                </div>
                <span className="text-xs mt-1">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Koha e mbetur */}
      {(order.status === "pending" || order.status === "preparing") &&
        timeLeft > 0 && (
          <div
            className="px-4 pb-2 text-yellow-700 dark:text-yellow-300 text-sm flex items-center gap-1"
            role="status"
            aria-live="polite"
          >
            <span aria-hidden="true">⏱️</span> Koha e mbetur: {timeLeft} minuta
          </div>
        )}

      {/* Produktet */}
      <div className="px-4 py-2">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
          Produkte:
        </h3>

        {Array.isArray(order.items) &&
          order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-t py-2 text-sm"
            >
              <span>
                {item.title} x{item.quantity}
              </span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
      </div>

      {/* Review info */}
      {showReview && isDelivered && (
        <div className="px-4 py-3 text-center text-gray-500 text-sm italic select-none">
          Mund të shtoni një koment për këtë porosi në profilin tuaj.
        </div>
      )}
    </div>
  );
}
