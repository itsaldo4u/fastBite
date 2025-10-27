import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newUser = {
        ...formData,
        role: "user" as const,
      };

      await signup(newUser);
      toast.success("Regjistrimi u krye me sukses!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Diçka shkoi gabim gjatë regjistrimit.");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      label: "Emri",
      name: "name",
      type: "text",
      icon: <User size={18} />,
      placeholder: "Emri juaj",
    },
    {
      label: "Adresa Email",
      name: "email",
      type: "email",
      icon: <Mail size={18} />,
      placeholder: "email@tuaj.com",
    },
    {
      label: "Fjalëkalimi",
      name: "password",
      type: "password",
      icon: <Lock size={18} />,
      placeholder: "Vendosni fjalëkalimin",
    },
    {
      label: "Numri i telefonit",
      name: "phone",
      type: "tel",
      icon: <Phone size={18} />,
      placeholder: "+355 XX XXX XXXX",
    },
    {
      label: "Adresa",
      name: "address",
      type: "text",
      icon: <MapPin size={18} />,
      placeholder: "Rruga, qyteti...",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 bg-[length:400%_400%] animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />

      {/* Floating decorative elements */}
      <div className="absolute top-1/5 left-1/10 text-4xl opacity-10 animate-float">
        🍕
      </div>
      <div className="absolute top-3/5 right-1/6 text-4xl opacity-10 animate-float-delayed">
        🌮
      </div>
      <div className="absolute bottom-1/4 left-1/5 text-4xl opacity-10 animate-float-extra">
        🍦
      </div>
      <div className="absolute top-1/2 right-1/4 text-4xl opacity-10 animate-float">
        🥗
      </div>

      {/* Signup card */}
      <div className="relative bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-3xl z-10">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 relative">
            Krijo llogari
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full" />
          </h2>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          {fields.map((field) => (
            <EnhancedInputField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              placeholder={field.placeholder}
              icon={field.icon}
            />
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600
              bg-[length:300%_300%] text-white font-bold py-2.5 px-6 rounded-lg
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
            {isLoading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Ke llogari?{" "}
          <Link
            to="/login"
            className="text-red-500 font-semibold relative hover:text-red-600 transition-colors duration-300
                       after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-0.5 
                       after:bg-gradient-to-r after:from-yellow-400 after:to-red-500 
                       after:transition-all after:duration-300 hover:after:w-full"
          >
            Kyçu këtu
          </Link>
        </p>
      </div>
    </div>
  );
}

type EnhancedInputFieldProps = {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
};

function EnhancedInputField({
  label,
  name,
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
        className={`block text-xs font-semibold mb-1 transition-colors duration-300 ${
          isFocused ? "text-orange-500" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <div
        className={`
          flex items-center border-2 rounded-lg px-3 py-2
          bg-gradient-to-br from-gray-50 to-white
          transition-all duration-300 relative overflow-hidden
          ${
            isFocused
              ? "border-orange-500 shadow-lg shadow-orange-500/10"
              : "border-gray-200 hover:border-gray-300"
          }
          before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
          before:bg-gradient-to-r before:from-transparent before:via-orange-500/10 before:to-transparent
          before:transition-all before:duration-500
          ${isFocused ? "before:left-[100%]" : ""}
        `}
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
          name={name}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400 text-sm relative z-10 transition-all duration-300 focus:placeholder-opacity-70"
        />
      </div>
    </div>
  );
}
