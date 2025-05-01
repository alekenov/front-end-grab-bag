
import { useState, useEffect } from "react";
import { Product, NewProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "product_list";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load products from localStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список товаров",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save products to localStorage
  const saveProducts = (updatedProducts: Product[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить список товаров",
        variant: "destructive",
      });
    }
  };

  const addProduct = (newProduct: NewProduct) => {
    const product: Product = {
      ...newProduct,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, product];
    saveProducts(updatedProducts);
    
    toast({
      title: "Товар добавлен",
      description: `Новый товар добавлен за ${product.price} ₸`,
    });
    
    return product;
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    saveProducts(updatedProducts);
    
    toast({
      title: "Товар удален",
    });
  };

  return {
    products,
    isLoading,
    addProduct,
    deleteProduct,
  };
}
