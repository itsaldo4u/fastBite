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
  category,
  discount,
  isNew,
  isCombo,
  rating = 0,
  onAddToCart,
}: ProductCardProps) {
  const discountedPrice = discount ? price - price * (discount / 100) : price;

  return (
    <div className="relative border border-white/10 bg-white/5 backdrop-blur-sm dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-yellow-500/20 transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col overflow-hidden">
      {/* Badge për status */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {isCombo && (
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow">
            Combo
          </span>
        )}
        {discount && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            -{discount}%
          </span>
        )}
        {isNew && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            I Ri
          </span>
        )}
      </div>

      {/* Imazhi */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-t-2xl"
      />

      {/* Detajet */}
      <div className="p-4 flex flex-col flex-grow text-white">
        <h3 className="text-lg font-bold text-yellow-400">{title}</h3>
        <p className="text-sm text-gray-300 mt-1 flex-grow">{description}</p>

        {/* Çmimi */}
        <div className="mt-3">
          {discount ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 line-through text-sm">
                ${price.toFixed(2)}
              </span>
              <span className="text-red-400 font-bold text-lg">
                ${discountedPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <p className="font-bold text-red-500 text-lg">
              ${price.toFixed(2)}
            </p>
          )}
        </div>

        <p className="mt-1 text-xs uppercase text-gray-400">{category}</p>

        {/* Rating */}
        <div className="flex items-center mt-2 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              fill={rating >= star ? "gold" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 text-yellow-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.75.75 0 011.04 0l2.517 2.513 3.495.51a.75.75 0 01.416 1.279l-2.53 2.465.597 3.482a.75.75 0 01-1.088.791L12 13.347l-3.127 1.643a.75.75 0 01-1.088-.79l.597-3.482-2.53-2.465a.75.75 0 01.416-1.28l3.495-.51 2.517-2.513z"
              />
            </svg>
          ))}
        </div>

        {/* Butoni Bli */}
        <button
          onClick={() => onAddToCart(id)}
          className="mt-4 bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-300 hover:to-red-600 text-black font-semibold py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-yellow-400/30"
          aria-label={`Shto ${title} në shportë`}
        >
          Bli
        </button>
      </div>
    </div>
  );
}
