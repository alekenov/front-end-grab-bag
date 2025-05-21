
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductCategorySelect } from "./ProductCategorySelect";

interface ProductFormFieldsProps {
  name: string;
  setName: (name: string) => void;
  price: string;
  setPrice: (price: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  predefinedCategories: string[];
}

export function ProductFormFields({
  name,
  setName,
  price,
  setPrice,
  description,
  setDescription,
  category,
  setCategory,
  quantity,
  setQuantity,
  predefinedCategories,
}: ProductFormFieldsProps) {
  return (
    <>
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
      
      <ProductCategorySelect 
        category={category}
        onCategoryChange={setCategory}
        predefinedCategories={predefinedCategories}
      />
      
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
    </>
  );
}
