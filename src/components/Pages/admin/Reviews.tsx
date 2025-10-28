import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Star,
  Trash2,
  AlertTriangle,
  MessageSquare,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/ratings`;

type Review = {
  _id?: string;
  id: string;
  userId: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
};

type SortOption = "newest" | "oldest" | "highest" | "lowest";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-2xl w-full max-w-sm border-2 border-gray-200 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
          <div className="p-2.5 sm:p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-5 sm:mb-6 ml-1">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all duration-200 transform hover:scale-105 order-2 sm:order-1"
          >
            Anulo
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 order-1 sm:order-2"
          >
            Fshije
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);

  const REVIEWS_PER_PAGE = 5;
  const ADMIN_USER_ID = "admin-12345";

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get<Review[]>(API_URL);
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        "Gabim gjatë marrjes së vlerësimeve. Kontrollo URL-në e backend-it."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeletionRequest = (id: string) => {
    setReviewToDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    if (!reviewToDeleteId) return;

    try {
      await axios.delete(`${API_URL}/${reviewToDeleteId}`);
      fetchReviews();
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Gabim gjatë fshirjes së vlerësimit. Provoni përsëri.");
    } finally {
      setReviewToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setReviewToDeleteId(null);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={
          i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
        }
        fill={i < rating ? "#facc15" : "none"}
        strokeWidth={1.5}
      />
    ));
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg flex-shrink-0">
            <Star className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-3xl font-bold mb-0.5 sm:mb-1">
              Menaxhimi i Vlerësimeve
            </h2>
            <p className="text-white/90 text-xs sm:text-sm">
              Shiko dhe menaxho feedback-un e klientëve
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Stats Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
              Gjithsej vlerësime:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {reviews.length}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <label className="text-gray-700 dark:text-gray-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
              Sorto:
            </label>
            <select
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all text-gray-800 dark:text-white font-medium text-sm"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value as SortOption);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Më të Fundit</option>
              <option value="oldest">Më të Parët</option>
              <option value="highest">Rating më i Lartë</option>
              <option value="lowest">Rating më i Ulët</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
              Duke ngarkuar vlerësimet...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-red-500 rounded-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-red-700 dark:text-red-300 text-sm sm:text-base">
                Gabim
              </p>
              <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviews.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full mb-4">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400">
              Nuk ka vlerësime të regjistruara.
            </p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {paginatedReviews.map((r, index) => (
            <div
              key={`${r.id || r._id}-${index}`}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-2xl border-2 border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.01]"
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex gap-0.5 sm:gap-1">
                        {renderStars(r.rating)}
                      </div>
                      <span className="px-2.5 py-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-bold text-xs sm:text-sm shadow-md whitespace-nowrap">
                        {r.rating}/5
                      </span>
                    </div>

                    {/* User Info */}
                    <div>
                      <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                        <span className="truncate">{r.name}</span>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <span>📅</span>
                        <span className="truncate">
                          {new Date(r.createdAt).toLocaleString("sq-AL", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Delete Button for Admin */}
                  {r.userId === ADMIN_USER_ID && (
                    <button
                      onClick={() => handleDeletionRequest(r.id)}
                      title="Fshi vlerësimin"
                      className="p-2.5 sm:p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 active:scale-95 flex items-center gap-2 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline font-semibold text-sm">
                        Fshije
                      </span>
                    </button>
                  )}
                </div>

                {/* Comment */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed break-words">
                    {r.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-2xl border-2 border-gray-100 dark:border-gray-700">
              <div className="flex justify-center items-center gap-2 sm:gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold flex items-center gap-1.5 sm:gap-2 transition-all duration-200 text-sm sm:text-base ${
                    currentPage === 1
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Mbrapa</span>
                </button>

                <span className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-white font-bold rounded-lg border-2 border-gray-200 dark:border-gray-600 text-sm sm:text-base">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold flex items-center gap-1.5 sm:gap-2 transition-all duration-200 text-sm sm:text-base ${
                    currentPage === totalPages
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  <span className="hidden xs:inline">Para</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmo Fshirjen"
        message="Jeni i sigurt që dëshironi të fshini përgjithmonë këtë vlerësim? Ky veprim nuk mund të kthehet pas."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
