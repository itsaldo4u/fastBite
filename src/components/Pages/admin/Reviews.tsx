import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2 } from "lucide-react";

type Review = {
  id: string;
  userId: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
};

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/ratings");
      setReviews(res.data);
    } catch (err) {
      setError("Gabim gjatë marrjes së vlerësimeve.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    const confirmed = window.confirm(
      "A jeni i sigurt që doni të fshini këtë vlerësim?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/ratings/${id}`);
      fetchReviews();
    } catch {
      alert("Gabim gjatë fshirjes së vlerësimit.");
    }
  };

  // Sortimi sipas opsionit
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

  // Paginimi
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Vlerësimet e Përdoruesve
      </h2>

      {/* Filtri Sort */}
      <div className="flex justify-end mb-6">
        <label className="text-gray-700 dark:text-gray-300 font-semibold mr-2 self-center">
          Sorto:
        </label>
        <select
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value as SortOption);
            setCurrentPage(1); // Reset page kur ndryshon sortimin
          }}
        >
          <option value="newest">Më të Fundit</option>
          <option value="oldest">Më të Parët</option>
          <option value="highest">Rating më i Lartë</option>
          <option value="lowest">Rating më i Ulët</option>
        </select>
      </div>

      {loading && (
        <p className="text-center text-orange-500 animate-pulse font-semibold">
          Duke ngarkuar vlerësimet...
        </p>
      )}

      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Nuk ka vlerësime.
        </p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          <ul className="space-y-6">
            {paginatedReviews.map((r) => (
              <li
                key={r.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-start"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {r.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 mb-3 whitespace-pre-wrap">
                    {r.comment}
                  </p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < r.rating
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }
                        fill={i < r.rating ? "#facc15" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => deleteReview(r.id)}
                  title="Fshi vlerësimin"
                  className="text-red-600 hover:text-red-800 transition ml-auto mt-4 sm:mt-0 flex items-center gap-1 font-semibold"
                >
                  <Trash2 size={18} />
                  Fshi
                </button>
              </li>
            ))}
          </ul>

          {/* Paginimi */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  currentPage === 1
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-orange-400 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
                } transition`}
              >
                Mbrapa
              </button>
              <span className="flex items-center text-gray-700 dark:text-gray-300 font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  currentPage === totalPages
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-orange-400 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
                } transition`}
              >
                Para
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
