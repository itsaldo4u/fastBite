import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
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
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Butoni burger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 md:hidden"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Linket qendrore - shfaqen vetëm në desktop */}
          <div className="hidden md:flex space-x-8 justify-center flex-1">
            <Link to="/" className="group relative text-1xl font-bold">
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Home
              </span>
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link to="/menu" className="group relative text-1xl font-extrabold">
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Menu
              </span>
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/contact"
              className="group relative text-1xl font-extrabold"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Contact
              </span>
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Djathtas - vetëm desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="hover:text-yellow-400 flex items-center"
                >
                  <UserCircle size={20} className="mr-1" />
                  Login
                </Link>
                <Link to="/signup" className="hover:text-yellow-400">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {currentUser.role === "admin" ? (
                  <Link to="/admin" className="text-sm hover:text-yellow-400">
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-sm hover:text-yellow-400"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:underline ml-2"
                >
                  Dil
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile - Home, Menu, Contact + Login/Signup */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 py-3 px-4 space-y-2">
          <NavLink
            to="/"
            className="block text-white hover:text-yellow-400"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className="block text-white hover:text-yellow-400"
            onClick={() => setMenuOpen(false)}
          >
            Menu
          </NavLink>
          <NavLink
            to="/contact"
            className="block text-white hover:text-yellow-400"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>

          <hr className="border-slate-600" />

          {!currentUser ? (
            <>
              <NavLink
                to="/login"
                className="block text-white hover:text-yellow-400"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="block text-white hover:text-yellow-400"
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
                  className="block text-white hover:text-yellow-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </NavLink>
              ) : (
                <NavLink
                  to="/dashboard"
                  className="block text-white hover:text-yellow-400"
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
                className="block text-red-400 hover:underline"
              >
                Dil
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
