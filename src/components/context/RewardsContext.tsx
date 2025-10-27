import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import type { Coupon } from "./AuthContext";

type RewardsContextType = {
  userPoints: number;
  userCoupons: Coupon[];
  lastSpinDate: string | null;
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
  const { currentUser } = useAuth();
  const [userPoints, setUserPoints] = useState(0);
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null);

  const baseURL = process.env.REACT_APP_API_URL + "/rewards";

  // Merr reward për userin aktual nga backend
  const fetchRewards = async () => {
    if (!currentUser?.id) return;

    try {
      const res = await axios.get(`${baseURL}/user/${currentUser.id}`);
      const reward = res.data;

      setUserPoints(reward.points || 0);
      setUserCoupons(reward.coupons || []);
      setLastSpinDate(reward.lastSpinDate || null);
    } catch (error) {
      console.error("Gabim në marrjen e rewards:", error);
      // Nëse reward nuk ekziston, krijo një të ri
      try {
        const { data: newReward } = await axios.post(baseURL, {
          userId: currentUser.id,
          points: 0,
          coupons: [],
          lastSpinDate: null,
        });
        setUserPoints(newReward.points || 0);
        setUserCoupons(newReward.coupons || []);
        setLastSpinDate(newReward.lastSpinDate || null);
      } catch (err) {
        console.error("Gabim në krijimin e reward të ri:", err);
      }
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [currentUser]);

  // Përditëso reward në backend
  const updateReward = async (
    updateData: Partial<{
      points: number;
      coupons: Coupon[];
      lastSpinDate: string;
    }>
  ) => {
    if (!currentUser?.id) return;

    try {
      await axios.patch(`${baseURL}/${currentUser.id}`, updateData);
    } catch (error) {
      console.error("Gabim në përditësimin e reward:", error);
    }
  };

  // Shto pika
  const addPoints = async (points: number) => {
    const newPoints = userPoints + points;
    setUserPoints(newPoints);
    await updateReward({ points: newPoints });
  };

  // Gjenero kupon nga pikat
  const generateCoupon = async (pointsCost: number, discount: number) => {
    if (userPoints < pointsCost) {
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

    const updatedCoupons = [...userCoupons, newCoupon];
    const newPoints = userPoints - pointsCost;

    setUserPoints(newPoints);
    setUserCoupons(updatedCoupons);

    await updateReward({ points: newPoints, coupons: updatedCoupons });
    alert(`Kuponi juaj: ${newCoupon.code}`);
  };

  // Apliko kupon
  const applyCoupon = async (couponCode: string) => {
    const coupon = userCoupons.find(
      (c) =>
        c.code === couponCode && !c.used && new Date(c.expiresAt) > new Date()
    );
    if (!coupon) return { valid: false, discount: 0 };
    return { valid: true, discount: coupon.discount };
  };

  // Shëno kuponin si përdorur
  const markCouponAsUsed = async (couponCode: string) => {
    const updatedCoupons = userCoupons.map((c) =>
      c.code === couponCode ? { ...c, used: true } : c
    );
    setUserCoupons(updatedCoupons);
    await updateReward({ coupons: updatedCoupons });
  };

  // Kontrollo nëse mund të rrotullohet rrota sot
  const canSpinToday = (): boolean => {
    if (!lastSpinDate) return true;
    const last = new Date(lastSpinDate);
    const today = new Date();
    return last.toDateString() !== today.toDateString();
  };

  // Rrotullo rrotën dhe gjenero kupon të ri
  const spinWheel = async (discount: number) => {
    if (!currentUser?.id) return;

    const newCoupon: Coupon = {
      id: `WHEEL-${Date.now()}`,
      code: `LUCKY${discount}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      discount,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      used: false,
    };

    const updatedCoupons = [...userCoupons, newCoupon];
    const today = new Date().toISOString();

    setUserCoupons(updatedCoupons);
    setLastSpinDate(today);

    try {
      // Dërgo discount tek backend
      await axios.put(`${baseURL}/spin/${currentUser.id}`, { discount });
      await updateReward({ coupons: updatedCoupons, lastSpinDate: today });
    } catch (error) {
      console.error("Gabim gjatë rrotullimit të rrotës:", error);
    }
  };

  return (
    <RewardsContext.Provider
      value={{
        userPoints,
        userCoupons,
        lastSpinDate,
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
