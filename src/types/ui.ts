
import { LucideIcon } from "lucide-react";
import { Product } from "./product";
import { OrderStatus, PaymentStatus } from "./order";

// Базовые UI типы
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Типы для работы с продуктами
export interface ProductCardProps extends BaseComponentProps {
  product: Product;
  onDelete?: (id: string) => void;
  onUpdate?: (product: Product) => void;
  inChatMode?: boolean;
  viewMode?: "grid" | "list";
}

export interface ProductActionsProps {
  product: Product;
  inChatMode: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddToChat?: () => void;
}

// Типы для отображения цены
export interface PriceConfig {
  amount: number;
  currency?: string;
  formatted?: string;
}

// Типы для статусов
export interface StatusConfig {
  value: OrderStatus | PaymentStatus | string;
  type: "order" | "payment" | "custom";
  label?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

// Типы для действий
export interface ActionConfig {
  id: string;
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

// Типы для форм
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

// Типы для модальных окон
export interface DialogProps extends BaseComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
}

// Типы для списков
export interface ListItemProps<T = any> extends BaseComponentProps {
  item: T;
  onSelect?: (item: T) => void;
  selected?: boolean;
  actions?: ActionConfig[];
}

// Типы для фильтров
export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "range" | "checkbox";
  options?: { value: string; label: string }[];
  value?: any;
  onChange: (value: any) => void;
}

// Типы для поиска
export interface SearchConfig {
  query: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
}

// Типы для пагинации
export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}
