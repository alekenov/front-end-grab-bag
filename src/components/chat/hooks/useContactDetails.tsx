
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useContactDetails(initialName: string = "Иван Петров", initialTags: string[] = ["пионы", "самовывоз"]) {
  const [contactName, setContactName] = useState(initialName);
  const [contactTags, setContactTags] = useState<string[]>(initialTags);
  const { toast } = useToast();

  const handleUpdateContact = async (name: string, tags: string[]) => {
    setContactName(name);
    setContactTags(tags);
    
    try {
      toast({
        title: "Данные клиента обновлены",
        description: "Имя и теги успешно сохранены",
      });
    } catch (error) {
      console.error('Ошибка при обновлении данных клиента:', error);
      toast({
        title: "Данные сохранены локально",
        description: "API недоступно, но изменения применены в интерфейсе",
      });
    }
  };

  return {
    contactName,
    contactTags,
    handleUpdateContact
  };
}
