import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import type { User } from "./AuthContext";

type UsersContextType = {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string) => Promise<void>;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = "http://localhost:5000";

  // GET all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<User[]>(`${baseURL}/users`);
      const mappedUsers = res.data.map((u) => ({
        ...u,
        id: u._id!,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Gabim në marrjen e përdoruesve:", error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE user dhe kthen objektin e përditësuar
  const updateUser = async (
    id: string,
    data: Partial<User>
  ): Promise<User | null> => {
    if (!id) return null;
    setLoading(true);
    try {
      const res = await axios.put<User>(`${baseURL}/users/${id}`, data);
      const updatedUser = { ...res.data, id: res.data._id! };

      // Përditëso state vetëm për këtë user
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));

      return updatedUser;
    } catch (error) {
      console.error("Gabim gjatë përditësimit të përdoruesit:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // DELETE user
  const deleteUser = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Gabim gjatë fshirjes së përdoruesit:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{ users, loading, fetchUsers, updateUser, deleteUser }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers duhet të përdoret brenda UsersProvider");
  return ctx;
};
