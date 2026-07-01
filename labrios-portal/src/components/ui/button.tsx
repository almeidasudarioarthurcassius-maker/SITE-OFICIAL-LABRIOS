import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all focus:outline-none disabled:opacity-50",
          variant === "primary" && "background bg-navy text-white hover:bg-navy-dark",
          variant === "secondary" && "background bg-green text-white hover:bg-green-light",
          variant === "danger" && "background bg-red-100 text-red-700 border border-red-200 hover:bg-red-700 hover:text-white",
          variant === "outline" && "border border-navy text-navy bg-white hover:bg-navy hover:text-white",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";