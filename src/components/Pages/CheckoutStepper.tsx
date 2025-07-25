import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type CheckoutStepperProps = {
  cartItems: CartItem[];
  onClose: () => void;
  clearCart: () => void;
};

export default function CheckoutStepper({
  cartItems,
  onClose,
  clearCart,
}: CheckoutStepperProps) {
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((f) => ({
        ...f,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address,
      }));
    }
  }, [currentUser]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (step === 3) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 1) return;
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      userId: currentUser?.id || null,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      cardNumber:
        formData.paymentMethod === "card" ? formData.cardNumber : null,
      expiryDate:
        formData.paymentMethod === "card" ? formData.expiryDate : null,
      cvv: formData.paymentMethod === "card" ? formData.cvv : null,
      items: cartItems,
      totalPrice,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    try {
      await axios.post("http://localhost:3000/orders", orderData);
      alert("Porosia u krye me sukses! Faleminderit!");
      clearCart();
      onClose();
    } catch (error) {
      console.error("Gabim gjatë dërgimit të porosisë:", error);
      alert("Ndodhi një gabim gjatë kryerjes së porosisë.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-100 via-yellow-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative text-gray-900 dark:text-yellow-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-yellow-400 hover:text-red-600 dark:hover:text-red-500 transition text-2xl font-bold"
          aria-label="Mbyll"
        >
          ✕
        </button>

        <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 dark:text-yellow-400">
          Checkout - Hapi {step} / 3
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-yellow-300">
                  Emri dhe Mbiemri
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-yellow-300 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled={!!currentUser}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-yellow-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-yellow-300 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled={!!currentUser}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-yellow-300">
                  Numri i Telefonit
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-yellow-300 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled={!!currentUser}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-yellow-300">
                  Adresa
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-yellow-300 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled={!!currentUser}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-yellow-300">
                  Metoda e Pagesës
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-2 border border-yellow-300 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="card">Kartë Krediti/Debiti</option>
                  <option value="cash">Para në dorë</option>
                </select>
              </div>

              {formData.paymentMethod === "card" && (
                <>
                  <div>
                    <label className="block mb-1 font-semibold text-gray-700 dark:text-yellow-300">
                      Numri i Kartës
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-2 border border-yellow-300 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block mb-1 font-semibold text-gray-700 dark:text-yellow-300">
                        Data Skadimit
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        required
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="w-full p-2 border border-yellow-300 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block mb-1 font-semibold text-gray-700 dark:text-yellow-300">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        required
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className="w-full p-2 border border-yellow-300 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-xl font-semibold mb-4 text-yellow-600 dark:text-yellow-300">
                Fatura
              </h3>

              <ul className="mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between mb-2 border-b border-yellow-200 dark:border-yellow-700 pb-1"
                  >
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <p className="font-bold text-yellow-700 dark:text-yellow-400 text-right text-lg">
                Totali: ${totalPrice.toFixed(2)}
              </p>
            </>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-yellow-200 dark:bg-yellow-700 rounded hover:bg-yellow-300 dark:hover:bg-yellow-600 transition font-semibold"
              >
                Mbrapa
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-semibold"
              >
                Vazhdo
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
              >
                Përfundo
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
