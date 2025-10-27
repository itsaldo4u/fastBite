import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Users as UsersIcon,
  AlertTriangle,
  X,
  Save,
  Check,
  Mail,
  Phone,
  MapPin,
  Shield,
} from "lucide-react";
import { useUsers } from "../../context/UsersContext";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../context/AuthContext";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Konfirmo",
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-md border-2 border-gray-200 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6 ml-1">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Anulo
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserManagement() {
  const { users, loading, fetchUsers, updateUser, deleteUser } = useUsers();
  const { currentUser, updateRole } = useAuth();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [roleValue, setRoleValue] = useState<User["role"]>("user");
  const [apiError, setApiError] = useState<string>("");
  const [updateSuccess, setUpdateSuccess] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setRoleValue(editingUser.role);
      setApiError("");
      setUpdateSuccess("");
    }
  }, [editingUser]);

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.id) return;
    setApiError("");
    setUpdateSuccess("");

    try {
      await updateUser(editingUser.id, { role: roleValue });

      if (editingUser.id === currentUser?.id) {
        updateRole(editingUser.id, roleValue);
      }

      setUpdateSuccess(`Roli i ${editingUser.name} u përditësua me sukses.`);
      await fetchUsers();
      setTimeout(() => setEditingUser(null), 900);
    } catch (err) {
      console.error(err);
      setApiError("Gabim gjatë përditësimit të rolit. Provoni përsëri.");
    }
  };

  const requestDelete = (id: string) => {
    setUserToDeleteId(id);
    setIsDeleteModalOpen(true);
    setApiError("");
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    if (!userToDeleteId) return;
    setApiError("");
    try {
      await deleteUser(userToDeleteId);
      await fetchUsers();
      setUpdateSuccess("Përdoruesi u fshi me sukses.");
    } catch (err) {
      console.error(err);
      setApiError("Gabim gjatë fshirjes së përdoruesit.");
    } finally {
      setUserToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDeleteId(null);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setApiError("");
    setUpdateSuccess("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
            <UsersIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">Menaxhimi i Përdoruesve</h2>
            <p className="text-white/90 text-sm">
              Administro përdoruesit dhe rolet e tyre
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {apiError && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-red-700 dark:text-red-300">Gabim</p>
              <p className="text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {updateSuccess && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-green-700 dark:text-green-300">
                Sukses
              </p>
              <p className="text-green-600 dark:text-green-400">
                {updateSuccess}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-700">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Duke ngarkuar përdoruesit...
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600">
                    <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                      ID
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                      Emri
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                      Email
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white hidden md:table-cell">
                      Adresa
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-gray-800 dark:text-white">
                      Roli
                    </th>
                    <th className="p-4 text-center text-sm font-bold text-gray-800 dark:text-white">
                      Veprime
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u, index) => (
                    <tr
                      key={u.id}
                      className={`text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-800/50"
                      }`}
                    >
                      <td className="p-4">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {u.id}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-gray-900 dark:text-white">
                        {u.name}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-600 dark:text-blue-400 truncate">
                            {u.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="w-4 h-4 text-green-500" />
                          {u.phone || "-"}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                          <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="truncate">{u.address || "-"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold capitalize shadow-md ${
                            u.role === "admin"
                              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                            title="Ndrysho rolin"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => requestDelete(u.id!)}
                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                            title="Fshi përdoruesin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-t-2 border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
                <span className="text-lg">👥</span>
                Gjithsej {users.length} përdorues{users.length !== 1 && ""}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border-2 border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ndrysho Rolin</h3>
                    <p className="text-white/90 text-sm">{editingUser.name}</p>
                  </div>
                </div>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-lg text-white/90 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {updateSuccess && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    {updateSuccess}
                  </span>
                </div>
              )}

              {apiError && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-300 font-medium">
                    {apiError}
                  </span>
                </div>
              )}

              <form onSubmit={handleRoleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Shield className="w-4 h-4 text-purple-500" />
                    Roli
                  </label>
                  <select
                    value={roleValue}
                    onChange={(e) =>
                      setRoleValue(e.target.value as User["role"])
                    }
                    className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all text-gray-800 dark:text-white font-medium"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                    ℹ️ Nuk mund të ndryshohet ID apo fjalëkalimi nga ky modal.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-5 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Anulo
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Ruaj
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Konfirmo Fshirjen e Përdoruesit"
        message="A jeni të sigurt që dëshironi të fshini këtë përdorues? Ky veprim nuk kthehet."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Fshi Përdoruesin"
      />
    </div>
  );
}
