
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/products/ProductList";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { useProducts } from "@/hooks/useProducts";
import { Plus } from "lucide-react";
import { NewProduct } from "@/types/product";

export default function ProductsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { products, isLoading, addProduct, deleteProduct } = useProducts();

  const handleAddProduct = (product: NewProduct) => {
    addProduct(product);
    setDialogOpen(false);
  };

  return (
    <AppLayout title="Товары" activePage="products">
      <div className="relative h-full flex flex-col">
        <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8]">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-[#1a73e8]">Товары</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Загрузка товаров...</p>
            </div>
          ) : (
            <ProductList 
              products={products}
              onDelete={deleteProduct}
            />
          )}
        </div>
        
        {/* Floating action button for adding products */}
        <Button 
          className="fixed right-4 bottom-20 md:bottom-4 h-14 w-14 rounded-full shadow-lg z-10"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        <AddProductDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddProduct={handleAddProduct}
        />
      </div>
    </AppLayout>
  );
}
