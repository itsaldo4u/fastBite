import { useEffect, useState } from "react";

type Offer = {
  id: number;
  title: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  image: string;
};

type OfferFormProps = {
  offer: Offer | null;
  onSubmit: (data: Omit<Offer, "id">, id?: number) => void;
  onCancel: () => void;
};

export default function OfferForm({
  offer,
  onSubmit,
  onCancel,
}: OfferFormProps) {
  const [formData, setFormData] = useState<Omit<Offer, "id">>({
    title: "",
    description: "",
    oldPrice: 0,
    newPrice: 0,
    image: "",
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title,
        description: offer.description,
        oldPrice: offer.oldPrice,
        newPrice: offer.newPrice,
        image: offer.image,
      });
    }
  }, [offer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "oldPrice" || name === "newPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, offer?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
        {offer ? "✏️ Përditëso Ofertën" : "➕ Shto Ofertë"}
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium">Titulli</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Përshkrimi</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={2}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">
            Çmimi i Vjetër
          </label>
          <input
            name="oldPrice"
            type="number"
            min="0"
            value={formData.oldPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Çmimi i Ri</label>
          <input
            name="newPrice"
            type="number"
            min="0"
            value={formData.newPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">URL e Imazhit</label>
        <input
          name="image"
          type="text"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="w-full mt-2 h-32 object-cover rounded"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Anulo
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
        >
          {offer ? "Përditëso" : "Shto"}
        </button>
      </div>
    </form>
  );
}
