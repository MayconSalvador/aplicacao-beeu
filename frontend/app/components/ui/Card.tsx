import { ReactNode } from "react";

type Padding = "sm" | "md" | "lg";

type CardPropsBase = {
  accent?: boolean;
  padding?: Padding;
  title?: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
};

type CardDivProps = CardPropsBase & { as?: "div" };
type CardAnchorProps = CardPropsBase & { as: "a"; href: string };

export default function Card(props: CardDivProps | CardAnchorProps) {
  const {
    as = "div",
    accent = true,
    padding = "md",
    title,
    subtitle,
    actions,
    className = "",
    children,
  } = props as CardDivProps;

  const paddingClass = padding === "sm" ? "p-3" : padding === "lg" ? "p-5" : "p-4";
  const baseClass = `brand-card ${className}`.trim();

  if (as === "a") {
    const { href } = props as CardAnchorProps;
    return (
      <a href={href} className={`${baseClass} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
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
      </a>
    );
  }

  return (
    <div className={baseClass}>
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