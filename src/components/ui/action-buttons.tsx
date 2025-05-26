
import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionButtonConfig {
  id: string;
  label: string;
  icon?: LucideIcon;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick: () => void;
}

export interface ActionButtonsProps {
  buttons: ActionButtonConfig[];
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

export function ActionButtons({ 
  buttons, 
  orientation = "horizontal", 
  spacing = "md",
  className 
}: ActionButtonsProps) {
  const spacingClasses = {
    sm: orientation === "horizontal" ? "space-x-1" : "space-y-1",
    md: orientation === "horizontal" ? "space-x-2" : "space-y-2", 
    lg: orientation === "horizontal" ? "space-x-4" : "space-y-4"
  };

  const containerClasses = cn(
    "flex",
    orientation === "horizontal" ? "flex-row" : "flex-col",
    spacingClasses[spacing],
    className
  );

  return (
    <div className={containerClasses}>
      {buttons.map((button) => {
        const Icon = button.icon;
        
        return (
          <Button
            key={button.id}
            variant={button.variant || "default"}
            size={button.size || "default"}
            disabled={button.disabled || button.loading}
            onClick={button.onClick}
            className={cn(button.className)}
          >
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {button.loading ? "Загрузка..." : button.label}
          </Button>
        );
      })}
    </div>
  );
}

export interface SingleActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  label: string;
  icon?: LucideIcon;
  loading?: boolean;
  onClick: () => void;
}

export function ActionButton({ 
  label, 
  icon: Icon, 
  loading, 
  onClick, 
  disabled,
  className,
  ...props 
}: SingleActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {loading ? "Загрузка..." : label}
    </Button>
  );
}
