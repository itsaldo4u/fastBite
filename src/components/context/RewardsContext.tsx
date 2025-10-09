import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import type { User, Coupon } from "./AuthContext";

type RewardsContextType = {
  userPoints: number;
  userCoupons: Coupon[];
  addPoints: (points: number) => Promise<void>;
  generateCoupon: (pointsCost: number, discount: number) => Promise<void>;
  applyCoupon: (
    couponCode: string
  ) => Promise<{ valid: boolean; discount: number }>;
  markCouponAsUsed: (couponCode: string) => Promise<void>;
  canSpinToday: () => boolean;
  spinWheel: (discount: number) => Promise<void>;
};

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [userPoints, setUserPoints] = useState(0);
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);
  const baseURL = "http://localhost:3000";

  useEffect(() => {
    if (currentUser) {
      setUserPoints(currentUser.points || 0);
      setUserCoupons(currentUser.coupons || []);
    }
  }, [currentUser]);

  const addPoints = async (points: number) => {
    if (!currentUser) return;

    const newPoints = userPoints + points;

    try {
      const res = await axios.patch<User>(
        `${baseURL}/users/${currentUser.id}`,
        {
          points: newPoints,
        }
      );

      setUserPoints(newPoints);
      if (setCurrentUser) setCurrentUser(res.data);
      localStorage.setItem("fastfood_user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Gabim në shtimin e pikave:", error);
    }
  };

  const generateCoupon = async (pointsCost: number, discount: number) => {
    if (!currentUser || userPoints < pointsCost) {
      alert("Nuk keni pika të mjaftueshme!");
      return;
    }

    const newCoupon: Coupon = {
      id: `COUPON-${Date.now()}`,
      code: `SAVE${discount}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      discount,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      used: false,
    };

    const newPoints = userPoints - pointsCost;
    const updatedCoupons = [...userCoupons, newCoupon];

    try {
      const res = await axios.patch<User>(
        `${baseURL}/users/${currentUser.id}`,
        {
          points: newPoints,
          coupons: updatedCoupons,
        }
      );

      setUserPoints(newPoints);
      setUserCoupons(updatedCoupons);
      if (setCurrentUser) setCurrentUser(res.data);
      localStorage.setItem("fastfood_user", JSON.stringify(res.data));

      alert(`Kuponi juaj: ${newCoupon.code}`);
    } catch (error) {
      console.error("Gabim në gjenerimin e kuponit:", error);
    }
  };

  const applyCoupon = async (
    couponCode: string
  ): Promise<{ valid: boolean; discount: number }> => {
    if (!currentUser) return { valid: false, discount: 0 };

    const coupon = userCoupons.find(
      (c) =>
        c.code === couponCode && !c.used && new Date(c.expiresAt) > new Date()
    );

    if (!coupon) {
      return { valid: false, discount: 0 };
    }

    return { valid: true, discount: coupon.discount };
  };

  const markCouponAsUsed = async (couponCode: string) => {
    if (!currentUser) return;

    const updatedCoupons = userCoupons.map((c) =>
      c.code === couponCode ? { ...c, used: true } : c
    );

    try {
      const res = await axios.patch<User>(
        `${baseURL}/users/${currentUser.id}`,
        {
          coupons: updatedCoupons,
        }
      );

      setUserCoupons(updatedCoupons);
      if (setCurrentUser) setCurrentUser(res.data);
      localStorage.setItem("fastfood_user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Gabim në shënimin e kuponit:", error);
    }
  };

  // FUNKSIONET EREJA PËR WHEEL
  const canSpinToday = (): boolean => {
    if (!currentUser) return false;

    const lastSpin = currentUser.lastSpinDate;
    if (!lastSpin) return true;

    const lastSpinDate = new Date(lastSpin);
    const today = new Date();

    // Kontrollo nëse është i njëjti ditë
    return (
      lastSpinDate.getDate() !== today.getDate() ||
      lastSpinDate.getMonth() !== today.getMonth() ||
      lastSpinDate.getFullYear() !== today.getFullYear()
    );
  };

  const spinWheel = async (discount: number) => {
    if (!currentUser) return;

    // Gjenero kuponin e ri
    const newCoupon: Coupon = {
      id: `WHEEL-${Date.now()}`,
      code: `LUCKY${discount}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      discount,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 ditë
      used: false,
    };

    const updatedCoupons = [...userCoupons, newCoupon];
    const today = new Date().toISOString();

    try {
      const res = await axios.patch<User>(
        `${baseURL}/users/${currentUser.id}`,
        {
          coupons: updatedCoupons,
          lastSpinDate: today,
        }
      );

      setUserCoupons(updatedCoupons);
      if (setCurrentUser) setCurrentUser(res.data);
      localStorage.setItem("fastfood_user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Gabim në spin wheel:", error);
    }
  };

  return (
    <RewardsContext.Provider
      value={{
        userPoints,
        userCoupons,
        addPoints,
        generateCoupon,
        applyCoupon,
        markCouponAsUsed,
        canSpinToday,
        spinWheel,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const ctx = useContext(RewardsContext);
  if (!ctx)
    throw new Error("useRewards duhet të përdoret brenda RewardsProvider");
  return ctx;
};
