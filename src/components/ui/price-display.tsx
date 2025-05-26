
import { cn } from "@/lib/utils";

export interface PriceDisplayProps {
  price: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "muted";
  className?: string;
}

export function PriceDisplay({ 
  price, 
  currency = "₸", 
  size = "md", 
  variant = "default",
  className 
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base font-medium",
    lg: "text-lg font-semibold"
  };

  const variantClasses = {
    default: "text-gray-900",
    primary: "text-[#1a73e8] font-bold",
    muted: "text-gray-600"
  };

  return (
    <span className={cn(
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {price.toLocaleString()} {currency}
    </span>
  );
}
