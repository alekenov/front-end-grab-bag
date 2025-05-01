
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { NewProduct } from "@/types/product";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: NewProduct) => void;
}

export function AddProductDialog({ open, onOpenChange, onAddProduct }: AddProductDialogProps) {
  const [price, setPrice] = useState<string>("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!imageData || !price) return;
    
    setIsSubmitting(true);
    
    try {
      const priceNumber = parseInt(price.replace(/\D/g, ""), 10);
      
      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new Error("Введите корректную цену");
      }
      
      onAddProduct({
        imageUrl: imageData,
        price: priceNumber,
      });
      
      // Reset form
      setPrice("");
      setImageData(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить новый товар</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product-image">Фото букета</Label>
            <div 
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-48 ${
                imageData ? "border-primary" : "border-gray-300"
              }`}
            >
              {imageData ? (
                <div className="relative w-full h-full">
                  <img 
                    src={imageData} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-2 right-2"
                    onClick={() => setImageData(null)}
                  >
                    Изменить
                  </Button>
                </div>
              ) : (
                <label htmlFor="product-image" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Camera className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Выбрать фото из галереи</span>
                  <input 
                    id="product-image" 
                    type="file" 
                    accept="image/*" 
                    className="sr-only" 
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Цена (тенге)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Введите цену"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-lg"
              min="0"
              inputMode="numeric"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit} 
            disabled={!imageData || !price || isSubmitting}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
