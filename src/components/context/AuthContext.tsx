import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export type Role = "user" | "admin";
export type Coupon = {
  id: string;
  code: string;
  discount: number;
  expiresAt: string;
  used: boolean;
};

export type User = {
  id?: number;
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
  setCurrentUser: (user: User | null) => void; // SHTO KËTË RRESHT
  signup: (userData: FullUser) => Promise<void>;
  login: (email: string, password: string) => Promise<Role | false>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const baseURL = "http://localhost:3000";

  useEffect(() => {
    const stored = localStorage.getItem("fastfood_user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const signup = async (userData: FullUser) => {
    try {
      const res = await axios.get(`${baseURL}/users?email=${userData.email}`);
      if (res.data.length > 0) {
        alert("Ky email ekziston.");
        return;
      }
      await axios.post(`${baseURL}/users`, userData);
      localStorage.setItem("fastfood_user", JSON.stringify(userData));
      setCurrentUser(userData);
    } catch (error) {
      console.error("Gabim gjatë regjistrimit:", error);
      throw error;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<Role | false> => {
    try {
      const res = await axios.get(
        `${baseURL}/users?email=${email}&password=${password}`
      );
      const user = res.data[0];
      if (user) {
        localStorage.setItem("fastfood_user", JSON.stringify(user));
        setCurrentUser(user);
        return user.role;
      }
      return false;
    } catch (error) {
      console.error("Gabim gjatë hyrjes:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("fastfood_user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, signup, login, logout }} // SHTO setCurrentUser KËTU
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
