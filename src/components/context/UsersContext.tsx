// UsersContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import type { User } from "./AuthContext";

type UsersContextType = {
  users: User[];
  fetchUsers: () => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const baseURL = "http://localhost:3000";

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${baseURL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e përdoruesve:", error);
    }
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    try {
      await axios.patch(`${baseURL}/users/${id}`, data);
      await fetchUsers();
    } catch (error) {
      console.error("Gabim gjatë përditësimit të përdoruesit:", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/users/${id}`);
      await fetchUsers();
    } catch (error) {
      console.error("Gabim gjatë fshirjes së përdoruesit:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{ users, fetchUsers, updateUser, deleteUser }}
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
