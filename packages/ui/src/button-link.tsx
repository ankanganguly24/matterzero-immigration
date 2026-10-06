import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
};

export function ButtonLink({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`button button--${variant} ${className}`.trim()} {...props}>
      {children}
      <span aria-hidden="true" className="button__arrow">
        ↗
      </span>
    </a>
  );
}
