
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductImageUploadProps {
  imageData: string | null;
  onImageChange: (imageData: string | null) => void;
}

export function ProductImageUpload({ imageData, onImageChange }: ProductImageUploadProps) {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверим размер файла (не более 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер изображения не должен превышать 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageChange(event.target?.result as string);
    };
    reader.onerror = () => {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
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
              onClick={() => onImageChange(null)}
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
  );
}
