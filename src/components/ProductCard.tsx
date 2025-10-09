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
  onAddToCart: (id: string) => void;
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
  onAddToCart,
}: ProductCardProps) {
  const discountedPrice = discount ? price - price * (discount / 100) : price;

  return (
    <div className="relative bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
      {/* Badges */}
      <div className="absolute top-3 left-3 flex space-x-2">
        {isCombo && (
          <span className="px-2 py-1 bg-yellow-400 text-black text-xs rounded-full font-bold">
            Combo
          </span>
        )}
        {discount && (
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

      {/* Image */}
      <div className="w-full h-32 sm:h-40 md:h-44 lg:h-36 xl:h-40 rounded-xl overflow-hidden mb-3">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Title & Description */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-yellow-400 mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-gray-300 text-sm mb-2 line-clamp-2">{description}</p>
      </div>

      {/* Price & Rating */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          {discount ? (
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
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= rating ? "text-yellow-400" : "text-gray-600"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.431 8.21 1.192-5.938 5.787 1.403 8.186L12 18.896l-7.343 3.865 1.403-8.186L.122 9.21l8.21-1.192z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(id)}
          className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-red-500 text-black font-semibold py-1 px-3 rounded-full transition-all duration-300 shadow-md hover:shadow-yellow-400/40"
          aria-label={`Shto ${title} në shportë`}
        >
          Bli
        </button>
      </div>
    </div>
  );
}
