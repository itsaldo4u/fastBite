import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const role = await login(email, password);
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "user") {
        navigate("/dashboard");
      } else {
        setError("Email ose fjalëkalim i pasaktë!");
      }
    } catch (err) {
      setError("Email ose fjalëkalim i pasaktë!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 bg-[length:400%_400%] animate-gradient-shift" />

      {/* Background overlay with radial gradients */}
      <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />

      {/* Floating decorative elements */}
      <div className="absolute top-1/5 left-1/10 text-4xl opacity-10 animate-float">
        🍔
      </div>
      <div className="absolute top-3/5 right-1/6 text-4xl opacity-10 animate-float-delayed">
        🍟
      </div>
      <div className="absolute bottom-1/4 left-1/5 text-4xl opacity-10 animate-float-extra">
        🥤
      </div>

      {/* Login card */}
      <div className="relative bg-white/95 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-3xl z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 relative">
            Mirë se erdhe përsëri
            <div className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full" />
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center mb-6 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <EnhancedInputField
            label="Adresa Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@tuaj.com"
            icon={<Mail size={20} />}
          />

          <EnhancedInputField
            label="Fjalëkalimi"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Vendosni fjalëkalimin"
            icon={<Lock size={20} />}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 
              bg-[length:300%_300%] text-white font-bold py-4 px-6 rounded-lg
              transition-all duration-300 relative overflow-hidden
              ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[position:100%_0] hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 active:shadow-md"
              }
              before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
              before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
              before:transition-all before:duration-500
              hover:before:left-[100%]
            `}
          >
            {isLoading ? "Duke u kyçur..." : "Kyçu"}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-600">
          Nuk ke një llogari?{" "}
          <Link
            to="/signup"
            className="text-red-500 font-semibold relative hover:text-red-600 transition-colors duration-300
                       after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-0.5 
                       after:bg-gradient-to-r after:from-red-500 after:to-orange-500 
                       after:transition-all after:duration-300 hover:after:w-full"
          >
            Krijo llogari
          </Link>
        </p>
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
        className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
          isFocused ? "text-red-500" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <div
        className={`
          flex items-center border-2 rounded-lg px-4 py-3 
          bg-gradient-to-br from-gray-50 to-white
          transition-all duration-300 relative overflow-hidden
          ${
            isFocused
              ? "border-red-500 shadow-lg shadow-red-500/10"
              : "border-gray-200 hover:border-gray-300"
          }
          before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
          before:bg-gradient-to-r before:from-transparent before:via-red-500/10 before:to-transparent
          before:transition-all before:duration-500
          ${isFocused ? "before:left-[100%]" : ""}
        `}
      >
        <span
          className={`mr-3 transition-all duration-300 ${
            isFocused ? "text-red-500 scale-110" : "text-gray-400"
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
          className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400 
                     relative z-10 transition-all duration-300
                     focus:placeholder-opacity-70"
        />
      </div>
    </div>
  );
}
