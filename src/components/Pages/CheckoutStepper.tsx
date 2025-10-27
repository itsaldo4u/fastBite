import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useRewards } from "../context/RewardsContext";
import toast from "react-hot-toast";

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
  const { addPoints, applyCoupon, markCouponAsUsed } = useRewards();

  const [step, setStep] = useState(1);
  const [orderTrackingId, setOrderTrackingId] = useState<string | null>(null); // për
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [receiptItems, setReceiptItems] = useState<CartItem[]>([]);
  const [finalTotalPrice, setFinalTotalPrice] = useState<number>(0);
  const [savedDiscountAmount, setSavedDiscountAmount] = useState<number>(0);

  // State për kuponin
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const API_URL = import.meta.env.VITE_API_URL;

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

  // Llogarit çmimin me zbritje
  const discountAmount = (totalPrice * couponDiscount) / 100;
  const finalPrice = totalPrice - discountAmount;

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
        newErrors.name = "Emri dhe mbiemri janë të detyrueshëm";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email))
        newErrors.email = "Shkruani një email të vlefshëm";
      if (
        !formData.phone.trim() ||
        !/^\+?\d{7,15}$/.test(formData.phone.replace(/\s+/g, ""))
      )
        newErrors.phone = "Shkruani një numër telefoni të saktë";
      if (!formData.address.trim())
        newErrors.address = "Adresa nuk mund të jetë bosh";
    }

    if (step === 2) {
      if (formData.paymentMethod === "card") {
        const cardNumberClean = formData.cardNumber.replace(/\s+/g, "");
        if (!/^\d{16}$/.test(cardNumberClean))
          newErrors.cardNumber = "Numri i kartës duhet të ketë 16 shifra";

        if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate))
          newErrors.expiryDate = "Data e skadimit e pavlefshme";
        else {
          const [monthStr, yearStr] = formData.expiryDate.split("/");
          const month = parseInt(monthStr, 10);
          const year = parseInt(yearStr, 10);
          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;
          if (month < 1 || month > 12)
            newErrors.expiryDate =
              "Muaji në datën e skadimit nuk është i saktë";
          else if (
            year < currentYear ||
            (year === currentYear && month < currentMonth)
          )
            newErrors.expiryDate = "Data e skadimit nuk mund të jetë e kaluar";
        }

        if (!/^\d{3,4}$/.test(formData.cvv))
          newErrors.cvv = "CVV duhet të ketë 3 ose 4 shifra";
      }
    }

    setErrors(newErrors);

    // **Shto toast për error**
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0] as keyof FormData;
      toast.error(newErrors[firstErrorKey] || "Ka ndodhur një gabim");
    }

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Ju lutem shkruani kodin e kuponit.");
      return;
    }

    const result = await applyCoupon(couponCode);

    if (result.valid) {
      setCouponDiscount(result.discount);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Kupon i pavlefshëm ose i skaduar.");
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    // Ruaj snapshot-in e vlerave para se të zbrazet karroca
    setReceiptItems([...cartItems]);
    setSavedDiscountAmount(discountAmount);
    setFinalTotalPrice(finalPrice);

    try {
      setIsSubmitting(true);

      // Merr ose krijo user nëse nuk ekziston
      const userId = currentUser?._id || null;

      // Krijo objektin e porosisë
      const orderData = {
        userId,
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
        totalPrice: finalPrice,
        originalPrice: totalPrice,
        couponUsed: couponApplied ? couponCode : null,
        discount: couponDiscount,
        createdAt: new Date().toISOString(),
        status: "pending",
        prepTime: 30,
      };

      // POST te backend
      const response = await axios.post(`${API_URL}/orders`, orderData);

      // Ruaj ID për user dhe ID për backend veçmas
      setOrderTrackingId(response.data.order?.trackingId || null); // ID lexueshme për user

      // Shto pikët për rewards
      if (userId) {
        const pointsEarned = Math.floor(finalPrice);
        await addPoints(pointsEarned);
      }

      // Shëno kuponin si të përdorur
      if (couponApplied && couponCode) {
        await markCouponAsUsed(couponCode);
      }

      clearCart();
      setStep(3); // Shfaq Step 3 (Përmbledhja)
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-2xl p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        {stepsArr.map(({ id, label, icon }) => {
          const isActive = id === step;
          const isCompleted = id < step;

          return (
            <div
              key={id}
              className="flex items-center space-x-3 w-full sm:w-auto"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-white border-white text-blue-700"
                    : "bg-transparent border-white text-white opacity-60"
                } transition-all duration-300`}
              >
                <span className="text-lg">{icon}</span>
              </div>
              <span className="font-semibold text-sm break-words text-center">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
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

              {/* Seksioni i Kuponit */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
                  🎟️ Ke një kupon?
                </h4>

                {!couponApplied ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="Shkruaj kodin e kuponit"
                      className="flex-1 p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all"
                    >
                      Apliko
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        ✓ Kupon i aplikuar: {couponCode}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Zbritje: {couponDiscount}% (-$
                        {discountAmount.toFixed(2)})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Hiq
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="mt-2 text-red-600 text-sm">{couponError}</p>
                )}
              </div>

              {/* Përmbledhja e çmimit */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotali:
                  </span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between mb-2 text-green-600 dark:text-green-400">
                    <span>Zbritje ({couponDiscount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                  <span className="text-lg font-bold">Totali:</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    ${finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
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
                {orderTrackingId && (
                  <p className="text-gray-600 dark:text-gray-300">
                    ID e porosisë suaj:{" "}
                    <span className="font-mono font-bold">
                      {orderTrackingId}
                    </span>
                  </p>
                )}

                {currentUser && (
                  <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg inline-block">
                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                      ⭐ Ke fituar {Math.floor(finalTotalPrice)} pikë!
                    </p>
                  </div>
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
                    <span className="font-medium break-words max-w-[150px] sm:max-w-full">
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
                  {savedDiscountAmount > 0 && (
                    <div className="flex justify-between items-center mb-2 text-green-600 dark:text-green-400">
                      <span>Zbritje ({couponDiscount}%):</span>
                      <span>-${savedDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
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
