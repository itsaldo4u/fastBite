// src/context/OffersContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export type Offer = {
  id: number;
  title: string;
  description?: string;
  oldPrice: number;
  newPrice: number;
  image: string;
  discount?: string;
  icon?: string;
  gradient?: string;
};

type OffersContextType = {
  offers: Offer[];
  fetchOffers: () => Promise<void>;
  addOffer: (data: Omit<Offer, "id">) => Promise<void>;
  updateOffer: (id: number, data: Omit<Offer, "id">) => Promise<void>;
  deleteOffer: (id: number) => Promise<void>;
};

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export const OffersProvider = ({ children }: { children: React.ReactNode }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const baseURL = "http://localhost:3000/offers";

  const fetchOffers = async () => {
    try {
      const res = await axios.get<Offer[]>(baseURL);
      setOffers(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e ofertave:", error);
    }
  };

  const addOffer = async (data: Omit<Offer, "id">) => {
    try {
      await axios.post(baseURL, data);
      await fetchOffers();
    } catch (error) {
      console.error("Gabim në shtimin e ofertës:", error);
      throw error;
    }
  };

  const updateOffer = async (id: number, data: Omit<Offer, "id">) => {
    try {
      await axios.patch(`${baseURL}/${id}`, data);
      await fetchOffers();
    } catch (error) {
      console.error("Gabim në përditësimin e ofertës:", error);
      throw error;
    }
  };

  const deleteOffer = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      setOffers((prev) => prev.filter((offer) => offer.id !== id));
    } catch (error) {
      console.error("Gabim gjatë fshirjes së ofertës:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <OffersContext.Provider
      value={{ offers, fetchOffers, addOffer, updateOffer, deleteOffer }}
    >
      {children}
    </OffersContext.Provider>
  );
};

export const useOffers = () => {
  const ctx = useContext(OffersContext);
  if (!ctx)
    throw new Error("useOffers duhet të përdoret brenda OffersProvider");
  return ctx;
};
