
import { useState, useEffect } from "react";
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
import { Product } from "@/types/product";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (product: Product) => void;
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

export function EditProductDialog({ product, open, onOpenChange, onUpdate }: EditProductDialogProps) {
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product });
  const [imageData, setImageData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState<string>("");

  // Инициализация состояния при открытии диалога
  useEffect(() => {
    if (open) {
      setEditedProduct({ ...product });
      setImageData(null);
      setIsSubmitting(false);
      setNewCategory("");
    }
  }, [open, product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageData(result);
      setEditedProduct(prev => ({
        ...prev,
        imageUrl: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectCategory = (category: string) => {
    // Если выбрана опция "Создать новую категорию"
    if (category === "new") {
      return;
    }
    
    handleInputChange("category", category);
  };

  const handleCreateCategory = () => {
    if (newCategory.trim()) {
      handleInputChange("category", newCategory.trim());
      setNewCategory("");
    }
  };

  const handleSubmit = () => {
    if (!editedProduct.imageUrl || !editedProduct.price) return;
    
    setIsSubmitting(true);
    
    try {
      // Убеждаемся, что цена - число
      const priceValue = typeof editedProduct.price === 'string' 
        ? editedProduct.price 
        : String(editedProduct.price);
      
      const priceNumber = parseInt(priceValue.toString().replace(/\D/g, ""), 10);
      
      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new Error("Введите корректную цену");
      }
      
      // Создаем обновленный объект продукта
      const updatedProduct: Product = {
        ...editedProduct,
        price: priceNumber,
        name: editedProduct.name || `Букет за ${priceNumber} ₸`,
      };
      
      onUpdate(updatedProduct);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактировать товар</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 space-y-2">
              <Label htmlFor="product-image">Фото букета</Label>
              <div 
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-48 ${
                  imageData ? "border-primary" : "border-gray-300"
                }`}
              >
                {imageData || editedProduct.imageUrl ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imageData || editedProduct.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute bottom-2 right-2"
                      onClick={() => {
                        setImageData(null);
                        if (!imageData) {
                          // Если изменяли исходное изображение
                          handleInputChange("imageUrl", "");
                        }
                      }}
                    >
                      Изменить
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="product-image-edit" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <Camera className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Выбрать фото из галереи</span>
                    <input 
                      id="product-image-edit" 
                      type="file" 
                      accept="image/*" 
                      className="sr-only" 
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div className="col-span-4 space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                placeholder="Введите название букета"
                value={editedProduct.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            
            <div className="col-span-4 md:col-span-2 space-y-2">
              <Label htmlFor="price">Цена (тенге)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Введите цену"
                value={editedProduct.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                min="0"
                inputMode="numeric"
              />
            </div>
            
            <div className="col-span-4 md:col-span-2 space-y-2">
              <Label htmlFor="quantity">Количество</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Количество в наличии"
                value={editedProduct.quantity || 0}
                onChange={(e) => handleInputChange("quantity", parseInt(e.target.value, 10))}
                min="0"
                inputMode="numeric"
              />
            </div>
            
            <div className="col-span-4 space-y-2">
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
                  value={editedProduct.category || ""} 
                  onValueChange={(value) => {
                    if (value === "new") {
                      setNewCategory("");
                    } else {
                      handleSelectCategory(value);
                    }
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Создать новую категорию</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="col-span-4 space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Добавьте описание букета"
                value={editedProduct.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="resize-none h-24"
              />
            </div>
            
            <div className="col-span-4 flex items-center justify-between">
              <Label htmlFor="availability" className="cursor-pointer">Товар в наличии</Label>
              <Switch
                id="availability"
                checked={editedProduct.availability !== false}
                onCheckedChange={(checked) => handleInputChange("availability", checked)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit} 
            disabled={!editedProduct.imageUrl || !editedProduct.price || isSubmitting}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
