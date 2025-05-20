
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { Plus } from "lucide-react";
import { NewProduct, Product } from "@/types/product";
import { useProductsApi } from "@/hooks/products/useProductsApi";

export default function ProductsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isLoading, addProduct, updateProduct, deleteProduct } = useProductsApi();
  const location = useLocation();
  const inChatMode = location.state?.fromChat || false;

  const handleAddProduct = (product: NewProduct) => {
    addProduct(product);
    setDialogOpen(false);
  };

  const handleUpdateProduct = (product: Product) => {
    updateProduct(product);
  };

  return (
    <AppLayout title="Товары" activePage="products">
      <div className="relative h-full flex flex-col">
        <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8]">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-[#1a73e8]">
              {inChatMode ? "Выберите товар для чата" : "Управление товарами"}
            </h1>
            
            {!inChatMode && (
              <Button 
                onClick={() => setDialogOpen(true)}
                className="h-9"
              >
                <Plus className="h-4 w-4 mr-1" />
                Новый товар
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <ProductsGrid
            onDelete={!inChatMode ? deleteProduct : undefined}
            onUpdate={!inChatMode ? handleUpdateProduct : undefined}
            inChatMode={inChatMode}
          />
        </div>
        
        {/* Floating action button for adding products (only show in normal mode on mobile) */}
        {!inChatMode && (
          <Button 
            className="md:hidden fixed right-4 bottom-20 h-14 w-14 rounded-full shadow-lg z-10"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
        
        <AddProductDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddProduct={handleAddProduct}
        />
      </div>
    </AppLayout>
  );
}
