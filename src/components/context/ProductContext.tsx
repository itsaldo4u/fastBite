import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
  const baseURL = "http://localhost:3000";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>(`${baseURL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Gabim në marrjen e produkteve:", error);
    }
  };

  const addProduct = async (data: Omit<Product, "id">) => {
    await axios.post(`${baseURL}/products`, data);
    await fetchProducts();
  };
  const updateProduct = async (id: string, data: Omit<Product, "id">) => {
    await axios.patch(`${baseURL}/products/${id}`, data);
    await fetchProducts();
  };
  const deleteProduct = async (id: string) => {
    await axios.delete(`${baseURL}/products/${id}`);
    setProducts((p) => p.filter((prod) => prod.id !== id));
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
