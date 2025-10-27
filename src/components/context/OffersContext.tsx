import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Lloji kryesor për ofertat
export type Offer = {
  _id: string;
  id?: string; // opsional, në rast se backend e dërgon ndryshe
  title: string;
  description?: string;
  oldPrice: number;
  newPrice: number;
  image: string;
  discount?: string;
  icon?: string;
  gradient?: string;
};

// Tipet për context
type OffersContextType = {
  offers: Offer[];
  fetchOffers: () => Promise<void>;
  addOffer: (data: Omit<Offer, "_id" | "id">) => Promise<void>;
  updateOffer: (id: string, data: Omit<Offer, "_id" | "id">) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
};

// Krijo context
const OffersContext = createContext<OffersContextType | undefined>(undefined);

export const OffersProvider = ({ children }: { children: React.ReactNode }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const baseURL = `${process.env.REACT_APP_API_URL}/offers`;

  // Merr të gjitha ofertat nga backend
  const fetchOffers = async () => {
    try {
      const res = await axios.get(baseURL);
      setOffers(res.data);
    } catch (error) {
      console.error("❌ Gabim në marrjen e ofertave:", error);
    }
  };

  // Shto ofertë të re
  const addOffer = async (data: Omit<Offer, "_id" | "id">) => {
    try {
      await axios.post(baseURL, data);
      await fetchOffers();
    } catch (error) {
      console.error("❌ Gabim në shtimin e ofertës:", error);
      throw error;
    }
  };

  // Përditëso ofertë ekzistuese
  const updateOffer = async (id: string, data: Omit<Offer, "_id" | "id">) => {
    try {
      await axios.put(`${baseURL}/${id}`, data);
      await fetchOffers();
    } catch (error) {
      console.error("❌ Gabim në përditësimin e ofertës:", error);
      throw error;
    }
  };

  // Fshi ofertë
  const deleteOffer = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      setOffers((prev) => prev.filter((offer) => offer._id !== id));
    } catch (error) {
      console.error("❌ Gabim gjatë fshirjes së ofertës:", error);
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

// Hook për përdorim të thjeshtë në komponente
export const useOffers = () => {
  const ctx = useContext(OffersContext);
  if (!ctx) {
    throw new Error("useOffers duhet të përdoret brenda OffersProvider");
  }
  return ctx;
};
