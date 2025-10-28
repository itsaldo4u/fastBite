import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";
import type { User as UserType } from "../../context/AuthContext";

export default function UserProfile() {
  const { currentUser, setCurrentUser } = useAuth() as any;
  const { updateUser } = useUsers();

  const [formData, setFormData] = useState<Omit<UserType, "role" | "id">>({
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
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
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
      await updateUser(currentUser.id, formData);
      const updatedUser = { ...currentUser, ...formData };
      setCurrentUser(updatedUser);
      localStorage.setItem("fastfood_user", JSON.stringify(updatedUser));
      setMessage("Të dhënat u ruajtën me sukses!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Gabim gjatë ruajtjes së të dhënave.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 bg-[length:400%_400%] animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />

        {/* Hidden on mobile */}
        <div className="hidden sm:block absolute top-1/5 left-1/10 text-4xl opacity-10 animate-float">
          🍔
        </div>
        <div className="hidden sm:block absolute top-3/5 right-1/6 text-4xl opacity-10 animate-float-delayed">
          🍟
        </div>
        <div className="hidden sm:block absolute bottom-1/4 left-1/5 text-4xl opacity-10 animate-float-extra">
          🥤
        </div>

        <div className="relative bg-white/95 backdrop-blur-lg p-5 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-3xl z-10 text-center">
          <div className="text-5xl sm:text-6xl mb-4">👤</div>
          <p className="text-lg sm:text-xl text-red-500 dark:text-red-400 font-semibold">
            Ju lutem hyni për të parë profilin tuaj.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 bg-[length:400%_400%] animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />

      {/* Floating decorative elements (hidden on mobile) */}
      <div className="hidden sm:block absolute top-1/5 left-1/10 text-4xl opacity-10 animate-float">
        🍔
      </div>
      <div className="hidden sm:block absolute top-3/5 right-1/6 text-4xl opacity-10 animate-float-delayed">
        🍟
      </div>
      <div className="hidden sm:block absolute bottom-1/4 left-1/5 text-4xl opacity-10 animate-float-extra">
        🥤
      </div>

      {/* User Profile card */}
      <div className="relative bg-white/95 backdrop-blur-lg p-5 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-3xl z-10">
        <div className="text-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 relative">
            Profili Im
            <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-14 sm:w-16 h-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full" />
          </h2>
        </div>

        <form className="space-y-2 sm:space-y-3">
          <EnhancedInputField
            label="Emri"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Shkruani emrin tuaj..."
            icon={<User size={18} />}
          />

          <EnhancedInputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="email@example.com"
            icon={<Mail size={18} />}
          />

          <EnhancedInputField
            label="Telefon"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+355 XX XXX XXXX"
            icon={<Phone size={18} />}
          />

          <EnhancedInputField
            label="Adresa"
            type="text"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Rruga, qyteti..."
            icon={<MapPin size={18} />}
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full text-sm sm:text-base bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-all duration-300 relative overflow-hidden hover:bg-[position:100%_0] hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 active:shadow-md before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]"
          >
            {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
              message.includes("Gabim")
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {message.includes("Gabim") ? (
                <span className="text-red-600 text-lg">✕</span>
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              <p className="font-medium text-sm sm:text-base">{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type EnhancedInputFieldProps = {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
};

function EnhancedInputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
}: EnhancedInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <label
        className={`block text-xs sm:text-sm font-semibold mb-1 transition-colors duration-300 ${
          isFocused ? "text-orange-500" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <div
        className={`flex items-center border-2 rounded-lg px-3 py-2 sm:py-2.5 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 relative overflow-hidden ${
          isFocused
            ? "border-orange-500 shadow-lg shadow-orange-500/10"
            : "border-gray-200 hover:border-gray-300"
        } before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-orange-500/10 before:to-transparent before:transition-all before:duration-500 ${
          isFocused ? "before:left-[100%]" : ""
        }`}
      >
        <span
          className={`mr-2 transition-all duration-300 ${
            isFocused ? "text-orange-500 scale-110" : "text-gray-400"
          }`}
        >
          {icon}
        </span>
        <input
          type={type}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400 text-xs sm:text-sm relative z-10 transition-all duration-300 focus:placeholder-opacity-70"
        />
      </div>
    </div>
  );
}
