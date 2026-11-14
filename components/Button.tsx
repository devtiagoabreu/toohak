"use client";

import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ai" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ai: "btn btn-ai",
  outline: "btn btn-outline",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  children,
  disabled,
  asChild = false,
  href,
  ...props
}: ButtonProps) {
  const baseClasses = [
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ].join(" ").trim();

  const spinner = (
    <span
      className="spinner"
      style={{ width: "1rem", height: "1rem", borderWidth: "2px", display: "inline-block" }}
    />
  );

  const content = (
    <>
      {leftIcon && <span style={{ marginRight: "0.5rem" }}>{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ marginLeft: "0.5rem" }}>{rightIcon}</span>}
    </>
  );

  if (asChild && href) {
    const anchorProps = props as Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    return (
      <a
        href={href}
        className={baseClasses.replace("cursor-not-allowed", "")}
        {...anchorProps}
      >
        {isLoading ? spinner : content}
      </a>
    );
  }

  return (
    <button
      className={baseClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? spinner : content}
    </button>
  );
}
