import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Lista e Përdoruesve</h2>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-2">Emri</th>
            <th className="p-2">Email</th>
            <th className="p-2">Roli</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t dark:border-gray-700">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 capitalize">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
