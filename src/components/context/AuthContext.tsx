import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// --- TYPES ---
export type Role = "user" | "admin";

export type Coupon = {
  id: string;
  code: string;
  discount: number;
  expiresAt: string;
  used: boolean;
};

export type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  points?: number;
  coupons?: Coupon[];
  lastSpinDate?: string | null;
};

type FullUser = User & { password: string };

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  signup: (userData: FullUser) => Promise<void>;
  login: (email: string, password: string) => Promise<Role | false>;
  logout: () => void;
  updateRole: (id: string, newRole: Role) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Lexo user nga localStorage
  useEffect(() => {
    const stored = localStorage.getItem("fastfood_user");
    if (stored && stored !== "undefined") {
      const user = JSON.parse(stored) as User;
      setCurrentUser({ ...user, id: user._id });
    }
  }, []);

  // --- SIGNUP ---
  const signup = async (userData: FullUser) => {
    try {
      const res = await axios.post(`${baseURL}/auth/signup`, userData);
      const newUser = res.data.user as User;
      localStorage.setItem("fastfood_user", JSON.stringify(newUser));
      setCurrentUser(newUser);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const message =
          error.response.status === 409 || error.response.status === 400
            ? "Ky email ekziston. Zgjidhni një tjetër."
            : "Gabim i serverit gjatë regjistrimit.";
        throw new Error(message);
      }
      throw new Error("Gabim i panjohur gjatë regjistrimit.");
    }
  };

  // --- LOGIN ---
  const login = async (
    email: string,
    password: string
  ): Promise<Role | false> => {
    try {
      const res = await axios.post(`${baseURL}/auth/login`, {
        email,
        password,
      });
      const user = res.data.user as User;
      if (user) {
        localStorage.setItem("fastfood_user", JSON.stringify(user));
        setCurrentUser(user);
        return user.role;
      }
      return false;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const message =
          error.response.status === 401 || error.response.status === 404
            ? "Email ose fjalëkalim i pasaktë."
            : "Gabim i serverit gjatë hyrjes.";
        throw new Error(message);
      }
      throw new Error("Gabim i panjohur gjatë hyrjes.");
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem("fastfood_user");
    setCurrentUser(null);
  };

  // --- UPDATE ROLE ---
  const updateRole = (id: string, newRole: Role) => {
    if (currentUser?.id === id) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      localStorage.setItem("fastfood_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, signup, login, logout, updateRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth duhet të përdoret brenda AuthProvider");
  return ctx;
};
