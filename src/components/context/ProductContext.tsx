import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export type Product = {
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
};

type ProductContextType = {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (data: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, data: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>(`${baseURL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e produkteve:", error);
      toast.error("Gabim gjatë marrjes së produkteve.");
    }
  };

  const addProduct = async (data: Omit<Product, "id">) => {
    try {
      const payload = {
        ...data,
        rating: data.rating ?? 0,
        ratingCount: data.ratingCount ?? 0,
      };
      await axios.post(`${baseURL}/products`, payload);
      await fetchProducts();
      toast.success("Produkti u shtua me sukses!");
    } catch (error) {
      console.error(error);
      toast.error("Gabim gjatë shtimit të produktit.");
    }
  };

  const updateProduct = async (id: string, data: Omit<Product, "id">) => {
    try {
      const payload = {
        ...data,
        rating: data.rating ?? 0,
        ratingCount: data.ratingCount ?? 0,
      };
      await axios.put(`${baseURL}/products/${id}`, payload);
      await fetchProducts();
      toast.success("Produkti u përditësua me sukses!");
    } catch (error) {
      console.error(error);
      toast.error("Gabim gjatë përditësimit të produktit.");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/products/${id}`);
      setProducts((p) => p.filter((prod) => prod.id !== id));
      toast.success("Produkti u fshi me sukses!");
    } catch (error) {
      console.error(error);
      toast.error("Gabim gjatë fshirjes së produktit.");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error("useProduct duhet të përdoret brenda ProductProvider");
  return ctx;
};
