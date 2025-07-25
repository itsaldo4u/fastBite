// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// --- TIPET ---
export type Status = "pending" | "preparing" | "delivering" | "delivered";

export type Role = "user" | "admin";

export type User = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
};

type FullUser = User & { password: string };

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
  isNew?: boolean;
  isCombo?: boolean;
  rating?: number;
};

export type Order = {
  id: string;
  userId?: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  items: {
    id: number;
    title: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  createdAt: string;
  status: Status;
  startTime?: string | null;
  preparingDuration?: number;
};

type OrderData = Omit<Order, "id">;

export type offer = {
  image: string | undefined;
  id: number;
  title: string;
  discount: string;
  price: string;
  originalPrice: string;
  icon: string;
  gradient: string;
};

type AuthContextType = {
  currentUser: User | null;

  signup: (userData: FullUser) => Promise<void>;
  login: (email: string, password: string) => Promise<Role | false>;
  logout: () => void;

  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (data: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, data: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  users: User[];
  fetchUsers: () => Promise<void>;

  orders: Order[];
  fetchOrders: () => Promise<void>;

  createOrder: (orderData: OrderData) => Promise<void>;

  offers: offer[];
  fetchOffers: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<offer[]>([]);
  const baseURL = "http://localhost:3000";

  useEffect(() => {
    // Ngarkojmë user-in nga localStorage në fillim
    const stored = localStorage.getItem("fastfood_user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    // Ngarkojmë të dhënat nga API
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  // --- FUNKSIONET E AUTORIZIMIT ---

  const signup = async (userData: FullUser) => {
    try {
      // Kontrollo nëse emaili ekziston
      const res = await axios.get(`${baseURL}/users?email=${userData.email}`);
      if (res.data.length > 0) {
        alert("Ky email ekziston.");
        return;
      }

      // Shto user-in
      await axios.post(`${baseURL}/users`, userData);

      // Seto user-in aktual dhe ruaj lokal
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
      } else {
        return false;
      }
    } catch (error) {
      console.error("Gabim gjatë hyrjes:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("fastfood_user");
    setCurrentUser(null);
  };

  // --- FUNKSIONET E PRODUKTEVE ---

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>(`${baseURL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e produkteve:", error);
    }
  };

  const addProduct = async (data: Omit<Product, "id">) => {
    try {
      await axios.post(`${baseURL}/products`, data);
      await fetchProducts();
    } catch (error) {
      console.error("Gabim në shtimin e produktit:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string, data: Omit<Product, "id">) => {
    try {
      await axios.patch(`${baseURL}/products/${id}`, data);
      await fetchProducts();
    } catch (error) {
      console.error("Gabim në përditësimin e produktit:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Gabim në fshirjen e produktit:", error);
    }
  };

  // --- FUNKSIONET E PËRDORUESVE ---

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${baseURL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e përdoruesve:", error);
    }
  };

  // --- FUNKSIONET E POROSIVE ---

  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>(`${baseURL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e porosive:", error);
    }
  };

  const createOrder = async (orderData: OrderData) => {
    try {
      await axios.post(`${baseURL}/orders`, orderData);
      await fetchOrders();
    } catch (error) {
      console.error("Gabim gjatë krijimit të porosisë:", error);
      throw error;
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await axios.get<offer[]>(`${baseURL}/offers`);
      setOffers(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e ofertave:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout,
        products,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        users,
        fetchUsers,
        orders,
        fetchOrders,
        createOrder,
        offers,
        fetchOffers,
      }}
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
