import { X } from "lucide-react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type ShoppingCartDropdownProps = {
  cartItems: CartItem[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
  onCheckout: () => void;
};

export default function ShoppingCartDropdown({
  cartItems,
  onAdd,
  onRemove,
  onClear,
  onClose,
  onCheckout,
}: ShoppingCartDropdownProps) {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed top-16 right-6 w-80 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-6 rounded-2xl shadow-2xl z-50">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <h3 className="text-lg font-bold text-yellow-400">Karroca</h3>
        <button
          onClick={onClose}
          aria-label="Mbyll karrocën"
          className="text-white hover:text-red-400 transition"
        >
          <X size={22} />
        </button>
      </div>

      {/* Items */}
      <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-300">Karroca është bosh.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white/10 backdrop-blur rounded-xl p-3 shadow-sm"
            >
              <div>
                <p className="font-semibold text-yellow-400">{item.title}</p>
                <p className="text-sm text-gray-300">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onRemove(item.id)}
                  aria-label="Ulin sasinë"
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                >
                  −
                </button>
                <button
                  onClick={() => onAdd(item.id)}
                  aria-label="Rrit sasinë"
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="border-t border-white/10 px-4 py-3 flex justify-between items-center bg-white/5 rounded-b-2xl">
          <p className="font-bold text-white">
            Totali: ${totalPrice.toFixed(2)}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onClear}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition"
            >
              Pastro
            </button>
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-300 hover:to-red-600 text-black font-semibold rounded-full transition-all shadow-lg"
            >
              Bli
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
