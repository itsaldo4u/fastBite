import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export type Status = "pending" | "preparing" | "delivering" | "delivered";

export type Order = {
  id: string;
  userId?: number | string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  items: { id: number; title: string; price: number; quantity: number }[];
  totalPrice: number;
  createdAt: string;
  status: Status;
  startTime?: string | null;
  preparingDuration?: number;
};

type OrderData = Omit<Order, "id">;

type OrdersContextType = {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: OrderData) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const baseURL = "http://localhost:3000";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get<Order[]>(`${baseURL}/orders`);
    setOrders(res.data);
  };
  const createOrder = async (orderData: OrderData) => {
    await axios.post(`${baseURL}/orders`, orderData);
    await fetchOrders();
  };

  return (
    <OrdersContext.Provider value={{ orders, fetchOrders, createOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx)
    throw new Error("useOrders duhet të përdoret brenda OrdersProvider");
  return ctx;
};
