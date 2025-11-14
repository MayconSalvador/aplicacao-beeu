"use client";

import { ReactNode } from "react";

type Padding = "sm" | "md" | "lg";

export default function CardClient({
  accent = true,
  padding = "md",
  title,
  subtitle,
  actions,
  className = "",
  children,
}: {
  accent?: boolean;
  padding?: Padding;
  title?: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const paddingClass = padding === "sm" ? "p-3" : padding === "lg" ? "p-5" : "p-4";
  return (
    <div className={`brand-card ${className}`.trim()}>
      {accent && <div className="brand-accent" />}
      <div className={`${paddingClass} space-y-2`}>
        {(title || subtitle || actions) && (
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              {title && <h3 className="font-semibold">{title}</h3>}
              {subtitle && <div className="text-xs text-gray-600">{subtitle}</div>}
            </div>
            {actions}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}