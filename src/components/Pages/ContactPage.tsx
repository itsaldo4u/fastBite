import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Gabim gjatë dërgimit:", error);
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-24 left-24 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-20 px-6 flex flex-col lg:flex-row gap-12">
        {/* Left - Contact Info */}
        <div className="space-y-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 w-full lg:w-1/2 shadow-2xl">
          <h2 className="text-4xl font-black text-yellow-400">Na Kontakto</h2>
          <p className="text-gray-300">
            Keni pyetje apo dëshironi të bëni një porosi speciale? Na shkruani
            dhe do t’ju përgjigjemi sa më shpejt!
          </p>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-center space-x-3">
              <Phone className="text-yellow-400" />
              <span>+355 69 123 4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-yellow-400" />
              <span>kontakt@fastfood.al</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-yellow-400" />
              <span>Tiranë, Shqipëri</span>
            </div>
          </div>
        </div>

        {/* Right - Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 w-full lg:w-1/2 shadow-2xl space-y-6"
        >
          <h3 className="text-2xl font-bold text-yellow-400">
            Formular Kontakti
          </h3>
          <input
            name="name"
            type="text"
            placeholder="Emri juaj"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <textarea
            name="message"
            rows={5}
            placeholder="Mesazhi juaj..."
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          ></textarea>

          <button
            type="submit"
            className="group bg-gradient-to-r from-yellow-400 to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Dërgo Mesazh</span>
          </button>

          {status === "success" && (
            <p className="text-green-400 font-semibold text-sm">
              ✅ Mesazhi u dërgua me sukses!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-400 font-semibold text-sm">
              ❌ Ndodhi një gabim. Provo përsëri.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
