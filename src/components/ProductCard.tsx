export type ProductCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
  isNew?: boolean;
  isCombo?: boolean;
  rating?: number;
  ratingCount?: number;
  onAddToCart: (id: string, price: number) => void; // ✅ ndryshuar
};

export default function ProductCard({
  id,
  title,
  description,
  price,
  image,
  discount,
  isNew,
  isCombo,
  rating = 0,
  ratingCount = 0,
  onAddToCart,
}: ProductCardProps) {
  // ✅ Llogarit çmimin me zbritje (nëse ka)
  const discountedPrice = discount ? price - price * (discount / 100) : price;

  // Funksion për vizatimin e yjeve
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const fillLevel = rating - i;
      let fillClass = "fill-none";
      let strokeClass = "text-gray-300";

      if (fillLevel >= 1) {
        fillClass = "fill-yellow-400";
        strokeClass = "text-yellow-400";
      } else if (fillLevel >= 0.5) {
        fillClass = "fill-yellow-300";
        strokeClass = "text-yellow-300";
      }

      return (
        <svg
          key={i}
          className={`w-4 h-4 ${strokeClass}`}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            className={fillClass}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      );
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
      {/* 🏷️ Badges */}
      <div className="absolute top-3 left-3 flex space-x-2 z-10">
        {isCombo && (
          <span className="px-2 py-1 bg-yellow-400 text-black text-xs rounded-full font-bold">
            Combo
          </span>
        )}
        {discount !== undefined && discount > 0 && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
            -{discount}%
          </span>
        )}

        {isNew && (
          <span className="px-2 py-1 bg-pink-500 text-white text-xs rounded-full font-bold">
            I Ri
          </span>
        )}
      </div>

      {/* 🖼️ Image */}
      <div className="w-full h-32 sm:h-40 md:h-44 lg:h-36 xl:h-40 rounded-xl overflow-hidden mb-3">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* 📜 Title & Description */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-yellow-400 mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-gray-300 text-sm mb-2 line-clamp-2">{description}</p>
      </div>

      {/* 💲 Price & ⭐ Rating */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          {discount && discount > 0 ? (
            <div className="flex items-baseline space-x-2">
              <span className="line-through text-gray-400 text-sm">
                ${price.toFixed(2)}
              </span>
              <span className="text-white font-bold">
                ${discountedPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-white font-bold">${price.toFixed(2)}</span>
          )}

          {/* ⭐ Rating */}
          <div className="flex mt-1 items-center gap-1">
            <div className="flex gap-0.5">{renderStars(rating)}</div>
            <span className="text-yellow-400 text-xs font-semibold ml-1">
              {rating > 0 ? rating.toFixed(1) : "0.0"}
            </span>
            {ratingCount > 0 && (
              <span className="text-gray-400 text-xs">({ratingCount})</span>
            )}
          </div>
        </div>

        {/* 🛒 Add to Cart */}
        <button
          onClick={() => onAddToCart(id, discountedPrice)} // ✅ tani kalon çmimin real
          className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-red-500 text-black font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-yellow-400/40 hover:scale-105"
          aria-label={`Shto ${title} në shportë`}
        >
          Bli
        </button>
      </div>
    </div>
  );
}
