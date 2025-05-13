
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        custom: "", // Для пользовательских цветов
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  color?: string;
  onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, color, onRemove, children, ...props }, ref) => {
    // Если есть пользовательский цвет, используем его
    const customStyle = color 
      ? { 
          backgroundColor: color, 
          color: isLightColor(color) ? "#000" : "#fff",
          borderColor: "transparent"
        } 
      : {};
    
    return (
      <div
        ref={ref}
        className={cn(tagVariants({ variant: color ? "custom" : variant }), className)}
        style={customStyle}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Remove</span>
          </button>
        )}
      </div>
    );
  }
);
Tag.displayName = "Tag";

// Функция для определения яркости цвета
function isLightColor(color: string): boolean {
  // Конвертируем цвет в RGB
  let r, g, b;
  
  // Для HEX цветов
  if (color.charAt(0) === '#') {
    const hex = color.substring(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } 
  // Для RGB цветов
  else if (color.startsWith('rgb')) {
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      r = parseInt(rgb[0], 10);
      g = parseInt(rgb[1], 10);
      b = parseInt(rgb[2], 10);
    } else {
      return false;
    }
  } else {
    return false;
  }
  
  // Формула для определения яркости (из W3C)
  // Если яркость > 128, считаем цвет светлым
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

export { Tag, tagVariants };
