import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export type Status = "pending" | "preparing" | "delivering" | "delivered";

export type Order = {
  _id: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  items: {
    id: string | number;
    title: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  createdAt: string;
  status: Status;
  startTime?: string | null;
  preparingDuration?: number;
  trackingId?: string;
};

type OrderData = Omit<
  Order,
  | "id"
  | "createdAt"
  | "status"
  | "startTime"
  | "preparingDuration"
  | "cardNumber"
  | "expiryDate"
  | "cvv"
> & {
  paymentToken?: string;
};

type OrdersContextType = {
  orders: Order[];
  pendingOrders: Order[];
  fetchOrders: () => Promise<void>;
  fetchPendingOrders: () => Promise<void>;
  createOrder: (orderData: OrderData) => Promise<void>;
  updateOrderStatus: (id: string, status: Status) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOrders();
    fetchPendingOrders();
  }, []);

  /* ---------------- GET të gjitha porositë ---------------- */
  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>(`${baseURL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e porosive:", error);
    }
  };

  /* ---------------- GET vetëm porositë në pritje ---------------- */
  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get<Order[]>(`${baseURL}/orders`);
      const pending = res.data.filter((o) => o.status === "pending");
      setPendingOrders(pending);
    } catch (error) {
      console.error("Gabim në marrjen e porosive në pritje:", error);
    }
  };

  /* ---------------- POST krijo porosi të re ---------------- */
  const createOrder = async (orderData: OrderData) => {
    try {
      await axios.post(`${baseURL}/orders`, orderData);
      await fetchOrders();
      await fetchPendingOrders();
    } catch (error) {
      console.error("Gabim gjatë krijimit të porosisë:", error);
      throw error;
    }
  };

  /* ---------------- PATCH përditëso statusin ---------------- */
  const updateOrderStatus = async (id: string, status: Status) => {
    try {
      await axios.patch(`${baseURL}/orders/${id}/status`, { status });
      await fetchOrders();
      await fetchPendingOrders();
    } catch (error) {
      console.error("Gabim në përditësimin e statusit të porosisë:", error);
      throw error;
    }
  };

  /* ---------------- DELETE fshi porosi ---------------- */
  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/orders/${id}`);
      await fetchOrders();
      await fetchPendingOrders();
    } catch (error) {
      console.error("Gabim gjatë fshirjes së porosisë:", error);
      throw error;
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        pendingOrders,
        fetchOrders,
        fetchPendingOrders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
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
