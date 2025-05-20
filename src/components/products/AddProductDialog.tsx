
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { NewProduct } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
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

  const handleSelectCategory = (selectedCategory: string) => {
    // Если выбрана опция "Создать новую категорию"
    if (selectedCategory === "new") {
      setCategory("");
      return;
    }
    
    setCategory(selectedCategory);
    setNewCategory("");
  };

  const handleCreateCategory = () => {
    if (newCategory.trim()) {
      setCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setNewCategory("");
    setQuantity("1");
    setImageData(null);
    setIsSubmitting(false);
  };

  const handleSubmit = () => {
    if (!imageData || !price) return;
    
    setIsSubmitting(true);
    
    try {
      const priceNumber = parseInt(price.replace(/\D/g, ""), 10);
      const quantityNumber = parseInt(quantity, 10);
      
      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new Error("Введите корректную цену");
      }
      
      onAddProduct({
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
    } catch (error) {
      console.error("Error adding product:", error);
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
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              placeholder="Введите название букета"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (тенге)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Введите цену"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                inputMode="numeric"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Количество</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Количество в наличии"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                inputMode="numeric"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="category">Категория</Label>
              {newCategory && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCreateCategory}
                >
                  Добавить
                </Button>
              )}
            </div>
            
            {newCategory ? (
              <Input
                placeholder="Название новой категории"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateCategory();
                  }
                }}
              />
            ) : (
              <Select 
                value={category} 
                onValueChange={handleSelectCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Создать новую категорию</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Добавьте описание букета"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none h-24"
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
