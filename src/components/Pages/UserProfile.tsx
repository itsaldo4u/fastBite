import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";

import axios from "axios";

export default function UserProfile() {
  const { currentUser, setCurrentUser } = useAuth() as any; // Në kodin tënd nuk ka setCurrentUser, mund ta shtosh në AuthContext ose e tipizosh si any për momentin
  const [formData, setFormData] = useState<Omit<User, "role" | "id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address,
      });
    }
  }, [currentUser]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.patch(
        `http://localhost:3000/users/${currentUser.id}`,
        formData
      );

      // Nëse ke mundësi të shtosh setCurrentUser në context, përditësoje
      if (setCurrentUser) {
        setCurrentUser(res.data);
      } else {
        // Nëse jo, mund ta ruash në localStorage
        localStorage.setItem("fastfood_user", JSON.stringify(res.data));
      }

      setMessage("Të dhënat u ruajtën me sukses!");
    } catch (error) {
      setMessage("Gabim gjatë ruajtjes së të dhënave.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <p className="text-center mt-10 text-red-500">
        Ju lutem hyni për të parë profilin tuaj.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Profili Im
      </h2>

      <label className="block mb-1 text-gray-700 dark:text-gray-300">
        Emri
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <label className="block mb-1 text-gray-700 dark:text-gray-300">
        Email
      </label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <label className="block mb-1 text-gray-700 dark:text-gray-300">
        Telefon
      </label>
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <label className="block mb-1 text-gray-700 dark:text-gray-300">
        Adresa
      </label>
      <input
        type="text"
        value={formData.address}
        onChange={(e) => handleChange("address", e.target.value)}
        className="w-full mb-6 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 transition"
      >
        {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
      </button>

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes("Gabim") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
