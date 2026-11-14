"use client";

import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const variantPadding: Record<string, string> = {
  default: "p-6",
  sm: "p-4",
  lg: "p-8",
};

export function Card({ variant = "default", className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "card",
        variantPadding[variant],
        className,
      ].join(" ").trim()}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export function CardHeader({ title, subtitle, className = "", ...props }: CardHeaderProps) {
  return (
    <div className={["card-header", className].join(" ").trim()} {...props}>
      {title && (
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
