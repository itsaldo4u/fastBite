import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UsersContext";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  crust?: string;
  toppings?: string[];
};

export type CheckoutStepperProps = {
  cartItems: CartItem[];
  onClose: () => void;
  clearCart: () => void;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: "card" | "cash";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export default function CheckoutStepper({
  cartItems,
  onClose,
  clearCart,
}: CheckoutStepperProps) {
  const { currentUser } = useAuth();
  const { fetchUsers } = useUsers();

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [receiptItems, setReceiptItems] = useState<CartItem[]>([]);
  const [finalTotalPrice, setFinalTotalPrice] = useState<number>(0);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (currentUser) {
      setFormData((f) => ({
        ...f,
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
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
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep = (): boolean => {
    const newErrors: Errors = {};

    if (step === 1) {
      if (!formData.name.trim())
        newErrors.name = "Ju lutem shkruani emrin dhe mbiemrin.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email))
        newErrors.email = "Email i pavlefshëm.";
      if (
        !formData.phone.trim() ||
        !/^\+?\d{7,15}$/.test(formData.phone.replace(/\s+/g, ""))
      )
        newErrors.phone = "Numër telefoni i pavlefshëm.";
      if (!formData.address.trim())
        newErrors.address = "Ju lutem shkruani adresën.";
    }

    if (step === 2) {
      if (formData.paymentMethod === "card") {
        const cardNumberClean = formData.cardNumber.replace(/\s+/g, "");
        if (!/^\d{16}$/.test(cardNumberClean))
          newErrors.cardNumber = "Numri i kartës duhet të ketë 16 shifra.";

        if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
          newErrors.expiryDate =
            "Data e skadimit duhet të jetë në formatin MM/YY.";
        } else {
          const [monthStr, yearStr] = formData.expiryDate.split("/");
          const month = parseInt(monthStr, 10);
          const year = parseInt(yearStr, 10);
          if (month < 1 || month > 12)
            newErrors.expiryDate =
              "Muaji në datën e skadimit nuk është i saktë.";
          else {
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            if (
              year < currentYear ||
              (year === currentYear && month < currentMonth)
            )
              newErrors.expiryDate =
                "Data e skadimit nuk mund të jetë e kaluar.";
          }
        }

        if (!/^\d{3,4}$/.test(formData.cvv))
          newErrors.cvv = "CVV duhet të ketë 3 ose 4 shifra.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 3) return;
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 1) return;
    setStep((s) => s - 1);
  };

  // Function to register new user if they don't exist
  const registerNewUserIfNeeded = async (): Promise<number | null> => {
    if (currentUser) {
      return currentUser.id || null;
    }

    try {
      // Check if user exists by email
      const existingUserResponse = await axios.get(
        `http://localhost:3000/users?email=${formData.email}`
      );

      if (existingUserResponse.data.length > 0) {
        // User exists, return their ID
        return existingUserResponse.data[0].id;
      }

      // User doesn't exist, create new user
      const newUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: "user" as const,
        password: "temp123", // Temporary password, they can change it later
      };

      const response = await axios.post("http://localhost:3000/users", newUser);

      // Refresh users list in context
      await fetchUsers();

      return response.data.id;
    } catch (error) {
      console.error("Gabim gjatë regjistrimit të përdoruesit të ri:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    // Store a snapshot of cart items and total price *before* submitting and clearing
    setReceiptItems([...cartItems]);
    setFinalTotalPrice(totalPrice);

    try {
      setIsSubmitting(true);

      // Register new user if needed
      const userId = await registerNewUserIfNeeded();

      const orderData = {
        userId: userId,
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

      const response = await axios.post(
        "http://localhost:3000/orders",
        orderData
      );

      setOrderId(response.data.id?.toString() || null);
      clearCart();
      setStep(3);
    } catch (error) {
      console.error("Gabim gjatë dërgimit të porosisë:", error);
      alert("Ndodhi një gabim gjatë kryerjes së porosisë.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  const renderStepper = () => {
    const stepsArr = [
      { id: 1, label: "Informacioni Personal", icon: "👤" },
      { id: 2, label: "Pagesa", icon: "💳" },
      { id: 3, label: "Përmbledhje", icon: "🧾" },
    ];

    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-2xl p-6 flex items-center justify-between">
        {stepsArr.map(({ id, label, icon }) => {
          const isActive = id === step;
          const isCompleted = id < step;

          return (
            <div key={id} className="flex items-center space-x-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-white border-white text-blue-700"
                    : "bg-transparent border-white text-white opacity-60"
                }
                transition-all duration-300`}
              >
                <span className="text-lg">{icon}</span>
              </div>
              <span
                className={`font-semibold text-sm ${
                  isActive || isCompleted
                    ? "text-white"
                    : "text-white opacity-60"
                }`}
              >
                {label}
              </span>
              {id !== stepsArr.length && (
                <div
                  className={`flex-1 border-t-2 mx-2 ${
                    isCompleted ? "border-green-500" : "border-white opacity-40"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-yellow-400 hover:text-red-600 dark:hover:text-red-500 transition text-3xl font-bold z-10"
          aria-label="Mbyll"
        >
          ✕
        </button>

        <h2 className="text-3xl font-extrabold mb-0 p-6 text-white bg-gradient-to-r from-blue-600 to-purple-700 rounded-t-2xl">
          Checkout
        </h2>

        {renderStepper()}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 text-gray-900 dark:text-yellow-400"
          noValidate
        >
          {step === 1 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-semibold">
                  Emri dhe Mbiemri
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={!!currentUser}
                  placeholder="Shkruani emrin tuaj"
                />
                {errors.name && (
                  <p className="text-red-600 mt-1 text-sm font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={!!currentUser}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 mt-1 text-sm font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-semibold">
                  Numri i Telefonit
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={!!currentUser}
                  placeholder="+355 XX XXX XXX"
                />
                {errors.phone && (
                  <p className="text-red-600 mt-1 text-sm font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-semibold">Adresa</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                    errors.address
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={!!currentUser}
                  placeholder="Shkruani adresën tuaj"
                />
                {errors.address && (
                  <p className="text-red-600 mt-1 text-sm font-medium">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block mb-1 font-semibold">
                  Metoda e Pagesës
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="card">Kartë Krediti/Debiti</option>
                  <option value="cash">Para në dorë</option>
                </select>
              </div>

              {formData.paymentMethod === "card" && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">
                      Numri i Kartës
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                        errors.cardNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-600 mt-1 text-sm font-medium">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">
                      Data Skadimit
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                        errors.expiryDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-600 mt-1 text-sm font-medium">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                        errors.cvv
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <p className="text-red-600 mt-1 text-sm font-medium">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Porosia u krye me sukses!
                </h3>
                {orderId && (
                  <p className="text-gray-600 dark:text-gray-300">
                    ID e porosisë suaj:{" "}
                    <span className="font-mono font-bold">{orderId}</span>
                  </p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-400">
                  Detajet e Porosisë
                </h4>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Emri:
                    </span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Email:
                    </span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Telefoni:
                    </span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Adresa:
                    </span>
                    <span className="font-medium">{formData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Pagesa:
                    </span>
                    <span className="font-medium">
                      {formData.paymentMethod === "card"
                        ? "Kartë Krediti/Debiti"
                        : "Para në dorë"}
                    </span>
                  </div>
                </div>

                <hr className="border-gray-300 dark:border-gray-600 my-4" />

                <h5 className="font-semibold mb-3">Produktet e porositura:</h5>
                <ul className="space-y-2 mb-4">
                  {receiptItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div>
                        <span className="font-medium">{item.title}</span>
                        <span className="text-gray-500 ml-2">
                          x {item.quantity}
                        </span>
                      </div>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
                      Totali:
                    </span>
                    <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
                      ${finalTotalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>Ju mund ta gjurmoni porosinë tuaj në faqen e porosive.</p>
                <p>Faleminderit për blerjen!</p>
              </div>
            </>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && step < 3 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition font-semibold"
                disabled={isSubmitting}
              >
                Mbrapa
              </button>
            )}

            {step < 3 ? (
              <button
                type={step === 2 ? "submit" : "button"}
                onClick={step === 2 ? undefined : handleNext}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded shadow hover:from-blue-700 hover:to-purple-800 transition font-semibold ml-auto"
                disabled={isSubmitting}
              >
                {step === 2
                  ? isSubmitting
                    ? "Duke procesuar..."
                    : "Përfundo Porosinë"
                  : "Vazhdo"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded shadow hover:from-green-700 hover:to-green-800 transition font-semibold mx-auto"
              >
                Mbyll
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
