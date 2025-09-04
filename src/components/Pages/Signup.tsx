import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      ...formData,
      role: "user" as const,
    };

    await signup(newUser);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 to-red-500 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Krijo llogari
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <InputField
            label="Emri"
            name="name"
            type="text"
            icon={<User size={18} />}
            value={formData.name}
            onChange={handleChange}
            placeholder="Emri juaj"
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            icon={<Mail size={18} />}
            value={formData.email}
            onChange={handleChange}
            placeholder="example@fastfood.com"
          />

          <InputField
            label="Fjalëkalimi"
            name="password"
            type="password"
            icon={<Lock size={18} />}
            value={formData.password}
            onChange={handleChange}
            placeholder="******"
          />

          <InputField
            label="Numri i telefonit"
            name="phone"
            type="tel"
            icon={<Phone size={18} />}
            value={formData.phone}
            onChange={handleChange}
            placeholder="+355..."
          />

          <InputField
            label="Adresa"
            name="address"
            type="text"
            icon={<MapPin size={18} />}
            value={formData.address}
            onChange={handleChange}
            placeholder="Rruga, qyteti..."
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Regjistrohu
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Ke llogari?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Kyçu këtu
          </Link>
        </p>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

function InputField({
  label,
  name,
  type,
  icon,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="flex items-center mt-1 border rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700">
        <span className="text-gray-500 mr-2">{icon}</span>
        <input
          type={type}
          name={name}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-gray-800 dark:text-white"
        />
      </div>
    </div>
  );
}
