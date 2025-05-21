
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
import { NewProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductFormFields } from "./ProductFormFields";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: NewProduct) => void;
}

// Предопределенные категории
const PREDEFINED_CATEGORIES = [
  "Свадебные",
  "Праздничные",
  "Юбилейные",
  "На день рождения",
  "Корпоративные",
  "Другое"
];

export function AddProductDialog({ open, onOpenChange, onAddProduct }: AddProductDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [imageData, setImageData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setQuantity("1");
    setImageData(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!imageData || !price) {
      toast({
        title: "Ошибка",
        description: "Добавьте фото и укажите цену товара",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const priceNumber = parseInt(price.replace(/\D/g, ""), 10);
      const quantityNumber = parseInt(quantity, 10);
      
      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new Error("Введите корректную цену");
      }
      
      await onAddProduct({
        imageUrl: imageData,
        price: priceNumber,
        name: name || `Букет за ${priceNumber} ₸`,
        description: description || undefined,
        category: category || undefined,
        quantity: isNaN(quantityNumber) ? 1 : quantityNumber,
      });
      
      // Reset form
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить товар",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить новый товар</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <ProductImageUpload 
            imageData={imageData}
            onImageChange={setImageData}
          />
          
          <ProductFormFields
            name={name}
            setName={setName}
            price={price}
            setPrice={setPrice}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            quantity={quantity}
            setQuantity={setQuantity}
            predefinedCategories={PREDEFINED_CATEGORIES}
          />
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
