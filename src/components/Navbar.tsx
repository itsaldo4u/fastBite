import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useAuth } from "./context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-xl backdrop-blur-sm">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* 🔹 Logo majtas */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-300"
            >
              🍔 FastBite
            </Link>
          </div>

          {/* 🔹 Navigation qendër */}
          <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="group relative px-3 py-2 text-base font-bold transition-all duration-300"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Home
              </span>
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full shadow-lg shadow-yellow-400/50"></span>
            </Link>

            <Link
              to="/menu"
              className="group relative px-3 py-2 text-base font-bold transition-all duration-300"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Menu
              </span>
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full shadow-lg shadow-yellow-400/50"></span>
            </Link>

            <Link
              to="/contact"
              className="group relative px-3 py-2 text-base font-bold transition-all duration-300"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Contact
              </span>
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full shadow-lg shadow-yellow-400/50"></span>
            </Link>
          </div>

          {/* 🔹 Butonat djathtas */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/track-order"
              className="group relative px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm text-white font-semibold rounded-lg hover:from-purple-600/50 hover:to-pink-600/50 transition-all duration-300 flex items-center gap-2 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden text-sm"
            >
              <span>Gjurmo</span>
            </Link>

            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-white font-semibold hover:text-yellow-400 transition-colors duration-300 flex items-center gap-1 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-pink-500 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 hover:scale-105 text-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {currentUser.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 bg-slate-800/50 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 text-sm"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="px-3 py-1.5 bg-slate-800/50 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 text-sm"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-600/80 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  Dil
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden relative bg-gradient-to-br from-slate-800 to-purple-900 backdrop-blur-xl border-t border-white/10 shadow-2xl">
          <div className="px-4 py-3 space-y-1.5">
            <NavLink
              to="/"
              className="block px-3 py-2 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/menu"
              className="block px-3 py-2 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Menu
            </NavLink>
            <NavLink
              to="/contact"
              className="block px-3 py-2 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </NavLink>

            {/* Track Order in mobile */}
            <NavLink
              to="/track-order"
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white font-bold rounded-lg hover:from-purple-600/50 hover:to-pink-600/50 transition-all duration-300 border border-purple-500/30"
              onClick={() => setMenuOpen(false)}
            >
              <Search className="w-4 h-4" />
              Gjurmo Porosinë
            </NavLink>

            <hr className="border-white/20 my-2" />

            {!currentUser ? (
              <>
                <NavLink
                  to="/login"
                  className="block px-3 py-2 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="block px-3 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-slate-900 font-bold rounded-lg hover:shadow-lg transition-all duration-300 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <>
                {currentUser.role === "admin" ? (
                  <NavLink
                    to="/admin"
                    className="block px-3 py-2 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Panel
                  </NavLink>
                ) : (
                  <NavLink
                    to="/dashboard"
                    className="block px-3 py-2 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 bg-red-600/80 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Dil
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
